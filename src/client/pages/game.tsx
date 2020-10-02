import React, { useCallback, useEffect } from 'react';
import Game from 'client/organisms/game';
import { useAppState } from 'client/state';

import { useQuery, useMutation, gql } from '@apollo/client';

const ALL_GAMES = gql`
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

const GamePage = ({ match: { params } }) => {
  const gameId = params.id;
  const userId = useAppState(({ auth }) => auth.userId);

  const { data, loading, error, refetch } = useQuery(ALL_GAMES, {
    skip: !gameId,
    variables: {
      gameId,
    },
  });

  const onJoined = useCallback(() => {
    refetch();
  }, [refetch]);

  // TODO move it down to the joining screen with onRetry callback and clickable button
  // Also make time configurable
  useEffect(() => {
    const openSlot = data?.game?.players?.find(({ open }) => open);

    const timeoutId = openSlot ? setTimeout(refetch, 5000) : null;

    return () => {
      if (timeoutId != null) {
        clearTimeout(timeoutId);
      }
    };
  });

  if (!gameId) {
    return <div>wtf error</div>;
  }

  if (!userId) {
    return <div>No user error</div>;
  }

  if (loading) {
    return <div>Loading</div>;
  }

  if (error) {
    return <div>{ error.message }</div>;
  }

  if (!data.game) {
    return <div>No game</div>;
  }

  const { me, opponent, openSlot } = data.game.players.reduce((acc, player) => {
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
    return <JoinGame gameId={gameId} userId={userId} playerId={openSlot.id} onCompleted={onJoined} />;
  }

  if (!me && !openSlot) {
    // Not allowed in
    return <div>Game is already full - without you - get out of here.</div>;
  }

  if (!opponent) {
    return <WaitingForOpponent refetch={refetch} gameId={gameId} />;
  }

  return (
    <Game gameId={gameId} credentials={me.credentials} playerId={me.id} />
  );
};

export default GamePage;
