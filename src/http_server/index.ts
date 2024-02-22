import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import { WebSocketServer } from 'ws';
import { ReqWinners } from '../types/types';
import { handlerPlayers } from './handler/handlerPlayers';
import { handlerRooms } from './handler/handlerRooms';

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
  ws.on('error', console.error);
  console.log('New connected');

  ws.on('message', function message(data: string) {
    const typeRequest: any = JSON.parse(data).type;

    switch(typeRequest) {
      case 'reg':
        handlerPlayers(data, ws);
        handlerRooms(data, ws);
        const winners: ReqWinners = {
          type: 'update_winners',
          data: "[]",
          id: 0
        };
        ws.send(JSON.stringify(winners));
        break;
      case 'create_room':
        handlerRooms(data, ws);
        break;
    };
  });

  ws.on('message', function message(data, isBinary) {
    console.log(wss.clients.size);
  });

});


// let players = {};
// let games = {};

// wss.on('connection', ws => {
//     let playerId = uuidv4();
//     players[playerId] = ws;

//     ws.on('message', message => {
//         let { action, data } = JSON.parse(message);
//         switch (action) {
//             case 'createGame':
//                 let gameId = uuidv4();
//                 games[gameId] = { players: [playerId], board: [], state: 'waiting' };
//                 ws.send(JSON.stringify({ action: 'gameCreated', data: { gameId } }));
//                 break;
//             case 'joinGame':
//                 let game = games[data.gameId];
//                 if (game && game.state === 'waiting') {
//                     game.players.push(playerId);
//                     game.state = 'started';
//                     ws.send(JSON.stringify({ action: 'gameJoined', data: { gameId: data.gameId } }));
//                 } else {
//                     ws.send(JSON.stringify({ action: 'error', data: { message: 'Unable to join game' } }));
//                 }
//                 break;
//         }
//     });

//     ws.on('close', () => {
//         delete players[playerId];
//     });
// });

