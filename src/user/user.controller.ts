import { Controller, Get, Patch, Body, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/gurads/auth.guard';
import { UpdateProfileDto } from './dtos/updateProfile.dto';
import { UserService } from './user.service';
import { ChangePasswordDto } from './dtos/ChangePassword.dto';

@Controller('profile')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getProfile(@Req() req) {
    return this.userService.getProfile(req.user.userId);
  }

  @Patch()
  async updateProfile(@Req() req, @Body() updateDto: UpdateProfileDto) {
    return this.userService.updateProfile(req.user.userId, updateDto);
  }
  @Patch('change-password')
  async changePassword(@Req() req, @Body() dto: ChangePasswordDto) {
    return this.userService.changePassword(req.user.userId, dto);
  }
}
