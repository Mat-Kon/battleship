import { NewPlayer, ReqPlayer } from "../../types/types";
import { type WebSocket } from 'ws';

const handlerPlayers = (data: ReqPlayer, playersData: NewPlayer[], ws: WebSocket) => {
  try {
    const newPlayer = createPlayer(data);
    addPlayersInData(newPlayer, playersData);
    newPlayer.data = JSON.stringify(newPlayer.data);
    const respPlayer = JSON.stringify(newPlayer);
    ws.send(respPlayer);
  } catch(error) {
    console.error(`Error send new player: ${error}`);
  }
};


function createPlayer(data: ReqPlayer): NewPlayer {
  const reqPlayer: NewPlayer = {
    type: 'reg',
    data: {
      name: data.data.name,
      index: 0,
      error: false,
      errorText: '',
    },
    id: 0,
  };
  return reqPlayer;
};

function addPlayersInData(player: NewPlayer, playersData: NewPlayer[]) {
  const isTwoPlayers = playersData.length === 2;

  if (isTwoPlayers) {
    throw new Error('The maximum number of players has been created');
  }

  if (playersData.length < 2 ) {
    playersData.push(player);
  }
}

export { handlerPlayers }