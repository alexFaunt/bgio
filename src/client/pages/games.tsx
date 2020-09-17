import React from 'react';
import { useDispatch } from 'client/state';
import { logout } from 'client/state/actions/auth';

const GamesPage = () => {
  const dispatch = useDispatch();

  return (
    <div>
      <div>Games!</div>
      <button type="button" onClick={() => dispatch(logout())}>
        Logout
      </button>
    </div>
  );
};

export default GamesPage;
