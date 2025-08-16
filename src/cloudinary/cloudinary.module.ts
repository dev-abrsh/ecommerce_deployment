import { Module, DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';


@Module({})
export class CloudinaryModule {
  static forRootAsync(): DynamicModule {
    return {
      module: CloudinaryModule,
      global: true,
      providers: [
        {
          provide: 'CLOUDINARY',
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => {
            cloudinary.config({
              cloud_name: configService.get<string>('cloudinary.cloudName'),
              api_key: configService.get<string>('cloudinary.apiKey'),
              api_secret: configService.get<string>('cloudinary.apiSecret'),
            });
            return cloudinary;
          },
        },
      ],
      exports: ['CLOUDINARY'],
    };
  }
}
