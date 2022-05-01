export interface publics {
  rooms: Array<Array<number|string>>;
  refresh: boolean;
}

export interface joinRoom {
  successful: boolean;
  refresh: boolean;
}

export interface doesRoomExist {
  exists: boolean;
  refresh: boolean;
}

export interface info {
  code: string,
  members: Array<{ identity: string, nickname: string }>,
  public: boolean,
  refresh: boolean
}
