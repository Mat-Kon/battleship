import { DataNewPlayer, NewPlayer, ReqPlayer } from "../../types/types";
import { type WebSocket } from 'ws';
import { hashPassword, parseJSONRecursion } from "../utils/helperFunctions";
import { PLAYERS } from "../db";

const handlerPlayers = (data: string, id: number, ws: WebSocket): void => {
  const parseData = parseJSONRecursion<ReqPlayer>(data);

  try {
    const newPlayer = createPlayer(parseData, id);
    addPlayersInData(newPlayer);
    delete newPlayer.data.password;

    const toStringPlayerData = JSON.stringify(newPlayer.data);
    const resPlayer: NewPlayer<string> = {
      ...newPlayer,
      data: toStringPlayerData
    }
    const response = JSON.stringify(resPlayer);

    ws.send(response);
  } catch(error) {
    console.error(`Error send new player: ${error}`);
  }
};


function createPlayer(data: ReqPlayer, id: number): NewPlayer<DataNewPlayer> {
  const password = hashPassword(data.data.password);
  const reqPlayer: NewPlayer<DataNewPlayer> = {
    type: 'reg',
    data: {
      name: data.data.name,
      password,
      index: id,
      error: false,
      errorText: '',
    },
    id,
  };
  return reqPlayer;
};

function addPlayersInData(player: NewPlayer<DataNewPlayer>): void {
  PLAYERS.push(player);
}

export { handlerPlayers }