import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import { WebSocketServer } from 'ws';
import { handlerPlayers } from './handler/handlerPlayers';
import { handlerRooms } from './handler/handlerRooms';
import { PLAYERS_WS } from './db';
import { handlerWinners } from './handler/handlerWiiners';
import { handlerGame } from './handler/handlerGame';
import { parseJSONRecursion } from './utils/helperFunctions';

export const httpServer = http.createServer(function (req, res) {
  const __dirname = path.resolve(path.dirname(''));
  const file_path = __dirname + (req.url === '/' ? '/front/index.html' : '/front' + req.url);
  fs.readFile(file_path, function (err, data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
});


const wss = new WebSocketServer({ port: 3000 });

wss.on('connection', function connection(ws) {
  const id = Date.now();
  PLAYERS_WS[id] = ws;

  ws.on('error', console.error);
  console.log('New connected');

  ws.on('message', function message(data: string) {
    const typeRequest: any = JSON.parse(data).type;
    console.log(typeRequest)

    switch (typeRequest) {
      case 'reg':
        handlerPlayers(data, id, ws);
        handlerRooms(data, id);
        handlerWinners(data, ws);
        break;
      case 'create_room':
      case 'add_user_to_room':
        handlerRooms(data, id);
        handlerGame(data);
        break;
      case 'add_ships':
        handlerGame(data);
    };
  });

  // ws.close();
  ws.on('close', () => {
    console.log('Player disconnected');
  });
});
