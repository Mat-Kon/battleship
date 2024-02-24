type ResponseHeaderType = 'reg' | 'update_winners' | 'update_room' | 'create_game' | 'start_game' | 'turn' | 'attack' | 'finish';

type RequestHeaderType = 'reg' | 'create_room' | 'add_user_to_room' | 'add_ships';

export type RoomUser = {
  name: string,
  index: number,
  ships?: Ship[];
}

export type Winner = {
  name: string,
  wins: number,
}

type Position = {
  x: number;
  y: number;
}

export type Ship = {
  position: Position;
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
}

export type Game = {
  id: number;
  players: RoomUser[];
  currentPlayerIndex: number;
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

export type RequestAddShips = {
  type: RequestHeaderType,
  data: {
    gameId: number,
    ships: Ship[],
    indexPlayer: number
  },
  id: number
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
