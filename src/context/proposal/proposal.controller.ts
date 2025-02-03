import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Param,
  HttpCode,
} from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { ProcessFileDto } from './dto/process-file.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';

@Controller('/v1/proposal')
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @Get('/header/:periodId')
  findAll(@Param('periodId') periodId: string) {
    return this.proposalService.findAll(periodId);
  }

  @Patch('/header/:id')
  update(
    @Param('id') id: string,
    @Body() updateProposalDto: UpdateProposalDto,
  ) {
    return this.proposalService.update(id, updateProposalDto);
  }

  @Get('/detail/:headerId')
  findDetail(@Param('headerId') id: string) {
    return this.proposalService.findDetail(id);
  }

  @Patch('/detail/:id')
  updateDetail(id: string) {
    return this.proposalService.updateDetail(id);
  }

  @Get('/file')
  findAllFile() {
    return this.proposalService.findAllFile();
  }

  @Post('/file')
  @HttpCode(200)
  processFile(@Body() processFileDto: ProcessFileDto) {
    return this.proposalService.processFile(processFileDto);
  }

  @Get('/partner/:document')
  findPartner(@Param('document') document: string) {
    return this.proposalService.findPartner(document);
  }
}
