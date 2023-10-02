import { atom } from 'recoil';
import { ServerPayloads } from '../shared/types/serverPayloads';
import { ServerEvents } from '../shared/types/serverEvents';

export const CurrentLobbyState = atom<ServerPayloads[ServerEvents.LobbyState] | null>({
  key: 'CurrentLobbyState',
  default: null,
});