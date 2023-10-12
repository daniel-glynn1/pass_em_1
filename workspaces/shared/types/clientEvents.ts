export enum ClientEvents
{
  // General
  Ping = 'client.ping',

  // Lobby
  LobbyCreate = 'client.lobby.create',
  LobbyJoin = 'client.lobby.join',
  LobbyLeave = 'client.lobby.leave',

  // Game
  GameStartEarly = 'client.game.startearly',
  GameUpdate = 'client.game.update',
  GameChatMessage = 'client.game.chatmessage',
}