import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useAppState } from 'client/state';
import { logout } from 'client/state/actions/auth';
import { useMutation, useQuery, gql } from '@apollo/client';
import { useHistory } from 'react-router';

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
    games(conditions: { userId: $userId }, limit:100) {
      nodes {
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
  }
`;

const GameList = ({ userId }: { userId: string }) => {
  const { data, loading, error } = useQuery(MY_GAMES, {
    variables: { userId },
  });

  if (loading) {
    return <div>Loading your games</div>;
  }

  if (error) {
    return <div>Error loading your games {error.message}</div>;
  }

  return data.games.nodes.map(({ id }) => (
    <div>
      <Link to={`/game/${id}`}>Game: {id}</Link>
    </div>
  ));
};

const GamesPage = () => {
  const dispatch = useDispatch();
  const userId = useAppState(({ auth }) => auth.userId);
  const history = useHistory();

  const [createGame, { loading, error }] = useMutation(CREATE_GAME, {
    variables: {
      userId,
    },
    onCompleted: (res) => {
      history.push(`/game/${res.createGame.gameId}`);
    },
  });

  console.log('userId', userId);

  return (
    <div>
      <div>Games!</div>
      <button onClick={createGame}>Create game</button>
      { loading && <div>LOADING</div> }
      { error && <div>FAILED: {error.message}</div> }

      {/* <button>Join game</button> */}
      <button type="button" onClick={() => dispatch(logout())}>
        Logout
      </button>

      { userId && <GameList userId={userId} /> }
    </div>
  );
};

export default GamesPage;
