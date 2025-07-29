import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/user.model';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MailModule } from 'src/mail/mail.module';
import { MailService } from 'src/mail/mail.service';


@Module({
  imports: [MailModule,MongooseModule.forFeature([{
    name: User.name,
    schema: UserSchema
    }]),
  ],
  controllers: [AuthController],
  providers: [AuthService,
    MailService
    ]
})
export class AuthModule {}
