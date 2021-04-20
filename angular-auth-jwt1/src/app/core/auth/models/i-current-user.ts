export interface ICurrentUser {
  userId?: string;
  email?: string;
  password?: string;
  name?: string;
  username?: string;
  roles?: Array<string>;
  token?: string;
  refresh_token?: string;
  isLogged?: boolean;
}
