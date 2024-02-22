import { type WebSocket } from 'ws';
import { DataGame, DataUpdateRoom, RequestAddPlayerToRoom, ResCreateGame, ResRoom } from "../../types/types";
import { PLAYERS_WS, GAME_ROOMS, PLAYERS } from '../db';
import { parseJSONRecursion } from '../utils/helperFunctions';

const handlerRooms = (data: string, ws: WebSocket) => {
  const typeRequest: any = JSON.parse(data).type;

  switch (typeRequest) {
    case 'reg':
      sendGameRooms(GAME_ROOMS, ws);
      break;
    case 'create_room':
      const newRoom = createRoom();
      addRoom(newRoom);
      sendGameRooms(GAME_ROOMS, ws);
      break;
    case 'add_user_to_room':
      addPlayerInRoom(data);
      sendGameRooms(GAME_ROOMS, ws);
      sendCreateGame(ws);
  }
};

function sendGameRooms(gameRooms: ResRoom<DataUpdateRoom[]>, ws: WebSocket): void {
  const stringifyData = JSON.stringify(gameRooms.data);
  const updateRooms: ResRoom<string> = {
    ...gameRooms,
    data: stringifyData
  };
  return PLAYERS_WS.forEach((player) => player.send(JSON.stringify(updateRooms)));
}

function createRoom(): DataUpdateRoom {
  const roomId = Date.now();

  const newRoom = {
    roomId,
    roomUsers: [],
  };

  return newRoom;
}

function addRoom(room: DataUpdateRoom) {
  (GAME_ROOMS.data).push(room)
}

function addPlayerInRoom(data: string) {
  const player = { ...PLAYERS.at(-1)?.data };
  const parseData: RequestAddPlayerToRoom = parseJSONRecursion(data);
  const { indexRoom } = parseData.data;
  const room = GAME_ROOMS.data.find((room) => room.roomId === indexRoom);

  room?.roomUsers.push({ name: player.name!, index: player.index! });
}

function createGame(): ResCreateGame<DataGame> | null {
  if (PLAYERS.length >= 2) {
    const idGame = Date.now();
    const idPlayer = PLAYERS.at(-1)?.id!;
    const id = Date.now();

    const game: ResCreateGame<DataGame> = {
      type: 'create_game',
      data: {
        idGame,
        idPlayer,
      },
      id,
    }
    return game;
  } else {
    return null;
  }
}

function sendCreateGame(ws: WebSocket): void {
  const newGame = createGame();
  if (newGame) {
    const stringifyData = JSON.stringify(newGame.data);
    const resGame: ResCreateGame<string> = {
      ...newGame,
      data: stringifyData
    }
    return PLAYERS_WS.forEach((player) => player.send(JSON.stringify(resGame)));
  }
}

export { handlerRooms }
