export enum ServerEvents
{
  // General
  Pong = 'server.pong',

  // Lobby
  LobbyCreated = 'server.lobby.created',
  LobbyJoined = 'server.lobby.joined',
  LobbyLeft = 'server.lobby.left',
  LobbyState = 'server.lobby.state',

  // Game
  GameStarted = 'server.game.started',
  GameFinished = 'server.game.finished',
  GameMessage = 'server.game.message',
  GameStartRoll = 'server.game.startroll',
}