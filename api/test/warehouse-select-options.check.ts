import 'reflect-metadata';
import assert from 'node:assert/strict';
import { UnauthorizedException, ServiceUnavailableException } from '@nestjs/common';
import { WarehouseService } from '../src/modules/admin/master-data/warehouse/warehouse.service';
import { WarehouseEntity } from '../src/modules/admin/master-data/warehouse/entities/warehouse.entity';
import { UserResponseDto } from '../src/modules/admin/system/user/dto/user-response.dto';

async function main() {
  const assigned = new WarehouseEntity({ id: 'assigned', nameEn: 'Assigned', nameKh: 'Assigned', code: 'PRIVATE' });
  const other = new WarehouseEntity({ id: 'other', nameEn: 'Other', nameKh: 'Other' });
  let joinedUser: string | undefined;
  let failure: Error | undefined;
  let queries = 0;
  const query = {
    innerJoin(path: string, alias: string, condition: string, parameters: { userId: string }) {
      assert.equal(path, 'warehouse.users');
      assert.equal(condition, `${alias}.id = :userId`);
      joinedUser = parameters.userId;
      return this;
    },
    async getMany() {
      if (failure) throw failure;
      return joinedUser ? (joinedUser === 'assigned-user' ? [assigned] : []) : [assigned, other];
    },
  };
  const service = new WarehouseService({ createQueryBuilder: () => {
    queries++;
    joinedUser = undefined;
    return query;
  } } as any);
  const user = Object.assign(new UserResponseDto(), { id: 'assigned-user', isActive: true, isSuperUser: false });
  assert.deepEqual((await service.findAllForSelectOption(user)).map(item => ({ ...item })), [{ id: 'assigned', nameEn: 'Assigned', nameKh: 'Assigned' }]);
  assert.equal((await service.findAllForSelectOption({ ...user, isSuperUser: true })).length, 2);
  assert.equal(joinedUser, undefined);
  assert.deepEqual(await service.findAllForSelectOption({ ...user, id: 'unassigned-user' }), []);
  const before = queries;
  await assert.rejects(service.findAllForSelectOption(null as any), UnauthorizedException);
  await assert.rejects(service.findAllForSelectOption({ ...user, isActive: false, isSuperUser: true }), UnauthorizedException);
  assert.equal(queries, before);
  failure = Object.assign(new Error('Database unavailable'), { code: 'ECONNREFUSED' });
  await assert.rejects(service.findAllForSelectOption(user), ServiceUnavailableException);
  console.log('Warehouse select-option checks passed: assigned users, superusers, no assignments, invalid users, DTO fields, database failures.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
