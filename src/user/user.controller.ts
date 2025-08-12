import {
  Controller,
  Get,
  Patch,
  Body,
  Req,
  UseGuards,
  Delete,
  Param,
} from '@nestjs/common';
import { AuthGuard } from 'src/gurads/auth.guard';
import { UpdateProfileDto } from './dtos/updateProfile.dto';
import { UserService } from './user.service';
import { ChangePasswordDto } from './dtos/ChangePassword.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/gurads/roles.decorator';
import { RolesGuard } from 'src/gurads/roles.gurad';

@Controller('users')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@Req() req) {
    return this.userService.getProfile(req.user.userId);
  }

  @Patch('profile')
  async updateProfile(@Req() req, @Body() updateDto: UpdateProfileDto) {
    return this.userService.updateProfile(req.user.userId, updateDto);
  }
  @Patch('profile/change-password')
  async changePassword(@Req() req, @Body() dto: ChangePasswordDto) {
    return this.userService.changePassword(req.user.userId, dto);
  }

  @Roles('admin') // Only admin can see all users
  @Get('')
  async getAllUsers() {
    return this.userService.getAllUsers();
  }
  @Roles('admin') // Only admin can get user by ID
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }
  @Roles('admin') // Only admin can delete users
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
