import React, { useCallback } from 'react';
import styled from 'styled-components';
import { ClientGameState, PlayerHandItem, SlotHand, Card } from 'common/game/types';

type HandItemProps = PlayerHandItem & {
  onSelected: ({ cardId: string }) => void,
  onUnselected: ({ cardId: string }) => void,
};

// TODO convert Card Value to enum, where one part is readable ACE and the value is number?
// Undo the renaming of cards + align to https://github.com/goldfire/pokersolver notation which is the same as the deck?

// TODO REMS? dno how i want to style it
// TODO theme
// TODO grid

const HandCardImg = styled.img`
  display: inline-block;
  height: 90%;
  /* TODO - can make this variable */
  margin-right: -10vh;
  transform: translateY(${({ selected }) => (selected ? '0%' : '10%')});
`;

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
      ? <HandCardImg src={`static/cards/${card.id}.svg`} onClick={onClick} selected={selected} />
      : <HandCardImg src="static/cards/BACK.svg" selected={selected} />
  );
};

const HandWrapper = styled.div`
  height: 20vh;
  position: relative;
  white-space: nowrap;
  overflow-x: scroll;
  overflow-y: hidden;
  border: 1px solid ${({ myTurn }) => (myTurn ? 'red' : 'transparent')};
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
      hand.map(({ uid, card, selected }) => (
        <HandItem
          key={uid}
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

const SlotCards = styled.div`
  display: flex;
  flex-direction: column;
  height: 10vh;
  border: 1px solid red;
  border-radius: 10px;
`;

const SlotWrapper = styled.div`
  margin: 4px;
`;

const SlotHandCardImg = styled.img`
  display: inline-block;
  height: 40%;
  margin-bottom: -80%;
`;

const SlotHandCards = ({ hand, settled }: { hand: SlotHand, settled: boolean }) => (
  <>
    { settled && hand.coin && 'WINS' }
    { settled && !hand.coin && 'LOSES' }
    { hand.cards.map((card) => <SlotHandCardImg src={`static/cards/${card || 'BACK'}.svg`} />) }
  </>
);

// TODO outcomes/settled
const Slot = ({ id, myHand, opponentsHand, settled, onSlotSelected }: SlotProps) => {
  const onClick = useCallback(() => {
    onSlotSelected({ slotId: id });
  }, [onSlotSelected, id]);

  return (
    <SlotWrapper>
      <SlotCards onClick={onClick}>
        { opponentsHand && <SlotHandCards hand={opponentsHand} settled={settled} /> }
      </SlotCards>
      <div>{settled ? 'COIN' : 'NO COIN' }</div>
      <SlotCards>
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

const ProposedHand = ({ hand }: { hand: Card[] }) => (
  <ProposedHandWrapper>
    {
      hand.map((card, index) => (
        card
          ? <HandCardImg key={card.id} src={`static/cards/${card.id}.svg`} />
          : <HandCardImg key={index} src="static/cards/BACK.svg" />
      ))
    }
  </ProposedHandWrapper>
);

const Opponent = styled.div`
  position: relative;
`;

// TODO fix ClientGameState type it's wrong/missing moves / not needed?
const Board = ({ ctx, G, moves }: ClientGameState) => {
  const me = G.players[G.myPlayerId];
  const opponent = G.players[G.opponentPlayerId];
  const myTurn = ctx.currentPlayer === G.myPlayerId;

  const submitHand = useCallback(() => {
    moves.submitHand();
  }, [moves]);

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
