export const GOALS_REPOSITORY = Symbol('IGoalsRepository');

export interface CreateGoalData {
  userId: string;
  type: string;
  label: string;
  targetValue: number;
  targetMonths: number | null;
}

export interface IGoalsRepository {
  createMany(data: CreateGoalData[]): Promise<void>;
}
