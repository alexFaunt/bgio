import React, { useCallback, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

import Game from 'client/organisms/game';
import { useAppState } from 'client/state';
import PageHeader from 'client/organisms/page-header';

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

const Content = ({ game, refetch, userId }: unknown) => {
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
    <Game gameId={game.id} credentials={me.credentials} playerId={me.id} />
  );
};

const GamePage = ({ match: { params } }) => {
  const gameId = params.id;
  const userId = useAppState(({ auth }) => auth.userId);

  const { data, loading, error, refetch } = useQuery(GET_GAME, {
    skip: !gameId || !userId,
    variables: {
      gameId,
    },
  });

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

  return (
    <div>
      <PageHeader link={{ to: '/games', children: 'games' }}>
        hello
      </PageHeader>
      <Content game={data.game} userId={userId} refetch={refetch} />
    </div>
  );
};

export default GamePage;
