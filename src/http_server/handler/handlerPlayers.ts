import { NewPlayer, ReqPlayer, ResPlayer } from "../../types/types";
import { type WebSocket } from 'ws';
import { hashPassword, parseJSONRecursion } from "../utils/helperFunctions";

const PLAYERS_DATA: NewPlayer[] = [];

const handlerPlayers = (data: string, ws: WebSocket): void => {
  const parseData = parseJSONRecursion<ReqPlayer>(data);
  let resPlayer: ResPlayer;

  try {
    const newPlayer = createPlayer(parseData);
    addPlayersInData(newPlayer);
    delete newPlayer.data.password;

    const toStringPlayerData = JSON.stringify(newPlayer.data);
    resPlayer = { ...newPlayer,  data: toStringPlayerData}
    const response = JSON.stringify(resPlayer);

    ws.send(response);
  } catch(error) {
    console.error(`Error send new player: ${error}`);
  }
};


function createPlayer(data: ReqPlayer): NewPlayer {
  const id = Date.now();
  const password = hashPassword(data.data.password);
  const reqPlayer: NewPlayer = {
    type: 'reg',
    data: {
      name: data.data.name,
      password,
      index: PLAYERS_DATA.length,
      error: false,
      errorText: '',
    },
    id,
  };
  return reqPlayer;
};

function addPlayersInData(player: NewPlayer): void {
  PLAYERS_DATA.push(player);
}

export { handlerPlayers }