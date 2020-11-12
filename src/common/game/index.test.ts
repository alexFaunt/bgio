// TODO imports?
import SevenHandPoker, { getWinners } from 'common/game/index';
import * as pokersolver from 'pokersolver';

jest.mock('common/game/deck');

const events = {
  setStage: jest.fn(),
  endTurn: jest.fn(),
  endGame: jest.fn(),
};

const slotHand = (ownerId, cards, coin = false) => ({ ownerId, coin, cards });
const emptySlot = { settled: false, hands: {} };

describe('SevenHandPoker', () => {
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

      const G = SevenHandPoker.setup(ctx);

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

      SevenHandPoker.turn?.stages.placeOpponentsHand.moves?.selectSlot.move(G, ctx, { slotId: 'one' });

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

    it('identifies a 7-6 win', () => {
      const ctx = {
        events,
        currentPlayer: '0',
        activePlayers: {
          1: 'placeOpponentsHand',
        },
      };

      const G = SevenHandPoker.setup(ctx);

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

      SevenHandPoker.turn?.stages.placeOpponentsHand.moves?.selectSlot.move(G, ctx, { slotId: 'one' });

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

describe('#getWinners', () => {
  describe('uses kickers to decide hands', () => {
    it('correctly picks A over K2', () => {
      const winners = getWinners(
        { id: '1', cards: ['AD'] },
        { id: '2', cards: ['KD', '2C'] },
      );

      expect(winners.length).toBe(1);
      expect(winners).toEqual(['1']);
    });

    it('correctly picks A2 over A', () => {
      const winners = getWinners(
        { id: '1', cards: ['AD'] },
        { id: '2', cards: ['AC', '3C'] },
      );

      expect(winners.length).toBe(1);
      expect(winners).toEqual(['2']);
    });

    it('correctly picks AA3 over AA2', () => {
      const winners = getWinners(
        { id: '1', cards: ['AD', 'AS', '2C'] },
        { id: '2', cards: ['AC', 'AH', '3C'] },
      );

      expect(winners.length).toBe(1);
      expect(winners).toEqual(['2']);
    });

    it('correctly picks AA2 over AA', () => {
      const winners = getWinners(
        { id: '1', cards: ['AD', 'AS', '2C'] },
        { id: '2', cards: ['AC', 'AH'] },
      );

      expect(winners.length).toBe(1);
      expect(winners).toEqual(['1']);
    });

    it('correctly picks A42 over A32', () => {
      const winners = getWinners(
        { id: '1', cards: ['AD', '4S', '2C'] },
        { id: '2', cards: ['AC', '3H', '2C'] },
      );

      expect(winners.length).toBe(1);
      expect(winners).toEqual(['1']);
    });

    it('correctly picks A43 over A4', () => {
      const winners = getWinners(
        { id: '1', cards: ['AD', '4S', '3C'] },
        { id: '2', cards: ['AC', '4H'] },
      );

      expect(winners.length).toBe(1);
      expect(winners).toEqual(['1']);
    });

    it('correctly picks A5 over A432', () => {
      const winners = getWinners(
        { id: '1', cards: ['AD', '5S'] },
        { id: '2', cards: ['AC', '4S', '3S', '2S'] },
      );

      expect(winners.length).toBe(1);
      expect(winners).toEqual(['1']);
    });

    it('correctly picks AAJJ2 over AAJJ', () => {
      const winners = getWinners(
        { id: '1', cards: ['AD', 'AS', 'JD', 'JS', '2C'] },
        { id: '2', cards: ['AC', 'AH', 'JC', 'JH'] },
      );

      expect(winners.length).toBe(1);
      expect(winners).toEqual(['1']);
    });

    it('correctly picks AAJJ3 over AAJJ2', () => {
      const winners = getWinners(
        { id: '1', cards: ['AD', 'AS', 'JD', 'JS', '3C'] },
        { id: '2', cards: ['AC', 'AH', 'JC', 'JH', '2C'] },
      );

      expect(winners.length).toBe(1);
      expect(winners).toEqual(['1']);
    });
  });
});
