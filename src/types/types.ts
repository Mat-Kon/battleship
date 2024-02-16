type HeaderType = 'reg' | 'create_room' | 'update_winners';
type Winner = {
  name: string,
  wins: number,
}

export type ReqPlayer = {
  type: HeaderType,
  data: {
    name: string,
    password: string,
  },
  id: number,
}

export type NewPlayer = {
  type: HeaderType,
  data: {
    name: string,
    index: number,
    error: boolean,
    errorText: string,
  } | string,
  id: number,
}

export type ReqNewRoom = {
  type: HeaderType,
  data: string,
  id: number,
}

export type ReqWinners = {
  type: HeaderType,
  data: Winner[] | string,
  id: 0,
}