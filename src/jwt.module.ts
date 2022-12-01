import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';


@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_KEY || 'SECRET',
      signOptions: {
        expiresIn: '10h',
      },
    }),
  ],
  exports: [JwtModule],
})
export class JWTGlobalModule {}
