import { Inject, Injectable } from '@nestjs/common';
import { ErrorMapper } from '../../common/errors/error-mapper';
import { DATABASE_PROVIDER, IDatabaseProvider } from '../../common/interfaces/database.interface';
import { CreateGoalData, IGoalsRepository } from '../../common/interfaces/goals-repository.interface';

@Injectable()
export class GoalsRepository implements IGoalsRepository {
  constructor(
    @Inject(DATABASE_PROVIDER) private readonly db: IDatabaseProvider,
  ) {}

  async createMany(data: CreateGoalData[]): Promise<void> {
    if (data.length === 0) return;

    const { error } = await this.db
      .getClient()
      .from('user_goals')
      .insert(
        data.map((g) => ({
          user_id:       g.userId,
          type:          g.type,
          label:         g.label,
          target_value:  g.targetValue,
          target_months: g.targetMonths,
        })),
      );

    if (error) throw ErrorMapper.toHttpException(error);
  }
}
