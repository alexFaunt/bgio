import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { useAppState } from 'client/state';
import { useMutation, useQuery, gql } from '@apollo/client';
import { Title, Copy, Quote } from 'client/atoms/typography';
import Button from 'client/atoms/button';
import PageContent from 'client/layout/page-content';

const PageHeader = styled.header`
  background: ${({ theme }) => theme.colors.darkGrey};
  color: ${({ theme }) => theme.colors.white};
`;

const HeaderContent = styled(PageContent)`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;

const HeaderTitle = styled(Title)`
  padding-bottom: 0.2rem;
  padding-top: 0.2rem;
`;

const HeaderButton = styled(Copy)`
  display: block;
  padding: 0.6rem 0.8rem 0.3rem;
  margin: 0 -0.8rem;
  font-size: 0.9rem;
`;

// TODO generate types for these + custom scalars
const CREATE_GAME = gql`
  mutation CreateGame($userId: String!) {
    createGame(input: {
      creatingUserId: $userId,
    }) {
      gameId
    }
  }
`;

// TODO sort by Done order by created_AT desc
const MY_GAMES = gql`
  query MyGames($userId: String!) {
    me: user(id: $userId) {
      id
      name
    }
    activeGames: games(conditions: { userId: $userId, status: PLAYING }, limit: 100) {
      nodes {
        id
        status
        players {
          id
          credentials
          open
          user {
            id
            name
          }
        }
        turnNumber
        currentPlayer {
          id
          name
        }
      }
    }
    games(conditions: { userId: $userId, status: PENDING }, limit: 3) {
      nodes {
        id
        status
      }
    }
    completeGames: games(conditions: { userId: $userId, status: COMPLETE }, limit: 5) {
      nodes {
        id
        status
        players {
          id
          credentials
          open
          user {
            id
            name
          }
        }
        result {
          outcome
          winner {
            id
            name
          }
          loser {
            id
            name
          }
        }
      }
    }
  }
`;

const GameLink = styled(Copy)`
  display: block;
  width: 100%;
`;

const CopyLink = styled(GameLink)`
  text-align: right;
  transition: color 0.5s linear;
  color: currentColor;

  &:active {
    color: ${({ theme }) => theme.colors.green};
    transition: none;
  }
`;

const newRowAnim = ({ theme, isNew }) => (
  isNew
    ? keyframes`
      0% {
        color: ${theme.colors.white};
      }
      30%, 70% {
        color: ${theme.colors.green};
      }
      100% {
        color: ${theme.colors.darkGrey};
      }
    `
    : null
);

const PendingGameRow = styled.div<{ isNew: boolean }>`
  display: flex;
  justify-content: space-between;
  animation: ${newRowAnim} 1.5s linear;
  text-align: right;
`;

const GameId = styled(Copy)`
  display: block;
  width: 100%;
  text-align: left;
`;

const copyToClipboard = (id: string) => {
  window.navigator.clipboard.writeText(`${window.location.origin}/game/${id}`);
};

const PendingGame = ({ id, isNew = false }: { id: string, isNew?: boolean }) => (
  <PendingGameRow isNew={isNew}>
    <GameId>{ id }</GameId>
    <GameLink as={Link} to={`/game/${id}`}>Open game</GameLink>
    <CopyLink as="button" onClick={() => copyToClipboard(id)}>Copy link</CopyLink>
  </PendingGameRow>
);

const ActiveGame = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TurnMarker = styled<{ isYourTurn: boolean }>(Copy)`
  color: ${({ theme, isYourTurn }) => (isYourTurn ? theme.colors.blue : 'currentColor')};
`;

const GameList = ({ myUserId, games }: { games: any, myUserId: string }) => {
  if (!games?.length) {
    return <Copy>No games here yet!</Copy>;
  }

  return (
    <div>
      {
        games.map((game) => {
          const { id: gameId, status, players, currentPlayer, turnNumber, result } = game;

          if (['PENDING', 'NEW'].includes(status)) {
            return <PendingGame key={gameId} id={gameId} isNew={status === 'NEW'} />;
          }

          const opponent = players.find(({ user }) => user.id !== myUserId);

          if (status === 'COMPLETE') {
            return (
              <GameLink key={gameId} as={Link} to={`/game/${gameId}`}>
                You
                { result.outcome === 'VICTORY' && result.winner.id === myUserId && ' beat ' }
                { result.outcome === 'VICTORY' && result.winner.id !== myUserId && ' lost to ' }
                { result.outcome === 'DRAW' && ' drew with ' }
                <b>{ opponent.user.name }</b>
              </GameLink>
            );
          }

          const isYourTurn = currentPlayer?.id === myUserId;

          return (
            <ActiveGame key={gameId} as={Link} to={`/game/${gameId}`}>
              <Copy>vs. <b>{ opponent.user.name }</b></Copy>
              {/* TODO - this isn't always really accurate - because you might need to place on their turn */}
              <TurnMarker isYourTurn={isYourTurn}>{ isYourTurn ? 'Your turn' : 'Their turn' }</TurnMarker>
              <Copy>turn { turnNumber }</Copy>
            </ActiveGame>
          );
        })
      }
    </div>
  );
};

const Wrapper = styled.div`

`;

const MainSection = styled.div`
  padding-top: 1rem;
  padding-bottom: 2rem;
`;

const MainContent = styled(PageContent)`
`;

const Greeting = styled(Quote)`
`;

const Name = styled.span`
  color: ${({ theme }) => theme.colors.blue};
`;

const GameHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
`;

const GreetingContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
  margin-bottom: -0.5rem;
`;

const GamesPage = () => {
  const userId = useAppState(({ auth }) => auth.userId);

  const { data, loading, error } = useQuery(MY_GAMES, {
    variables: { userId },
    pollInterval: 30000,
  });

  const [createGame, { loading: createLoading, error: createError }] = useMutation(CREATE_GAME, {
    variables: {
      userId,
    },
    update: (cache, { data: { createGame: { gameId } } }) => {
      copyToClipboard(gameId);
      cache.writeQuery({
        query: MY_GAMES,
        variables: {
          userId,
        },
        data: {
          ...data,
          games: {
            ...data.games,
            nodes: [
              {
                __typename: 'Game',
                id: gameId,
                status: 'NEW', // HACK - doens't work because going back from a game to games list they're still cached as NEW
                // Also would be nice to do it for when it polls + moves to active - need to keep local list or something
                // Also the anim is a bit fucked becuase of combo between anim + transition
              },
              ...data.games.nodes,
            ],
          },
        },
      });
    },
  });

  if (loading) {
    return <div>Loading your info</div>;
  }

  if (error || !data) {
    return <div>Error loading your games. Sorry. Send me money so I can quit and spend time fixing it.</div>;
  }

  if (createError) {
    return <div>Error creating game. Sorry. Send me money so I can quit and spend time fixing it.</div>;
  }

  const activeGames = data.activeGames?.nodes || [];
  const pendingGames = data.games?.nodes || [];
  const completeGames = data.completeGames?.nodes || [];

  return (
    <Wrapper>
      <PageHeader>
        <HeaderContent>
          <HeaderButton as={Link} to={`profile/${userId}`}>profile</HeaderButton>
          <HeaderTitle as="h1">Seven Hand Poker</HeaderTitle>
          <HeaderButton onClick={() => console.log('hi')}>rules</HeaderButton>
        </HeaderContent>
      </PageHeader>
      <MainSection>
        <MainContent>
          <GreetingContent>
            <Greeting>Hello there <Name>{data?.me?.name}</Name>!</Greeting>
            <Button onClick={createGame} disabled={createLoading}>
              { createLoading ? 'Loading...' : 'New game' }
            </Button>
          </GreetingContent>

          <GameHeader>
            <Title>Pending games</Title>
          </GameHeader>
          <GameList myUserId={userId} games={pendingGames} />

          <GameHeader><Title>Active games</Title></GameHeader>
          <GameList myUserId={userId} games={activeGames} />

          <GameHeader><Title>Completed games</Title></GameHeader>
          <GameList myUserId={userId} games={completeGames} />
        </MainContent>
      </MainSection>
    </Wrapper>
  );
};

export default GamesPage;
