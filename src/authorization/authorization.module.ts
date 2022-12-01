import { Module } from '@nestjs/common';
import { AuthorizationController } from './authorization.controller';
import { AuthorizationService } from './authorization.service';
import { UsersModule } from "../users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersEntity } from "../users/users.entity";


@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity]),
    UsersModule,
  ],
  controllers: [AuthorizationController],
  providers: [AuthorizationService]
})
export class AuthorizationModule {}
