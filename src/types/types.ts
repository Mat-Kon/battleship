type ResponseHeaderType = 'reg' | 'update_winners' | 'update_room' | 'create_game' | 'start_game' | 'turn' | 'attack' | 'finish';

type RequestHeaderType = 'reg' | 'create_room' | 'add_user_to_room';

type RoomUser = {
  name: string,
  index: number,
}

export type Winner = {
  name: string,
  wins: number,
}

//data
export type DataUpdateRoom = {
  roomId: number,
  roomUsers: RoomUser[],
}

export type DataNewPlayer = {
  name: string,
  password?: string,
  index: number,
  error: boolean,
  errorText: string,
}

export type DataGame = {
  idGame: number,
  idPlayer: number,
}

//request
export interface ReqPlayer {
  type: RequestHeaderType,
  data: {
    name: string,
    password: string,
  },
  id: number,
}

export type RequestAddPlayerToRoom = {
  type: RequestHeaderType,
  data: {
    indexRoom: number,
  },
  id: number,
}

//response
export type ResWinners<Data> = {
  type: ResponseHeaderType,
  data: Data,
  id: 0,
}

export type NewPlayer<Data> = {
  type: ResponseHeaderType,
  data: Data,
  id: number,
}

export type ResRoom<Data> = {
  type: ResponseHeaderType,
  data: Data,
  id: number,
}

export type ResCreateGame<Data> = {
  type: ResponseHeaderType,
  data: Data,
  id: number,
}
