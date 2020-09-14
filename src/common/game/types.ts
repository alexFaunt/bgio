import { Game, State } from 'boardgame.io';

export enum CardValue {
  ACE = 'A',
  TWO = '2',
  THREE = '3',
  FOUR = '4',
  FIVE = '5',
  SIX = '6',
  SEVEN = '7',
  EIGHT = '8',
  NINE = '9',
  TEN = 'T',
  JACK = 'J',
  QUEEN = 'Q',
  KING = 'K',
}

export enum Suit {
  HEARTS = 'H',
  DIAMONDS = 'D',
  CLUBS = 'C',
  SPADES = 'S',
}

export type Card = {
  id: string;
  suit: Suit;
  value: number;
};

export type PlayerHandItem = {
  card: Card | null,
  selected: boolean
};
export type Player = {
  id: string,
  hand: PlayerHandItem[],
  proposedHand?: Card[],
};
export type PlayerMap = {
  [key: string]: Player;
};

// TODO - could do client versions of everything...
export type SlotHand = {
  ownerId: string,
  cards: Card[] | null[],
  coin: boolean,
  // TODO "viewing: [playerId]"
};
export type SlotHandMap = {
  [playerId: string]: SlotHand | null;
};

export type Slot = {
  hands: SlotHandMap,
  settled: boolean,
};

type CommonGameInfo = {
  setupAt: number,
  players: PlayerMap,
  slots: Slot[],
};
export type GameInfo = CommonGameInfo & {
  deck: Card[],
};
export type GameState = State<GameInfo>;
export type SevenHandPokerGame = Game<GameInfo>;

export type ClientGameInfo = CommonGameInfo & {
  myPlayerId: string,
  opponentPlayerId: string,
  deck: null[],
};
export type ClientGameState = State<ClientGameInfo>;
export type SevenHandPokerClientGame = Game<ClientGameInfo>;
