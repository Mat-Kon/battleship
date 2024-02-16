import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import { WebSocketServer } from 'ws';
import { parseJSONRecursion } from './utils/helperFunctions';
import { NewPlayer, ReqNewRoom, ReqPlayer, ReqWinners } from '../types/types';
import { handlerPlayers } from './handler/handlerPlayers';

const playersData: NewPlayer[] = [];
const gameRooms = []

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
  console.log('New connected');

  ws.on('message', function message(data: string) {
    const parseData: ReqPlayer = parseJSONRecursion(data);
    const typeRequest = parseData.type;

    switch(typeRequest) {
      case "reg":
        handlerPlayers(parseData, playersData, ws);
        // const newRoom: ReqNewRoom = {
        //   type: 'create_room',
        //   data: '',
        //   id: 0
        // };
        // const winners: ReqWinners = {
        //   type: 'update_winners',
        //   data: "[{name: '', wins: 0}]",
        //   id: 0
        // };
        // ws.send(JSON.stringify(newRoom));
        // ws.send(JSON.stringify(winners));
        break;
    };
  });

});
