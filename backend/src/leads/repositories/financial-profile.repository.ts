import { Inject, Injectable } from '@nestjs/common';
import { ErrorMapper } from '../../common/errors/error-mapper';
import { DATABASE_PROVIDER, IDatabaseProvider } from '../../common/interfaces/database.interface';
import { CreateProfileData, IFinancialProfileRepository } from '../../common/interfaces/financial-profile-repository.interface';

@Injectable()
export class FinancialProfileRepository implements IFinancialProfileRepository {
  constructor(
    @Inject(DATABASE_PROVIDER) private readonly db: IDatabaseProvider,
  ) {}

  async create(data: CreateProfileData): Promise<void> {
    const { error } = await this.db
      .getClient()
      .from('user_financial_profile')
      .insert({
        user_id:            data.userId,
        present_amount:     data.presentAmount,
        monthly_investment: data.monthlyInvestment,
        monthly_rate:       data.monthlyRate,
      });

    if (error) throw ErrorMapper.toHttpException(error);
  }
}
