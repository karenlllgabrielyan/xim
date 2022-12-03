import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesEntity } from './files.entity';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy, RefreshTokenStrategy } from '../authorization/strategies';
import { UsersModule } from '../users/users.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([FilesEntity]),
    JwtModule.register({}),
    UsersModule,
  ],
  controllers: [FilesController],
  providers: [FilesService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class FilesModule {}
