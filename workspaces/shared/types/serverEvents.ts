export enum ServerEvents
{
  // General
  Pong = 'server.pong',

  // Lobby
  LobbyCreated = 'server.lobby.created',
  LobbyJoined = 'server.lobby.joined',
  LobbyState = 'server.lobby.state',

  // Game
  GameStarted = 'server.game.started',
  GameMessage = 'server.game.message',
}