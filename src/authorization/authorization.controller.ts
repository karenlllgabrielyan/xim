import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User_login_DTO, User_register_DTO } from './dto';
import { AuthorizationService } from './authorization.service';
import { AccessTokenGuard, RefreshTokenGuard } from './guards';


@ApiTags('Authorization')
@Controller()
export class AuthorizationController {
  constructor(private auth_svc: AuthorizationService) { }

  // ------------------------------------------------------------------- SIGN UP
  @ApiOperation({ summary: 'User sign up' })
  @ApiResponse({ status: 200 })
  @Post('signup')
  async register(@Body() args: User_register_DTO) {
    return this.auth_svc.register(args);
  }

  // ------------------------------------------------------------------- SIGN IN
  @ApiOperation({ summary: 'User sign in' })
  @ApiResponse({ status: 200 })
  @Post('signin')
  async login(@Body() args: User_login_DTO) {
    return this.auth_svc.login(args);
  }

  // ------------------------------------------------------------------- NEW TOKEN
  @ApiOperation({ summary: 'Returns new token' })
  @ApiResponse({ status: 200 })
  @ApiBearerAuth()
  @UseGuards(RefreshTokenGuard)
  @Post('signin/new_token')
  async refreshToken(@Req() req) {
    return this.auth_svc.newToken({
      user_uuid: req.user.uuid,
      refresh_token: req.user.refreshToken,
    });
  }

  // ------------------------------------------------------------------- GET USER ID
  @ApiOperation({ summary: 'Get user uuid' })
  @ApiResponse({ status: 200 })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get('info')
  async getUserId(@Req() req) {
    return req.user.uuid;
  }

  // ------------------------------------------------------------------- LOGOUT
  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({ status: 200 })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get('logout')
  async logout(@Req() req) {
    return this.auth_svc.logout(req.user.uuid);
  }
}
