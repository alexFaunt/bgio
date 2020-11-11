import React, { useCallback, useState, useContext } from 'react';
import styled from 'styled-components';
import { ClientGameState, PlayerHandItem, SlotHand, Card as CardType } from 'common/game/types';
import { Quote, Copy } from 'client/atoms/typography';
import Button from 'client/atoms/button';
import OpponentNameContext from 'client/organisms/board/opponent-name';
import Modal from 'client/molecules/modal';

type HandItemProps = PlayerHandItem & {
  onSelected: ({ cardId: string }) => void,
  onUnselected: ({ cardId: string }) => void,
};

// TODO convert Card Value to enum, where one part is readable ACE and the value is number?
// Undo the renaming of cards + align to https://github.com/goldfire/pokersolver notation which is the same as the deck?

// TODO REMS? dno how i want to style it
// TODO theme
// TODO grid

const CardWrapper = styled.div`
  position: absolute;
  top: 1.1rem;
  left: calc(50% - 2.5rem);
  width: 5rem;
  transform-origin: bottom;
  height: 50rem;
  transition: all 0.2s ease-out;
`;

const CardImg = styled.img`
  width: 5rem;
`;

const Card = ({ id, selected, onClick, className, rotate }) => (
  <CardWrapper
    className={className}
    onClick={onClick}
    style={{
      transform: `translateY(${selected ? -1 : 0}rem) rotate(${rotate}deg)`,
    }}
  >
    <CardImg src={`/static/cards/${id || 'BACK'}.svg`} />
  </CardWrapper>
);

// TODO make it a button not an image

const HandItem = ({ card, selected, onSelected, onUnselected, rotate }: HandItemProps) => {
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
      ? <Card id={card.id} onClick={onClick} selected={selected} rotate={rotate} />
      : <Card selected={selected} rotate={rotate} />
  );
};

const HandWrapper = styled.div`
  position: relative;
  white-space: nowrap;
  padding: 0 0.5rem;
  height: 5rem;
`;

// TODO does `hand` change, or get mutated?
type HandProps = {
  hand: PlayerHandItem[],
  onCardSelected: ({ cardId: string }) => void,
  onCardUnselected: ({ cardId: string }) => void,
};

// TODO give each card a uuid on the backend?
const MAX_ARC = 20; // deg
const MAX_NATURAL_CARD_ARC = 10;
const Hand = ({ hand, onCardSelected, onCardUnselected }: HandProps) => {
  const cardRotation = MAX_ARC / Math.max(hand.length - 1, MAX_NATURAL_CARD_ARC);
  const handRotation = -((hand.length - 1) * cardRotation) / 2;

  return (
    <HandWrapper>
      {
        hand.map(({ card, selected }, index) => (
          <HandItem
            // TODO - uuid on cards
            key={index}
            card={card}
            selected={selected}
            onSelected={onCardSelected}
            onUnselected={onCardUnselected}
            rotate={handRotation + (cardRotation * index)}
          />
        ))
      }
    </HandWrapper>
  );
};

type SlotProps = {
  id: string,
  myHand?: SlotHand,
  opponentsHand?: SlotHand,
  settled: boolean,
  onSlotSelected: ({ slotId: string }) => void,
};

const SlotWrapper = styled.div`
  width: 2.9rem;
  height: 15rem;
  justify-content: space-between;
  display: flex;
  flex-direction: column;
  margin-left: 0.3rem;
  margin-top: auto;
  margin-bottom: auto;

  &:first-child {
    margin-left: 0;
  }
`;

const SlotHandWrapper = styled.div`
  position: relative;
  height: 100%;
  ${({ isMyHand }) => (isMyHand ? '' : 'transform: rotate(180deg);')}
`;

const SlotCards = styled.div`
  display: flex;
  flex-direction: column;
  height: 5.6rem;
  border: 1px dashed ${({ theme }) => theme.colors.yellow};
  border-radius: 5px;
  position: relative;
`;

const Coin = styled.div`
  padding-bottom: 80%;
  border-radius: 100%;
  background: ${({ theme }) => theme.colors.yellow};
  z-index: 1;
  width: 80%;
  margin: 0 auto;
`;

const SettledCoin = styled(Coin)`
  position: absolute;
  top: 50%;
  left: 10%;
  transform: translateY(-50%);
`;

const SlotCardImg = styled.img`
  width: 90%;
  position: absolute;
  left: 5%;
`;

const SlotCard = ({ id, offset }) => {
  const [tilt] = useState(5 - (Math.random() * 10));

  return (
    <SlotCardImg
      src={`/static/cards/${id || 'BACK'}.svg`}
      style={{
        transform: `rotate(${tilt}deg) translateY(${offset}rem)`,
      }}
    />
  );
};

type SlotHandCardsProps = { hand: SlotHand, settled: boolean, isMyHand: boolean };
const SlotHandCards = ({ hand, settled, isMyHand = false }: SlotHandCardsProps) => (
  <>
    <SlotHandWrapper isMyHand={isMyHand}>
      {
        hand.cards.map((card, i) => (
          <SlotCard key={i} id={card || 'BACK'} offset={(i * 0.5)} />
        ))
      }
    </SlotHandWrapper>
    { settled && hand.coin && <SettledCoin /> }
  </>
);

const ZoomHandWrapper = styled(HandWrapper)`
  height: 10rem;
  overflow: hidden;
`;
const zoomModalStyle = {
  top: '50%',
  left: '50%',
  transform: 'translate3d(-50%, -50%, 0)',
  minWidth: '15rem',
  minHeight: '15rem',
};

// TODO outcomes/settled
const Slot = ({ id, myHand, opponentsHand, settled, onSlotSelected }: SlotProps) => {
  const selectSlot = useCallback(() => {
    onSlotSelected({ slotId: id });
  }, [onSlotSelected, id]);

  const [zoomMySlot, setZoomMySlot] = useState(false);
  const [zoomOpponentSlot, setZoomOpponentSlot] = useState(false);

  const viewOpponentSlot = () => setZoomOpponentSlot(!zoomOpponentSlot);
  const viewMySlot = () => setZoomMySlot(!zoomMySlot);

  return (
    <SlotWrapper>
      <Modal isOpen={zoomMySlot && !!myHand} close={() => setZoomMySlot(false)} contentStyle={zoomModalStyle}>
        { myHand && (
          <ZoomHandWrapper>
            {
              myHand.cards.map((card, index) => (
                <Card key={card} id={card} rotate={(-myHand.cards.length + 1) + (index * 2)} />
              ))
            }
          </ZoomHandWrapper>
        )}
      </Modal>
      <Modal
        isOpen={zoomOpponentSlot && !!opponentsHand}
        close={() => setZoomOpponentSlot(false)}
        contentStyle={zoomModalStyle}
      >
        { opponentsHand && (
          <ZoomHandWrapper>
            {
              opponentsHand.cards.map((card, index) => (
                <Card key={card} id={card} rotate={(-opponentsHand.cards.length + 1) + (index * 2)} />
              ))
            }
          </ZoomHandWrapper>
        )}
      </Modal>
      <SlotCards onClick={settled ? viewOpponentSlot : selectSlot}>
        { opponentsHand && <SlotHandCards hand={opponentsHand} settled={settled} /> }
      </SlotCards>
      { !settled && <Coin /> }
      <SlotCards onClick={viewMySlot}>
        { myHand && <SlotHandCards hand={myHand} settled={settled} isMyHand /> }
      </SlotCards>
    </SlotWrapper>
  );
};

const SlotsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  background: green;
  border-radius: 4px;
  justify-content: space-between;
  height: 100%;
  padding: 0.5rem;
`;

const ProposedHandWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(47, 47, 47, 0.75);
`;

const ProposedHand = ({ hand }: { hand: CardType[] }) => (
  <ProposedHandWrapper>
    <HandWrapper>
      {
        hand.map((card, index) => (
          card
            ? <Card key={card.id} id={card.id} rotate={(-hand.length + 1) + (index * 2)} />
            : <Card key={index} rotate={(-hand.length + 1) + (index * 2)} />
        ))
      }
    </HandWrapper>
  </ProposedHandWrapper>
);

const GridSlot = styled.div`
`;

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  position: relative;
`;

const OpponentHand = styled(GridSlot)`
  position: relative;
  padding-top: 2rem;
`;

const Opponent = styled(GridSlot)``;
const OpponentName = styled(Quote)`
  display: block;
  padding: 0.5rem 0;
  position: absolute;
  right: 0;
  color: ${({ theme }) => theme.colors.blue};
`;

const Table = styled(GridSlot)`
  background: #7b4d2a;
  border-radius: 4px;
  padding: 0.5rem;
  height: 100%;
`;
// transform: rotateX(20deg);

const TableWrapper = styled.div`
  position: relative;
  flex-grow: 1;
  height: 100%;
`;
// perspective: 10rem;

const MyHand = styled(GridSlot)`
`;

const ActionSection = styled(GridSlot)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
`;

const Action = styled(Copy)`
  flex-grow: 1;
  font-size: 0.8rem;
  text-align: center;
`;
const Submit = styled.div`
  flex-shrink: 0;
  margin-left: 0.5rem;
`;

const SubmitButton = styled(Button)`

`;

const OpponentActionName = styled(Quote)`
  font-size: 1rem;
  margin: 0 0.25rem;
  display: inline;
  color: ${({ theme }) => theme.colors.blue};
`;

const getCurrentActionString = ({ activePhase, amIActive, opponentName }) => {
  if (amIActive) {
    switch (activePhase) {
      case 'selectHand':
        return 'Submit a hand you wish to play';
      case 'placeOpponentsHand':
        return (
          <>
            <span>Pick a slot to place</span>
            <OpponentActionName>{opponentName}&apos;s</OpponentActionName>
            <span>hand</span>
          </>
        );
      default:
        return 'Something has gone wrong... but I think it\'s your go';
    }
  }

  switch (activePhase) {
    case 'selectHand':
      return (
        <>
          <span>Waiting for</span>
          <OpponentActionName>{opponentName}</OpponentActionName>
          <span>to select a hand</span>
        </>
      );
    case 'placeOpponentsHand':
      return (
        <>
          <span>Waiting for</span>
          <OpponentActionName>{opponentName}</OpponentActionName>
          <span>to place your hand</span>
        </>
      );
    default:
      return 'Something has gone wrong... but I think it\'s your go';
  }
};

const getGameOverStatement = ({ outcome, winningPlayerId }, myPlayerId) => {
  if (outcome === 'DRAW') {
    return 'It was a draw!';
  }

  if (outcome !== 'VICTORY') {
    return 'Something went wrong - the game is over though...';
  }

  if (winningPlayerId === myPlayerId) {
    return 'Congratulations you won!';
  }

  return 'You lost - better luck next time!';
};

// TODO fix ClientGameState type it's wrong/missing moves / not needed?
const Board = ({ ctx, G, moves }: ClientGameState) => {
  const { players, myPlayerId, opponentPlayerId } = G;
  const me = players[myPlayerId];
  const opponent = players[opponentPlayerId];
  const activePlayerId = Object.keys(ctx.activePlayers)[0];
  const activePhase = Object.values(ctx.activePlayers)[0];
  const amIActive = activePlayerId === myPlayerId;
  const amIPickingHand = amIActive && activePhase === 'selectHand';
  const opponentName = useContext(OpponentNameContext);

  const submitHand = useCallback(() => {
    moves.submitHand();
  }, [moves]);

  if (!me) {
    return null;
  }

  const myHand = me.hand;
  const hasSelectedCards = myHand.some(({ selected }) => selected);

  // const opponentName = 'Opponent name';

  return (
    <>
      <Layout>
        <Opponent>
          <OpponentName>
            { opponentName }
          </OpponentName>
          <OpponentHand>
            <Hand hand={opponent.hand} />
            { opponent.proposedHand && <ProposedHand hand={opponent.proposedHand} />}
          </OpponentHand>
        </Opponent>
        <TableWrapper>
          <Table>
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
          </Table>
        </TableWrapper>
        <ActionSection>
          <Action>
            {
              ctx.gameover
                ? getGameOverStatement(ctx.gameover, myPlayerId)
                : getCurrentActionString({ opponentName, activePhase, amIActive })
            }
          </Action>
          {
            amIPickingHand && (
              <Submit>
                <SubmitButton color="green" onClick={submitHand} disabled={!hasSelectedCards}>Submit</SubmitButton>
              </Submit>
            )
          }
        </ActionSection>
        <MyHand>
          <Hand
            hand={myHand}
            onCardSelected={moves.selectCard}
            onCardUnselected={moves.unselectCard}
          />
        </MyHand>
      </Layout>
    </>
  );
};

export default Board;
