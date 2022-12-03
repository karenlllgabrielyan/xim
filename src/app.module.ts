import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './users/users.entity';
import { AuthorizationModule } from './authorization/authorization.module';
import { FilesModule } from './files/files.module';
import { MulterModule } from '@nestjs/platform-express';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
      entities: [UsersEntity],
      synchronize: true,
      autoLoadEntities: true,
    }),
    MulterModule.register({
      dest: './files',
    }),
    AuthorizationModule,
    UsersModule,
    FilesModule,
  ],
})
export class AppModule {}
