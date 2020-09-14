import lodashShuffle from 'lodash/shuffle';
import { Card, Suit, CardValue } from 'common/game/types';

export const shuffle = (deck: Card[]) => lodashShuffle(deck);

export const create = () => Object.values(Suit)
  .reduce((deck, suit) => (
    deck.concat(Object.values(CardValue).map((value) => ({ id: `${value}${suit}`, suit, value })))
  ), [] as Card[]);

export const draw = (deck: Card[], count = 1) => deck.splice(0, count);
