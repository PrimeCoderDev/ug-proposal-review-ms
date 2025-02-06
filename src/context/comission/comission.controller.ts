import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { ComissionService } from './comission.service';
import {
  CreateHeaderComissionDto,
  CreateDetailComissionDto,
} from './dto/create-comission.dto';
import {
  UpdateHeaderComissionDto,
  UpdateDetailComissionDto,
} from './dto/update-comission.dto';

@Controller('/v1/comission')
export class ComissionController {
  constructor(private readonly comissionService: ComissionService) {}

  @Post('/header')
  async createHeader(
    @Body() createHeaderComissionDto: CreateHeaderComissionDto,
  ) {
    return this.comissionService.createHeader(createHeaderComissionDto);
  }

  @Get('/header')
  async findAllHeader() {
    return this.comissionService.findAllHeader();
  }

  @Get('/header/:id')
  async findOneHeader(@Param('id') id: string) {
    return this.comissionService.findOneHeader(id);
  }

  @Patch('/header/:id')
  async updateHeader(
    @Param('id') id: string,
    @Body() updateHeaderComissionDto: UpdateHeaderComissionDto,
  ) {
    return this.comissionService.updateHeader(id, updateHeaderComissionDto);
  }

  @Delete('/header/:id')
  async inactiveHeader(@Param('id') id: string) {
    return this.comissionService.inactiveHeader(id);
  }

  @Post('/detail')
  async createDetail(
    @Body() createDetailComissionDto: CreateDetailComissionDto,
  ) {
    return this.comissionService.createDetail(createDetailComissionDto);
  }

  @Get('/detail/:idHeader')
  async findOneDetail(@Param('idHeader') idHeader: string) {
    return this.comissionService.findDetail(idHeader);
  }

  @Patch('/detail/:id')
  async updateDetail(
    @Param('id') id: string,
    @Body() updateDetailComissionDto: UpdateDetailComissionDto,
  ) {
    return this.comissionService.updateDetail(id, updateDetailComissionDto);
  }

  @Delete('/detail/:id')
  async inactiveDetail(@Param('id') id: string) {
    return this.comissionService.inactiveDetail(id);
  }

  @Get('/teacher')
  async getTeachers() {
    return this.comissionService.getTeachers();
  }

  @Get('/members/:document')
  async getReviewersByDocument(@Param('document') document: string) {
    return this.comissionService.getReviewersByDocument(document);
  }
}
