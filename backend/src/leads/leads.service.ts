import { Inject, Injectable } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { USER_REPOSITORY, IUserRepository } from '../common/interfaces/user-repository.interface';
import { FINANCIAL_PROFILE_REPOSITORY, IFinancialProfileRepository } from '../common/interfaces/financial-profile-repository.interface';
import { GOALS_REPOSITORY, IGoalsRepository } from '../common/interfaces/goals-repository.interface';

@Injectable()
export class LeadsService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository,
    @Inject(FINANCIAL_PROFILE_REPOSITORY) private readonly profileRepo: IFinancialProfileRepository,
    @Inject(GOALS_REPOSITORY) private readonly goalsRepo: IGoalsRepository,
  ) {}

  async create(dto: CreateLeadDto) {
    const username =
      dto.nome.trim().toLowerCase().replace(/\s+/g, '_') + '_' + Date.now();

    const { id: userId } = await this.userRepo.create({
      username,
      email:         dto.email.trim().toLowerCase(),
      passwordHash:  'pending',
      roleId:        2,
      openToPropose: dto.openToPropose,
    });

    await this.profileRepo.create({
      userId,
      presentAmount:     dto.presentAmount,
      monthlyInvestment: dto.monthlyInvestment,
      monthlyRate:       dto.monthlyRate,
    });

    if (dto.goals?.length > 0) {
      await this.goalsRepo.createMany(
        dto.goals.map((g) => ({
          userId,
          type:         g.type,
          label:        g.label,
          targetValue:  g.targetValue,
          targetMonths: g.targetMonths ?? null,
        })),
      );
    }

    return { success: true, userId };
  }
}
