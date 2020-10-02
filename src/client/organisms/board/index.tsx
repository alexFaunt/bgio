import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { ClientGameState, PlayerHandItem, SlotHand, Card as CardType } from 'common/game/types';

type HandItemProps = PlayerHandItem & {
  onSelected: ({ cardId: string }) => void,
  onUnselected: ({ cardId: string }) => void,
};

// TODO convert Card Value to enum, where one part is readable ACE and the value is number?
// Undo the renaming of cards + align to https://github.com/goldfire/pokersolver notation which is the same as the deck?

// TODO REMS? dno how i want to style it
// TODO theme
// TODO grid

const CardWrapper = styled.div<{ selected: boolean }>`
  width: 100%;
  position: relative;
  transform: translateY(${({ selected }) => (selected ? '-10%' : '0%')});

  &::before {
    content: '';
    display: block;
    padding-bottom: 140%;
  }
`;

const CardImg = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Card = ({ id, selected, onClick, className }) => (
  <CardWrapper className={className} onClick={onClick} selected={selected}>
    <CardImg src={`/static/cards/${id || 'BACK'}.svg`} />
  </CardWrapper>
);

// TODO make it a button not an image

const HandItem = ({ card, selected, onSelected, onUnselected }: HandItemProps) => {
  const onClick = useCallback(() => {
    if (!card) {
      return;
    }

    if (selected && onUnselected) {
      onUnselected({ cardId: card.id });
    }

    if (!selected && onSelected) {
      onSelected({ cardId: card.id });
    }
  }, [selected, onSelected, onUnselected, card]);

  return (
    card
      ? <Card id={card.id} onClick={onClick} selected={selected} />
      : <Card selected={selected} />
  );
};

const HandWrapper = styled.div`
  height: 20vh;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  border: 1px solid ${({ myTurn }) => (myTurn ? 'red' : 'transparent')};
  display: flex;
  flex-direction: row;
  padding-top: 2vh;

  ${CardWrapper} {
    width: 200px;

    &:not(:first-child) {
      margin-left: -150px;
    }
  }
`;

// TODO does `hand` change, or get mutated?
type HandProps = {
  myTurn: boolean,
  hand: PlayerHandItem[],
  onCardSelected: ({ cardId: string }) => void,
  onCardUnselected: ({ cardId: string }) => void,
};

// TODO give each card a uuid on the backend?
const Hand = ({ myTurn, hand, onCardSelected, onCardUnselected }: HandProps) => (
  <HandWrapper myTurn={myTurn}>
    {
      hand.map(({ card, selected }, i) => (
        <HandItem
          key={i}
          card={card}
          selected={selected}
          onSelected={onCardSelected}
          onUnselected={onCardUnselected}
        />
      ))
    }
  </HandWrapper>
);

type SlotProps = {
  id: string,
  myHand?: SlotHand,
  opponentsHand?: SlotHand,
  settled: boolean,
  onSlotSelected: ({ slotId: string }) => void,
};

const SlotWrapper = styled.div`
  margin: 4px;
  width: calc(100% / 7);
`;

const SlotHandWrapper = styled.div`
  position: relative;

  ${CardWrapper} {
    display: inline-block;
    width: 50%;
    &:not(:first-child) {
      margin-left: -38%;
    }
  }
`;

const SlotCards = styled.div<{ zoomed: boolean }>`
  display: flex;
  flex-direction: column;
  height: 10vh;
  border: 1px solid red;
  border-radius: 10px;
  margin-bottom: 20px;
  overflow: hidden;
  ${({ zoomed }) => (zoomed ? `
    position: fixed;
    height: 100%;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgb(100, 100, 100, 0.5);
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;

    ${SlotHandWrapper} {
      width: 600px;
    }
  ` : '')}
`;

const SlotHandCards = ({ hand, settled }: { hand: SlotHand, settled: boolean }) => (
  <>
    { settled && hand.coin && 'WINS' }
    { settled && !hand.coin && 'LOSES' }
    <SlotHandWrapper>
      { hand.cards.map((card, i) => <Card key={i} id={card || 'BACK'} />) }
    </SlotHandWrapper>
  </>
);

// TODO outcomes/settled
const Slot = ({ id, myHand, opponentsHand, settled, onSlotSelected }: SlotProps) => {
  const selectSlot = useCallback(() => {
    onSlotSelected({ slotId: id });
  }, [onSlotSelected, id]);

  const [zoomMySlot, setZoomMySlot] = useState(false);
  const [zoomOpponentSlot, setZoomOpponentSlot] = useState(false);

  const viewOpponentSlot = () => setZoomOpponentSlot(!zoomOpponentSlot);
  const viewMySlot = () => setZoomMySlot(!zoomMySlot);
console.log('MY HAND', myHand);
  return (
    <SlotWrapper>
      <SlotCards onClick={settled ? viewOpponentSlot : selectSlot} zoomed={zoomOpponentSlot}>
        { opponentsHand && <SlotHandCards hand={opponentsHand} settled={settled} /> }
      </SlotCards>
      <SlotCards onClick={viewMySlot} zoomed={zoomMySlot}>
        { myHand && <SlotHandCards hand={myHand} settled={settled} /> }
      </SlotCards>
    </SlotWrapper>
  );
};

const SlotsWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const ProposedHandWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(180,150,1,0.2);
`;

const ProposedHand = ({ hand }: { hand: CardType[] }) => (
  <ProposedHandWrapper>
    <HandWrapper>
      {
        hand.map((card, index) => (
          card
            ? <Card key={card.id} id={card.id} />
            : <Card key={index} />
        ))
      }
    </HandWrapper>
  </ProposedHandWrapper>
);

const Opponent = styled.div`
  position: relative;
`;

// TODO fix ClientGameState type it's wrong/missing moves / not needed?
const Board = ({ ctx, G, moves }: ClientGameState) => {
  console.log('G.players', G)
  const me = G.players[G.myPlayerId];
  const opponent = G.players[G.opponentPlayerId];
  const myTurn = ctx.currentPlayer === G.myPlayerId;

  const submitHand = useCallback(() => {
    moves.submitHand();
  }, [moves]);

  if (!me) {
    return null;
  }

  if (ctx.gameover) {
    return <h1>Game over</h1>;
  }

  return (
    <>
      { ctx.gameover && <h1>Game over</h1>}
      <h1>Board</h1>
      <Opponent>
        <Hand hand={opponent.hand} />
        { opponent.proposedHand && <ProposedHand hand={opponent.proposedHand} />}
      </Opponent>
      <div>
        deck (not that it is relevant):
        {G.deck.length}
      </div>
      <SlotsWrapper>
        {
          G.slots.map(({ id, hands, settled }) => (
            <Slot
              key={id}
              id={id}
              myHand={hands[me.id]}
              opponentsHand={hands[opponent.id]}
              settled={settled}
              onSlotSelected={moves.selectSlot}
            />
          ))
        }
      </SlotsWrapper>
      <Hand hand={me.hand} myTurn={myTurn} onCardSelected={moves.selectCard} onCardUnselected={moves.unselectCard} />
      { myTurn && <button type="button" onClick={submitHand}>DONE SELECTING</button> }
    </>
  );
};

export default Board;
