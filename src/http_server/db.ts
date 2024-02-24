import { type WebSocket } from 'ws';
import { DataNewPlayer, DataUpdateRoom, Game, NewPlayer, ResRoom, ResWinners, Winner } from "../types/types";

const PLAYERS_WS: Record<string, WebSocket> = {};;

const PLAYERS: NewPlayer<DataNewPlayer>[] = [];

const GAME_ROOMS: ResRoom<DataUpdateRoom[]> = {
  type: "update_room",
  data: [],
  id: 0,
};

const WINNERS: ResWinners<Winner[]> = {
  type: 'update_winners',
  data: [],
  id: 0
};

const GAMES: Game[] = [];

export {
  PLAYERS_WS,
  PLAYERS,
  GAME_ROOMS,
  WINNERS,
  GAMES
}