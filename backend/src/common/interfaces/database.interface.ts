export const DATABASE_PROVIDER = Symbol('IDatabaseProvider');

export interface IDatabaseProvider {
  getClient(): { from(table: string): any };
}
