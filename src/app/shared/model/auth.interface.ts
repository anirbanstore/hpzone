export interface AuthState {
  auth: boolean;
  user?: {
    Username: string,
    ConsumerNumber: string
  };
  token?: string;
}
