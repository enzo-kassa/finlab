export const USER_REPOSITORY = Symbol('IUserRepository');

export interface CreateUserData {
  username: string;
  email: string;
  passwordHash: string;
  roleId: number;
  openToPropose: boolean;
}

export interface IUserRepository {
  create(data: CreateUserData): Promise<{ id: string }>;
}
