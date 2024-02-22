import { type WebSocket } from 'ws';
import { DataUpdateRoom, ResRoom } from "../../types/types";

const gameRooms: ResRoom<DataUpdateRoom[]> = {
  type: "update_room",
  data: [],
  id: 0,
};

const handlerRooms = (data: string, ws: WebSocket) => {
  const typeRequest: any = JSON.parse(data).type;
  switch (typeRequest) {
    case 'reg':
      sendGameRooms(gameRooms, ws);
      break;
    case 'create_room':
      const newRoom = createRoom();
      addRoom(newRoom);
      sendGameRooms(gameRooms, ws);
      break;
  }
};

function sendGameRooms(gameRooms: ResRoom<DataUpdateRoom[]>, ws: WebSocket): void {
  const rooms = gameRooms;
  const stringifyData = JSON.stringify(gameRooms.data);
  const updateRooms: ResRoom<string> = {
    ...rooms,
    data: stringifyData
  };

  return ws.send(JSON.stringify(updateRooms));
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
  (gameRooms.data).push(room)
}

export { handlerRooms }
