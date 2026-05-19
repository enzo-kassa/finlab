import { Module } from '@nestjs/common';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { SupabaseService } from '../supabase/supabase.service';
import { UserRepository } from './repositories/user.repository';
import { FinancialProfileRepository } from './repositories/financial-profile.repository';
import { GoalsRepository } from './repositories/goals.repository';
import { DATABASE_PROVIDER } from '../common/interfaces/database.interface';
import { USER_REPOSITORY } from '../common/interfaces/user-repository.interface';
import { FINANCIAL_PROFILE_REPOSITORY } from '../common/interfaces/financial-profile-repository.interface';
import { GOALS_REPOSITORY } from '../common/interfaces/goals-repository.interface';

@Module({
  controllers: [LeadsController],
  providers: [
    LeadsService,
    SupabaseService,
    { provide: DATABASE_PROVIDER,            useClass: SupabaseService },
    { provide: USER_REPOSITORY,              useClass: UserRepository },
    { provide: FINANCIAL_PROFILE_REPOSITORY, useClass: FinancialProfileRepository },
    { provide: GOALS_REPOSITORY,             useClass: GoalsRepository },
  ],
})
export class LeadsModule {}
