import { Module } from '@nestjs/common';
import { AuthorizationController } from './authorization.controller';
import { AuthorizationService } from './authorization.service';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from '../users/users.entity';
import { RefreshTokenStrategy, AccessTokenStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([UsersEntity]),
    UsersModule,
  ],
  controllers: [AuthorizationController],
  providers: [AuthorizationService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthorizationModule {}
