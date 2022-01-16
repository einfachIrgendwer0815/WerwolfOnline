export interface publics {
  rooms: Array<Array<number|string>>;
  refresh: boolean;
}

export interface joinRoom {
  successful: boolean;
  refresh: boolean;
}
