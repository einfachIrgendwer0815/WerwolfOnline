export interface generateToken {
  access_token: string;
  refresh_token: string;
}

export interface identityInformation {
  identity: string;
  token: string;
  refresh: boolean;
  expireTimestamp: number;
}
