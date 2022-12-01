import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User_ResBody_DTO } from './dto/User.ResBody.dto';
import { AuthGuard } from '../authorization/auth-guard.service';


@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private user_svc: UsersService) { }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my profile data' })
  @ApiResponse({ status: 200, type: User_ResBody_DTO })
  @UseGuards(AuthGuard)
  @Get('/profile')
  async getMyProfile(@Req() req) {
    return this.user_svc.getMyProfile(req.user.uuid);
  }
}
