import * as Deck from 'common/game/deck';
import {
  Card,
  Player,
  PlayerMap,
  SlotHand,
  SlotHandMap,
  Slot,
  SevenHandPokerGame,
  ClientGameInfo,
  PlayerHandItem,
} from 'common/game/types';
import shortId from 'shortid';
import * as pokersolver from 'pokersolver';
import { INVALID_MOVE } from 'boardgame.io/core';

const sevenHandPokerConfig = {
  startingHandSize: 7,
  drawCount: 3,
  slotCount: 7,
};

const createPlayerCard = (card) => ({
  uid: shortId.generate(),
  card,
  selected: false,
});

const createPlayer = ({ id, cards }: { cards: Card[] }) => ({
  id,
  // TODO should i use array order, or hold order separately?
  hand: cards.map(createPlayerCard),
  proposedHand: undefined,
});

const createSlot = (players: string[]): Slot => ({
  id: shortId.generate(),
  hands: players.reduce((acc, playerId) => {
    acc[playerId] = null;
    return acc;
  }, {}),
  settled: false,
});

const stripPlayerSecrets = ({ id, hand, proposedHand }: Player) => ({
  id,
  proposedHand: proposedHand?.map(() => null),
  hand: hand.map(({ selected }) => ({
    card: null,
    selected,
  })),
});

const stripHandSecrets = ({ ownerId, coin, cards }: SlotHand): SlotHand => ({
  ownerId,
  cards: cards.map(() => null),
  coin,
});

const extractWinningStreakIndexes = (arr) => arr.sort().reduce((acc, index) => {
  // If the last one is the slot before, then push this one.
  // For first el, will bypass becuase undefined != index - 1
  if (acc[acc.length - 1] === index - 1) {
    acc.push(index);
    return acc;
  }

  // If we've already found a winner then don't erase it
  if (acc.length > 2) {
    return acc;
  }

  // Erase any previous streaks they're broken
  return [index];
}, []);

const GameDefinition: SevenHandPokerGame = {
  name: 'seven-hand-poker',
  minPlayers: 2,
  maxPlayers: 2,

  disableUndo: true,

  playerView: ({ setupAt, slots, players, deck }, ctx, myPlayerId): ClientGameInfo => ({
    setupAt,
    deck: deck.map(() => null),
    myPlayerId,
    opponentPlayerId: Object.keys(players).find((playerId) => playerId !== myPlayerId),
    slots: slots.map(({ id, settled, hands }) => ({
      id,
      hands: Object.entries(hands).reduce((acc, [playerId, hand]) => {
        acc[playerId] = (settled || (playerId === myPlayerId) || !hand) ? hand : stripHandSecrets(hand);
        return acc;
      }, {} as SlotHandMap),
      settled,
    })),
    players: Object.entries(players).reduce((acc, [playerId, player]) => {
      acc[playerId] = playerId === myPlayerId ? player : stripPlayerSecrets(player);
      return acc;
    }, {} as PlayerMap),
  }),

  setup: (ctx) => {
    const deck = Deck.shuffle(Deck.create());

     // TODO - should come via "something" I think? needs secrets or something too...? wtf is it hard coded
    const playerIds = ['0', '1'];

    const players = playerIds.reduce((acc, id) => {
      acc[id] = createPlayer({ id, cards: Deck.draw(deck, sevenHandPokerConfig.startingHandSize) });
      return acc;
    }, {} as PlayerMap);

    ctx.events.setStage('selectHand');

    return {
      setupAt: Date.now(),
      deck,
      slots: Array.from({ length: sevenHandPokerConfig.slotCount }).map(() => createSlot(playerIds)),
      players,
    };
  },

  turn: {
    // moveLimit: 1,

    stages: {
      selectHand: {
        // One move of "submitHand" and then we move on, card selection doesn't count to limit
        moves: {
          selectCard: {
            move: (G, ctx, { cardId }) => {
              const playerId = ctx.currentPlayer;
              const player = G.players[playerId];

              const selectedCards = player.hand.filter(({ selected }) => selected);

              if (selectedCards.length >= 5) {
                return INVALID_MOVE; // TODO is there a way to tell the user why it's invalid...
              }

              const handItem = player?.hand.find(({ card }) => card.id === cardId);
              handItem.selected = true;
            },
            noLimit: true,
          },
          unselectCard: {
            move: (G, ctx, { cardId }) => {
              const playerId = ctx.currentPlayer;
              const player = G.players[playerId];
              const handItem = player?.hand.find(({ card }) => card.id === cardId);
              handItem.selected = false;
            },
            noLimit: true,
          },
          submitHand: (G, ctx) => {
            const currentPlayer = G.players[ctx.currentPlayer];
            console.log('SUBMIT HAND', ctx.currentPlayer, currentPlayer);
            const { selectedCards, unselectedCards } = currentPlayer.hand.reduce((acc, handItem) => {
              if (handItem.selected) {
                acc.selectedCards.push(handItem);
              } else {
                acc.unselectedCards.push(handItem);
              }

              return acc;
            }, { selectedCards: [] as PlayerHandItem[], unselectedCards: [] as PlayerHandItem[] });

            if (!selectedCards.length) {
              console.log('NO CARDS SELECTED')
              return INVALID_MOVE;
            }

            // Move cards to proposed hand
            currentPlayer.hand = unselectedCards;
            console.log('SELECTED CARDS', selectedCards.map(({ card }) => card.id));
            currentPlayer.proposedHand = selectedCards.map(({ card }) => card.id);

            ctx.events?.setActivePlayers({
              others: 'placeOpponentsHand',
            });
          },
        },
      },
      placeOpponentsHand: {
        moves: {
          selectSlot: {
            client: false,
            move: (G, ctx, { slotId }) => {
              // TODO slotId?
              const currentPlayer = G.players[ctx.currentPlayer];
              const otherPlayerId = Object.keys(ctx.activePlayers)[0];

              const slot = G.slots.find(({ id }) => id === slotId);

              if (!currentPlayer.proposedHand) {
                return INVALID_MOVE;
              }

              if (!slot) {
                return INVALID_MOVE;
              }

              if (slot.hands[currentPlayer.id]) {
                return INVALID_MOVE;
              }

              const currentPlayerCards = currentPlayer.proposedHand.slice();
              slot.hands[currentPlayer.id] = {
                ownerId: currentPlayer.id,
                coin: false,
                cards: currentPlayerCards,
              };

              delete currentPlayer.proposedHand;

              const otherPlayerCards = slot.hands[otherPlayerId]?.cards;

              if (otherPlayerCards) {
                // Calculate winner + award coins
                const currentPlayerHand = pokersolver.Hand.solve(currentPlayerCards);
                const otherPlayerHand = pokersolver.Hand.solve(otherPlayerCards);

                const winners = pokersolver.Hand.winners([currentPlayerHand, otherPlayerHand]);
                winners.forEach((winner) => {
                  if (winner === currentPlayerHand) {
                    slot.hands[currentPlayer.id].coin = true;
                  }

                  if (winner === otherPlayerHand) {
                    slot.hands[otherPlayerId].coin = true;
                  }
                });
                slot.settled = true;

                // The rules on draws are not really available so making them up...
                const {
                  currentPlayerWinSlots,
                  otherPlayerWinSlots,
                } = G.slots.reduce((acc, { hands }, index) => {
                  if (hands[currentPlayer.id]?.coin) {
                    acc.currentPlayerWinSlots.push(index);
                  }

                  if (hands[otherPlayerId]?.coin) {
                    acc.otherPlayerWinSlots.push(index);
                  }

                  return acc;
                }, { currentPlayerWinSlots: [], otherPlayerWinSlots: [] });

                const unsettledCount = G.slots.filter(({ settled }) => !settled).length;

                const currentPlayerWinCount = currentPlayerWinSlots.length;
                const otherPlayerWinCount = otherPlayerWinSlots.length;

                // Winner by getting more coins than the other player could amass
                if ((currentPlayerWinCount - otherPlayerWinCount) > unsettledCount) {
                  // currentPlayer wins
                  ctx.events.endGame({ outcome: 'VICTORY', winningPlayerId: currentPlayer.id, endedAt: new Date() });
                  return undefined;
                }
                if ((otherPlayerWinCount - currentPlayerWinCount) > unsettledCount) {
                  // otherPlayer wins
                  ctx.events.endGame({ outcome: 'VICTORY', winningPlayerId: otherPlayerId, endedAt: new Date() });
                  return undefined;
                }

                // Check for 3 consecutive coins
                const currentPlayerWinningStreak = extractWinningStreakIndexes(currentPlayerWinSlots);
                const otherPlayerWinningStreak = extractWinningStreakIndexes(otherPlayerWinSlots);

                // Both achieved consecutive coins this turn - draw
                if (currentPlayerWinningStreak.length > 2 && otherPlayerWinningStreak.length > 2) {
                  // Draw
                  ctx.events.endGame({ outcome: 'DRAW', endedAt: new Date() });
                  return undefined;
                }

                // TODO - add the indexes / ids into the victory condition so we can highlight them and make it obvious
                // Single player achieved consecutive coins
                if (currentPlayerWinningStreak.length > 2) {
                  // current player wins
                  ctx.events.endGame({ outcome: 'VICTORY', winningPlayerId: currentPlayer.id, endedAt: new Date() });
                  return undefined;
                }
                if (otherPlayerWinningStreak.length > 2) {
                  // other player wins
                  ctx.events.endGame({ outcome: 'VICTORY', winningPlayerId: otherPlayerId, endedAt: new Date() });
                  return undefined;
                }

                // No winner found, but there's no coins left to win
                if (unsettledCount === 0) {
                  // Draw
                  ctx.events.endGame({ outcome: 'DRAW', endedAt: new Date() });
                  return undefined;
                }
              }

              // The game hasn't ended

              // Give cards to currentPlayer
              const newCards = Deck.draw(G.deck, sevenHandPokerConfig.drawCount);
              currentPlayer.hand = currentPlayer.hand.concat(newCards.map(createPlayerCard));

              // Move to the next turn
              ctx.events?.endTurn();
              ctx.events.setStage('selectHand');
            },
          },
        },
      },
    },
    disableUndo: true,
  },
};

export default GameDefinition;
