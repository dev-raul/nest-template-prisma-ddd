export abstract class Entity<T> {
  protected readonly _id: number;
  public readonly props: T;

  get id() {
    return this._id;
  }

  constructor(props: T, id?: number) {
    this._id = id;
    this.props = props;
  }

  public equals(object?: Entity<T>): boolean {
    if (object === null || object === undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!(object instanceof Entity)) {
      return false;
    }

    return this._id === object._id;
  }
}
