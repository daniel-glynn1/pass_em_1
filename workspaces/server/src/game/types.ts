import { Socket } from 'socket.io';
import { Lobby } from '../game/lobby/lobby';
import { ServerEvents } from '../../../shared/types/serverEvents';

export type AuthenticatedSocket = Socket & {
  data: {
    lobby: null | Lobby;
    userName: null | string;
  };

  emit: <T>(ev: ServerEvents, data: T) => boolean;
};