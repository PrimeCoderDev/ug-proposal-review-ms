import { Controller, Get, Headers } from '@nestjs/common';
import { MenuService } from './menu.service';

@Controller('/v1/menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  findAll(@Headers('authorization') token: string) {
    return this.menuService.findAll(token);
  }
}
