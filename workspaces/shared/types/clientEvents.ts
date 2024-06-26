export enum ClientEvents
{
  // General
  Ping = 'client.ping',

  // Lobby
  LobbyCreate = 'client.lobby.create',
  LobbyJoin = 'client.lobby.join',
  LobbyLeave = 'client.lobby.leave',
  LobbyJoinRandom = 'client.lobby.joinrandom',

  // Game
  GameStartEarly = 'client.game.startearly',
  GameRestart = 'client.game.restart',
  GameUpdate = 'client.game.update',
  GameChatMessage = 'client.game.chatmessage',
}