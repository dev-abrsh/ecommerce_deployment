import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.model';
import { Model } from 'mongoose';
import { ChangePasswordDto } from './dtos/ChangePassword.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getProfile(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .select('name email phone address');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: string, updateData: Partial<User>) {
    const user = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true },
      )
      .select('name email phone address role is_verified createdAt updatedAt');

    if (!user) throw new NotFoundException('User not found');
    return user;
  }
  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.userModel.findById(userId);

    if (!user) throw new NotFoundException('User not found');

    const isMatch = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    user.password = hashed;
    await user.save();

    return { message: 'Password changed successfully' };
  }
}
