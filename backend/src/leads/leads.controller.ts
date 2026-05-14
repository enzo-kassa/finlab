import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';

// O Controller define as rotas HTTP.
// Aqui temos apenas POST /leads por enquanto.
// Futuramente pode ter GET /leads para o painel das seguradoras.

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED) // Retorna 201 em vez de 200
  async create(@Body() dto: CreateLeadDto) {
    return this.leadsService.create(dto);
  }
}
