import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router';

import { useDispatch } from 'client/state';
import { logout } from 'client/state/actions/auth';
import Button from 'client/atoms/button';
import { Copy } from 'client/atoms/typography';
import PageContent from 'client/layout/page-content';

const Wrapper = styled(PageContent)`
  padding-top: 2rem;
  padding-bottom: 2rem;
  text-align: center;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const ProfilePage = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const onLogout = () => {
    history.replace('/games');
    dispatch(logout());
  };

  return (
    <Wrapper>
      <Copy>This page is still under construction - but you can use it to log out</Copy>
      <br />
      <Copy>Note that there&apos;s no account system yet, when you log out all your games are just sort of lost.</Copy>
      <br />
      <Button color="red" onClick={onLogout}>
        Log out
      </Button>
    </Wrapper>
  );
};

export default ProfilePage;
