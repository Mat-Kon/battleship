type HeaderType = 'reg' | 'create_room' | 'update_winners' | 'update_room';
type Winner = {
  name: string,
  wins: number,
}
type RoomUser = {
  name: string,
  index: number,
}
export type DataUpdateRoom = {
  roomId: number,
  roomUsers: RoomUser[] | [],
}

export type DataPlayer = {
  name: string,
  password?: string,
  index: number,
  error: boolean,
  errorText: string,
}

export interface ReqPlayer {
  type: HeaderType,
  data: {
    name: string,
    password: string,
  },
  id: number,
}

export type NewPlayer = {
  type: HeaderType,
  data: DataPlayer,
  id: number,
}

export type ResPlayer = {
  type: HeaderType,
  data: string,
  id: number,
}

export interface ResRoom<Data> {
  type: HeaderType,
  data: Data,
  id: number,
}

export type ReqWinners = {
  type: HeaderType,
  data: Winner[] | string,
  id: 0,
}
