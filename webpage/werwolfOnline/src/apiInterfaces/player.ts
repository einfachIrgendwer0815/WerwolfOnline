export interface registrationInformation {
  isRegistered: boolean;
  refresh: boolean;
  nicknameSet: string | null;
  volumeSet: number | null;
  inRoom: boolean;
}

export interface fullRegister {
  identity: string;
  expireTimestamp: number;
  refresh: boolean;
}

export interface defaultReturn {
  refresh: boolean;
}
