import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation, gql } from '@apollo/client';

import Game from 'client/organisms/game';
import { useAppState } from 'client/state';
import PageHeader from 'client/organisms/page-header';
import OpponentNameContext from 'client/organisms/board/opponent-name';
import PageContent from 'client/layout/page-content';

const GET_GAME = gql`
  query GetGame($gameId: String!) {
    game(id: $gameId) {
      id
      players {
        id
        credentials
        open
        user {
          id
          name
        }
      }
    }
  }
`;

const JOIN_GAME = gql`
  mutation JoinGame($userId: String!, $playerId: String!, $gameId: String!) {
    joinGame(input: { gameId:$gameId, userId: $userId, playerId: $playerId }) {
      playerCredentials
    }
  }
`;

const JoinGame = ({ gameId, userId, playerId, onCompleted }) => {
  const [joinGame, { loading, error }] = useMutation(JOIN_GAME, {
    variables: {
      gameId,
      userId,
      playerId,
    },
    onCompleted,
  });

  useEffect(() => {
    console.log('Joining game');
    joinGame();
  }, [joinGame]);

  return <div>Joining game!</div>;
};

const WaitingForOpponent = ({ refetch, gameId }) => {
  useEffect(() => {
    const id = setInterval(() => {
      refetch();
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [refetch]);

  return (
    <div>Waiting for opponent - share link {location.origin}/game/{gameId}</div>
  );
};

const GameWrap = styled(PageContent)`
  flex-grow: 1;
`;

const GamePageHeader = styled(PageHeader)`
  flex-shrink: 0;
`;

const Content = ({ gameId, userId }: unknown) => {
  const { data, loading, error, refetch } = useQuery(GET_GAME, {
    skip: !gameId || !userId,
    variables: {
      gameId,
    },
  });

  const game = data?.game;

  const onJoined = useCallback(() => {
    refetch();
  }, [refetch]);

  // TODO move it down to the joining screen with onRetry callback and clickable button
  // Also make time configurable
  useEffect(() => {
    const openSlot = game?.players?.find(({ open }) => open);

    const timeoutId = openSlot ? setTimeout(() => refetch(), 5000) : null;

    return () => {
      if (timeoutId != null) {
        clearTimeout(timeoutId);
      }
    };
  }, [game, refetch]);

  if (!gameId) {
    return <div>404 Not Found</div>;
  }

  if (!userId) {
    return <div>No user?!</div>;
  }

  if (loading) {
    return <div>Loading</div>;
  }

  if (error) {
    console.error(error);
    return <div>Something went wrong. Sorry - send me money so I can quit my day job and fix it.</div>;
  }

  if (!data.game) {
    return <div>No game found</div>;
  }

  const { me, opponent, openSlot } = game.players.reduce((acc, player) => {
    const { user, open } = player;
    if (user && user.id === userId) {
      acc.me = player;
    }

    if (user && user.id !== userId) {
      acc.opponent = player;
    }

    if (open) {
      acc.openSlot = player;
    }

    return acc;
  }, {
    me: null,
    opponent: null,
    openSlot: null,
  });

  if (!me && openSlot) {
    // Join game?
    return <JoinGame gameId={game.id} userId={userId} playerId={openSlot.id} onCompleted={onJoined} />;
  }

  if (!me && !openSlot) {
    // Not allowed in
    return <div>Game is already full - without you - get out of here.</div>;
  }

  if (!opponent) {
    return <WaitingForOpponent refetch={refetch} gameId={game.id} />;
  }

  return (
    <GameWrap>
      <OpponentNameContext.Provider value={opponent.user.name}>
        <Game gameId={game.id} credentials={me.credentials} playerId={me.id} />
      </OpponentNameContext.Provider>
    </GameWrap>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const GamePage = ({ match: { params } }) => {
  const gameId = params.id;
  const userId = useAppState(({ auth }) => auth.userId);

  return (
    <Wrapper>
      <GamePageHeader link={{ to: '/games', children: 'games' }}>
        hello
      </GamePageHeader>
      <Content gameId={gameId} userId={userId} />
    </Wrapper>
  );
};

export default GamePage;
