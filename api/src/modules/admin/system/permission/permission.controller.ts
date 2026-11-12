import { Permissions } from '@/modules/auth/decorators/permission.decorator';
import { 
  Controller, 
  Get  
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { 
  ApiBearerAuth,
  ApiForbiddenResponse, 
  ApiOkResponse, 
  ApiOperation, 
  ApiTags, 
  ApiUnauthorizedResponse 
} from '@nestjs/swagger';
import { PermissionSelectOptionResponseDto } from './dto/permission-response.dto';
import { SWAGGER_TOKEN_NAME } from '@/swagger/config';

@ApiTags('Permissions')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/system/permissions',
  version: '1',
})
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @Permissions('role-read', 'role-create', 'role-update')
  @ApiOperation({ 
    summary: 'Find all permissions for select options' 
  })
  @ApiOkResponse({ 
    type: [PermissionSelectOptionResponseDto] 
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  public findAllForSelectOptions(): Promise<PermissionSelectOptionResponseDto[]> {
    return this.permissionService.findAllForSelectOptions();
  }

}
