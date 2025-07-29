import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, User } from 'src/user/user.model';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [MongooseModule.forFeature([{
    name: User.name,
    schema: UserSchema
    }]),
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
