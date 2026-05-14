// Data Transfer Object — define e valida o formato
// dos dados que chegam na requisição POST /leads

export class GoalDto {
  type: 'car' | 'house' | 'other';
  label: string;
  targetValue: number;
  targetMonths?: number;
}

export class CreateLeadDto {
  nome: string;
  email: string;
  openToPropose: boolean;
  presentAmount: number;
  monthlyInvestment: number;
  monthlyRate: number;
  goals: GoalDto[];
}
