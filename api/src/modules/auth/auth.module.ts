import { PermissionPolicy } from './permission.polocy';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../admin/system/user/user.module';
import { JwtAuthProvider } from './jwt-auth.provider';

@Module({
  imports: [
    UserModule,
  ],
  providers: [
    AuthService, 
    JwtAuthProvider, 
    PermissionPolicy
  ],
  controllers: [AuthController]
})
export class AuthModule {}
