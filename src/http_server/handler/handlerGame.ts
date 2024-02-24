import { DataGame, Game, RequestAddPlayerToRoom, RequestAddShips, ResCreateGame } from "../../types/types";
import { GAMES, GAME_ROOMS, PLAYERS, PLAYERS_WS } from "../db";
import { parseJSONRecursion } from "../utils/helperFunctions";

const handlerGame = (data: string) => {
  const typeRequest: any = JSON.parse(data).type;

  switch (typeRequest) {
    case 'add_user_to_room':
      createGame(data);
    case 'add_ships':
      addShips(data);
      sendStartGame(data);
  }
};

function createGame(data: string) {
  const request: RequestAddPlayerToRoom = parseJSONRecursion(data);
  const { indexRoom } = request.data;

  const gameRoom = GAME_ROOMS.data.find((room, index) => {
    if (room.roomId === indexRoom) {
      GAME_ROOMS.data.splice(index, 1);
      return room;
    }
  });

  if (gameRoom?.roomUsers.length === 2) {
    const players = gameRoom.roomUsers;
    const idGame = gameRoom.roomId;

    const newGame: Game = {
      id: idGame,
      players: players,
      currentPlayerIndex: players[0].index,
    }

    GAMES.push(newGame)
    return sendCreateGame(newGame);
  }
}

function sendCreateGame(newGame: Game): void {
  if (newGame) {
    const idGame = newGame.id;
    return newGame.players.forEach((player) => {
      const respNewGame: ResCreateGame<DataGame> = {
        type: 'create_game',
        data: {
          idGame,
          idPlayer: player.index,
        },
        id: 0,
      }

      const stringifyData = JSON.stringify(respNewGame.data);
      const resGame: ResCreateGame<string> = {
        ...respNewGame,
        data: stringifyData
      };
      PLAYERS_WS[player.index].send(JSON.stringify(resGame))
    });
  }
}

function addShips(data: string) {
  const parseData: RequestAddShips = parseJSONRecursion(data);
  const { gameId, indexPlayer, ships } = parseData.data;

  const game = GAMES.find((game) => game.id === gameId);

  if (game) {
    const player = game.players.find((player) => player.index === indexPlayer);

    if (player) {
      player.ships = ships;
      return;
    }
  }
};

function sendStartGame(data: string) {
  const parseData: RequestAddShips = parseJSONRecursion(data);
  const { gameId } = parseData.data;

  const game = GAMES.find((game) => game.id === gameId);

  if (game) {
    const { players } = game;
    const currentPlayerIndex = players[0].index

    if (players[0].ships?.length && players[1].ships?.length) {
      players.forEach((player) => {
        const start = {
          type: 'start_game',
          data: {
            ships: player.ships,
            currentPlayerIndex,
          },
          id: 0
        };

        const stringifyData = JSON.stringify(start.data);
        const respStart = {
          ...start,
          data: stringifyData
        }
        PLAYERS_WS[player.index].send(JSON.stringify(respStart))
      });
      return;
    }
  }
}

export { handlerGame }