export interface OAuthStateRepository {
  exists(key: string): Promise<boolean>;
  write(key: string, expiredAt: number): Promise<void>;
}
