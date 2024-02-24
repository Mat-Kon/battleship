import { DataUpdateRoom, RequestAddPlayerToRoom, ResRoom, RoomUser } from "../../types/types";
import { PLAYERS_WS, GAME_ROOMS, PLAYERS } from '../db';
import { parseJSONRecursion } from '../utils/helperFunctions';

const handlerRooms = (data: string, id: number) => {
  const typeRequest: any = JSON.parse(data).type;

  switch (typeRequest) {
    case 'reg':
      sendGameRooms(GAME_ROOMS);
      break;
    case 'create_room':
      const newRoom = createRoomWithUser(id);
      addRoom(newRoom);
      sendGameRooms(GAME_ROOMS);
      break;
    case 'add_user_to_room':
      addPlayerInRoom(data, id);
      sendGameRooms(GAME_ROOMS);
  }
};

function sendGameRooms(gameRooms: ResRoom<DataUpdateRoom[]>, id?: number): void {
  const stringifyData = JSON.stringify(gameRooms.data);
  const updateRooms: ResRoom<string> = {
    ...gameRooms,
    data: stringifyData
  };

  gameRooms.data.forEach((room) => {
    if (room) {
      room.roomUsers.forEach((user) => {
        PLAYERS_WS[user.index].send(JSON.stringify(updateRooms))
      });
    }
  });

  for (let player in PLAYERS_WS) {
    PLAYERS_WS[player].send(JSON.stringify(updateRooms));
  }
}

function createRoomWithUser(id: number): DataUpdateRoom | null {
  const roomId = Date.now();
  const player = PLAYERS.find((user) => user.id === id);
  if (player) {
    const roomUser: RoomUser = {
      name: player.data.name,
      index: player.id,
    }

    const newRoom = {
      roomId,
      roomUsers: [roomUser],
    };
    return newRoom;
  }
  return null
}

function addRoom(room: DataUpdateRoom | null) {
  if (room) {
    (GAME_ROOMS.data).push(room)
  }
}

function addPlayerInRoom(data: string, id: number) {
  const player = PLAYERS.find((player) => player.id === id);
  const parseData: RequestAddPlayerToRoom = parseJSONRecursion(data);
  const { indexRoom } = parseData.data;
  const room = GAME_ROOMS.data.find((room) => room.roomId === indexRoom);
  
  if (room && player) {
    room.roomUsers.push({ name: player.data.name, index: player.data.index });
  }
}

export { handlerRooms }
