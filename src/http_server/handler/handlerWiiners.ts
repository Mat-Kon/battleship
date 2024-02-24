import { type WebSocket } from 'ws';
import { ResWinners } from "../../types/types";
import { WINNERS } from '../db';

const handlerWinners = (data: string, ws: WebSocket) => {
  const typeRequest: any = JSON.parse(data).type;

  switch (typeRequest) {
    case 'reg':
      sendWinners(ws);
  }
};

function sendWinners(ws: WebSocket): void {
  const stringifyData = JSON.stringify(WINNERS.data);
  const respWinners: ResWinners<string> = {
    ...WINNERS,
    data: stringifyData
  };
  return ws.send(JSON.stringify(respWinners));
}

export { handlerWinners }