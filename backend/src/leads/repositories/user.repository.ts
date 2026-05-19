import { Inject, Injectable } from '@nestjs/common';
import { ErrorMapper } from '../../common/errors/error-mapper';
import { DATABASE_PROVIDER, IDatabaseProvider } from '../../common/interfaces/database.interface';
import { CreateUserData, IUserRepository } from '../../common/interfaces/user-repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @Inject(DATABASE_PROVIDER) private readonly db: IDatabaseProvider,
  ) {}

  async create(data: CreateUserData): Promise<{ id: string }> {
    const { data: rows, error } = await this.db
      .getClient()
      .from('users')
      .insert({
        username:        data.username,
        email:           data.email,
        password_hash:   data.passwordHash,
        role_id:         data.roleId,
        open_to_propose: data.openToPropose,
      })
      .select();

    if (error) throw ErrorMapper.toHttpException(error);

    return { id: rows[0].id };
  }
}
