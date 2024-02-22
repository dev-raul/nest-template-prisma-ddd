import { Entity } from '@core/domain/Entity';
import { Replace } from '@core/logic/Replace';

export type UserProps = {
  email: string;
  password: string;
  createdAt: Date;
  updateAt: Date;
};

export class User extends Entity<UserProps> {
  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updateAt() {
    return this.props.updateAt;
  }

  static create(
    props: Replace<
      UserProps,
      {
        createdAt?: Date;
        updateAt?: Date;
      }
    >,
    id?: number,
  ) {
    const user = new User(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updateAt: props.updateAt ?? new Date(),
      },
      id,
    );

    return user;
  }
}
