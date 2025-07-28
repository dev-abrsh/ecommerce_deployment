import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config/config';

@Module({
  imports: [
    JwtModule.register({global:true, secret: "screetkey"}),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    AuthModule, 
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true, 
      cache: true,
      load: [config]
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
