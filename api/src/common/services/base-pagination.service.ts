import { Brackets, ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';
import {
  PaginationRequestDto,
  SortOrder,
} from '../pagination/dto/pagination-request.dto';
import { PaginationResponseDto } from '../pagination/dto/pagination-response.dto';
import { handleError } from '../utils/handle-error.util';
import { paginate } from '../pagination/pagination.util';

export abstract class BasePaginationService<T extends ObjectLiteral, K> {
  protected abstract repository: Repository<T>;

  /** Entity property paths for text columns (for example, nameEn). */
  protected SEARCHABLE_COLUMNS: string[] = [];
  /** Relation property paths, including nested paths such as permissions.children. */
  protected RELATIONSHIP_FIELDS: string[] = [];

  protected abstract getMapperResponseEntityField(entity: T): Promise<K>;

  /** Override to add entity-specific filters; retain the base query configuration. */
  protected createPaginationQueryBuilder(
    query: PaginationRequestDto,
  ): SelectQueryBuilder<T> {
    const builder = this.repository.createQueryBuilder('entity');

    const relationAliases = new Map<string, string>([['', 'entity']]);
    for (const relation of this.RELATIONSHIP_FIELDS) {
      let parentPath = '';
      for (const segment of relation.split('.')) {
        const path = parentPath ? `${parentPath}.${segment}` : segment;
        if (!relationAliases.has(path)) {
          const alias = `pagination_relation_${relationAliases.size}`;
          builder.leftJoinAndSelect(
            `${relationAliases.get(parentPath)}.${segment}`,
            alias,
          );
          relationAliases.set(path, alias);
        }
        parentPath = path;
      }
    }

    const search = query.search?.trim();
    if (search && this.SEARCHABLE_COLUMNS.length > 0) {
      builder.andWhere(
        new Brackets((where) => {
          for (const column of this.SEARCHABLE_COLUMNS) {
            where.orWhere(`entity.${column} ILIKE :paginationSearch`, {
              paginationSearch: `%${search}%`,
            });
          }
        }),
      );
    }

    // All primary columns provide deterministic ordering, including composite keys.
    for (const column of this.repository.metadata.primaryColumns) {
      builder.addOrderBy(
        `entity.${column.propertyPath}`,
        query.sortOrder ?? SortOrder.DESC,
      );
    }

    return builder;
  }

  public async list(
    query: PaginationRequestDto,
  ): Promise<PaginationResponseDto<K>> {
    try {
      const result = await paginate(
        this.createPaginationQueryBuilder(query),
        query,
      );

      return {
        data: await Promise.all(
          result.data.map((entity) => this.getMapperResponseEntityField(entity)),
        ),
        meta: result.meta,
      };
    } catch (error) {
      handleError(error);
    }
  }
}
