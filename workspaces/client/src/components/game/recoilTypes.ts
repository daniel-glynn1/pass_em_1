import { atom } from 'recoil';
import { ServerPayloads } from '../../shared/types/serverPayloads';
import { ServerEvents } from '../../shared/types/serverEvents';

export const CurrentLobbyState = atom<ServerPayloads[ServerEvents.LobbyState] | null>({
  key: 'CurrentLobbyState',
  default: null,
});


export const ShowMenuState = atom<boolean>({
  key: 'ShowMenuState',
  default: false,
});

export const ChatState = atom<ServerPayloads[ServerEvents.GameMessage][]>({
  key: 'ChatState',
  default: [],
});