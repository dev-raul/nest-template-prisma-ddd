import { Entity } from '@core/domain/Entity';
import { Replace } from '@core/logic/Replace';

export type UserProps = {
  email: string;
  password: string;
  createdAt: Date;
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

  static create(
    props: Replace<
      UserProps,
      {
        createdAt?: Date;
      }
    >,
    id?: number,
  ) {
    const user = new User(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return user;
  }
}
