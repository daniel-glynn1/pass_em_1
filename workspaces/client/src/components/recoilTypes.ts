import { atom } from 'recoil';
import { ServerPayloads } from '../shared/types/serverPayloads';
import { ServerEvents } from '../shared/types/serverEvents';

export const CurrentLobbyState = atom<ServerPayloads[ServerEvents.LobbyState] | null>({
  key: 'CurrentLobbyState',
  default: null,
});

export const ShowMenuState = atom<boolean>({
  key: 'ShowMenuState',
  default: false,
});

export const ShowRulesState = atom<boolean>({
  key: 'ShowRulesState',
  default: false,
});

export const ShowChatState = atom<boolean>({
  key: 'ShowChatState',
  default: false,
});

export const ShowScoreboardState = atom<boolean>({
  key: 'ShowScoreboardState',
  default: false,
});

export const UserNameState = atom<string>({
  key: 'UserNameState',
  default: '',
});

export const ChatState = atom<ServerPayloads[ServerEvents.GameMessage][]>({
  key: 'ChatState',
  default: [],
});

export const NewChatState = atom<boolean>({
  key: 'NewChatState',
  default: false,
});

export const FinalScoreState = atom<number>({
  key: 'FinalScoreState',
  default: 100,
});

export const NumPlayersState = atom<number>({
  key: 'NumPlayersState',
  default: 4,
});

export const RebuttalState = atom<boolean>({
  key: 'RebuttalState',
  default: false,
});

export const Rolling1State = atom<boolean>({
  key: 'Rolling1State',
  default: false,
});

export const Rolling2State = atom<boolean>({
  key: 'Rolling2State',
  default: false,
});

export const IsRandomLobbyState = atom<boolean>({
  key: 'IsRandomLobbyState',
  default: false,
});

export const HideSidebarState = atom<boolean>({
  key: 'HideSidebarState',
  default: false,
});

export const MobileState = atom<boolean>({
  key: 'MobileState',
  default: false,
});