// TODO imports?
import GameDefinition from 'common/game/index';

const events = {
  setStage: jest.fn(),
  endTurn: jest.fn(),
  endGame: jest.fn(),
};

const slotHand = (ownerId, cards, coin = false) => ({ ownerId, coin, cards });
const emptySlot = { settled: false, hands: {} };

describe('GameDefinition', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('#selectSlot', () => {
    it('identifies a 4-0 win', () => {
      const ctx = {
        events,
        currentPlayer: '0',
        activePlayers: {
          1: 'placeOpponentsHand',
        },
      };

      const G = GameDefinition.setup(ctx);

      G.players['0'].proposedHand = ['AD'];
      G.slots = [
        {
          id: 'one',
          settled: false,
          hands: {
            1: slotHand('1', ['2D']),
          },
        },
        {
          settled: true,
          hands: {
            0: slotHand('0', ['AD'], true),
            1: slotHand('1', ['2D']),
          },
        },
        emptySlot,
        emptySlot,
        emptySlot,
        {
          settled: true,
          hands: {
            0: slotHand('0', ['AD'], true),
            1: slotHand('1', ['2D']),
          },
        },
        {
          settled: true,
          hands: {
            0: slotHand('0', ['AD'], true),
            1: slotHand('1', ['2D']),
          },
        },
      ];

      GameDefinition.turn?.stages.placeOpponentsHand.moves?.selectSlot.move(G, ctx, { slotId: 'one' });

      expect(G.slots[0]).toEqual({
        id: 'one',
        settled: true,
        hands: {
          0: { cards: ['AD'], coin: true, ownerId: '0' },
          1: { cards: ['2D'], coin: false, ownerId: '1' },
        },
      });

      expect(events.endGame).toHaveBeenCalledWith({ outcome: 'VICTORY', winningPlayerId: '0' });
    });
  });
});
