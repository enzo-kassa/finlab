import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateLeadDto } from './dto/create-lead.dto';

// O LeadsService contém toda a lógica de negócio.
// O Controller apenas recebe a requisição e delega para cá.

@Injectable()
export class LeadsService {
  constructor(private readonly supabase: SupabaseService) {}

  async create(dto: CreateLeadDto) {
    const db = this.supabase.getClient();

    // 1. Salva o usuário
    const username =
      dto.nome.trim().toLowerCase().replace(/\s+/g, '_') + '_' + Date.now();

    const { data: users, error: userError } = await db
      .from('users')
      .insert({
        username,
        email:           dto.email.trim().toLowerCase(),
        password_hash:   'pending',
        role_id:         2,
        open_to_propose: dto.openToPropose,
      })
      .select();

    if (userError) {
      // E-mail duplicado é um erro esperado — retorna 400
      if (userError.code === '23505') {
        throw new BadRequestException('Este e-mail já está cadastrado.');
      }
      throw new InternalServerErrorException(userError.message);
    }

    const userId = users[0].id;

    // 2. Salva o perfil financeiro
    const { error: profileError } = await db
      .from('user_financial_profile')
      .insert({
        user_id:            userId,
        present_amount:     dto.presentAmount,
        monthly_investment: dto.monthlyInvestment,
        monthly_rate:       dto.monthlyRate,
      });

    if (profileError) {
      throw new InternalServerErrorException(profileError.message);
    }

    // 3. Salva os objetivos
    if (dto.goals && dto.goals.length > 0) {
      const goalsPayload = dto.goals.map((g) => ({
        user_id:       userId,
        type:          g.type,
        label:         g.label,
        target_value:  g.targetValue,
        target_months: g.targetMonths ?? null,
      }));

      const { error: goalsError } = await db
        .from('user_goals')
        .insert(goalsPayload);

      if (goalsError) {
        throw new InternalServerErrorException(goalsError.message);
      }
    }

    return { success: true, userId };
  }
}
