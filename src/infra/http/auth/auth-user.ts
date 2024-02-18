export type AuthUser = {
  sub: number;
  iat: number;
  exp: number;
};

export type RequestAuthUser = {
  user: AuthUser;
};
