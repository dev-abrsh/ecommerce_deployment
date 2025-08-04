// auth/google.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptions, VerifyCallback } from 'passport-google-oauth20'; // 👈 Here
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private authService: AuthService
  ) {
    const options: StrategyOptions = {
      clientID: configService.get<string>('GOOGLE_CLIENT_ID')!,
      clientSecret: configService.get<string>('GOOGLE_SECRET')!,
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    };
    super(options);
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
    // const { name, emails, photos } = profile;
		console.log(profile);
    const user=await this.authService.validateGoogleUser({
      email: profile.emails[0].value,
      name: profile.name.displayName,
    })
    done(null, user);
}
}
