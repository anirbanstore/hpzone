export interface AuthState {
  auth: boolean;
  user?: {
    Username: string;
    ConsumerNumber: string;
    Provider: string | null;
  };
  token?: string;
}
