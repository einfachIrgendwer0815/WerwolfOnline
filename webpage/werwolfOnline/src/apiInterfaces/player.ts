export interface registrationInformation {
  isRegistered: boolean;
  refresh: boolean;
  nicknameSet: boolean;
  volumeSet: boolean;
}

export interface fullRegister {
  identity: string;
  expireTimestamp: number;
  refresh: boolean;
}
