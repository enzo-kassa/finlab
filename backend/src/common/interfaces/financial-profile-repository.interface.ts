export const FINANCIAL_PROFILE_REPOSITORY = Symbol('IFinancialProfileRepository');

export interface CreateProfileData {
  userId: string;
  presentAmount: number;
  monthlyInvestment: number;
  monthlyRate: number;
}

export interface IFinancialProfileRepository {
  create(data: CreateProfileData): Promise<void>;
}
