import React, { useState, ReactNode } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import { Title, Copy } from 'client/atoms/typography';
import PageContent from 'client/layout/page-content';
import Underline from 'client/atoms/underline';

const PageHeader = styled.header`
  background: ${({ theme }) => theme.colors.darkGrey};
  color: ${({ theme }) => theme.colors.white};
`;

const HeaderContent = styled(PageContent)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderTitle = styled(Title)`
  padding-bottom: 0.2rem;
  padding-top: 0.2rem;
`;

const HeaderButton = styled(Copy)`
  display: block;
  padding: 0.4rem 0.8rem;
  margin: 0 -0.8rem;
  font-size: 0.9rem;
`;

const rulesModalStyles = {
  overlay: { backgroundColor: 'rgba(47, 47, 47, 0.75)' },
  content: { top: '1rem', left: '1rem', right: '1rem', bottom: '1rem', padding: '0.7rem 1rem' },
};

const ModalHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: white;
  margin: 0 -1rem 1rem;
  padding: 0 1rem 0.5rem;
  box-shadow: 0px -0.1rem 0.5rem -12px black;

  &::before {
    content: '';
    position: absolute;
    height: 0.7rem;
    top: -0.7rem;
    left: 0;
    right: 0;
    background: inherit;
  }
`;

const ModalCloseButton = styled.button`
  overflow: hidden;
  position: relative;
  width: 2rem;
  height: 2rem;
  text-indent: -10rem;
  margin-right: -0.6rem;

  &::after {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    font-size: 2rem;
    background-image: url('/static/icons/cross-icon.png');
    background-size: cover;
    background-repeat: no-repeat;
  }
`;

const RulesCopy = styled(Copy)`
  display: block;
  font-size: 0.8rem;
  margin-bottom: 0.3rem;
`;

const RulesSection = styled.div`
  margin-bottom: 1rem;
`;
const RulesTitle = styled.header`
  margin-bottom: 0.5rem;
`;

export default ({ link }: { link?: { to: string, children: ReactNode } }) => {
  const [showRules, setShowRules] = useState(false);
  const closeRules = () => setShowRules(false);

  return (
    <PageHeader>
      <HeaderContent>
        { link && <HeaderButton as={Link} to={link.to}>{ link.children }</HeaderButton> }
        <HeaderTitle as="h1">Seven Hand Poker</HeaderTitle>
        <HeaderButton as="button" onClick={() => setShowRules(true)}>rules</HeaderButton>
      </HeaderContent>
      <Modal isOpen={showRules} onRequestClose={closeRules} style={rulesModalStyles}>
        <ModalHeader>
          <Title>How to play</Title>
          <ModalCloseButton onClick={closeRules}>close</ModalCloseButton>
        </ModalHeader>

        {/* eslint-disable max-len */}
        <RulesSection>
          <RulesTitle>1. Picking a hand</RulesTitle>
          <RulesCopy>To start your turn you pick a poker hand from your cards</RulesCopy>
          <RulesCopy>
            A Hand can be any number of cards from one to 5. i.e. Two Jacks and a 5 counts as &quot;a pair jacks with a 5 kicker&quot; even though it is not 5 cards
          </RulesCopy>
          <RulesCopy>
            <Underline>To have a straight or a flush you must use 5 cards</Underline>
          </RulesCopy>
          <RulesCopy>
            Once happy, you declare how many cards you wish to play to your opponent
          </RulesCopy>
        </RulesSection>

        <RulesSection>
          <RulesTitle>2. Hand placement</RulesTitle>
          <RulesCopy>
            Your opponent places the hand you&apos;ve picked face down into a &quot;slot&quot; on the table
          </RulesCopy>
          <RulesCopy>
            If there are cards in the opponents slot in the same position, both hands are revealed
          </RulesCopy>
          <RulesCopy>
            The winning hand takes the coin from the slot. In case of a tie both hands get a coin
          </RulesCopy>
        </RulesSection>

        <RulesSection>
          <RulesTitle>3. Winning the game</RulesTitle>
          <RulesCopy>
            If after a coin is awarded a player has amassed enough coins that the other player cannot catch up, e.g. 4 with only 3 slots remaining, they win immediately
          </RulesCopy>
          <RulesCopy>
            <span>Alternatively if after a coin is awarded a player has 3 coins in a</span>
            <Underline>physical row on the table</Underline>
            <span>they win, so hand positioning is very important</span>
          </RulesCopy>
          <RulesCopy>
            If both players simultaneously achieve 3 coins in a row, or have equal coins with no slots remaining, the game ends as a draw
          </RulesCopy>
        </RulesSection>

        <RulesSection>
          <RulesTitle>4. End of turn</RulesTitle>
          <RulesCopy>If no one has won you draw 3 cards from the deck regardless of how many cards were played this turn. And pass the turn to your opponent</RulesCopy>
        </RulesSection>
        {/* eslint-enable max-len */}
      </Modal>
    </PageHeader>
  );
};
