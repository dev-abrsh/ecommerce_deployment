import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './gurads/auth.guard';
import { RolesGuard } from './gurads/roles.gurad';
import { Roles } from './gurads/roles.decorator';

@UseGuards(AuthGuard, RolesGuard)
@Roles('admin') 
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  SomeProtectedRoute(@Req() req) {
    return { message: 'access granted to protected route', userId: req.userId };
  }
}
