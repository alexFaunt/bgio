import React, { ReactNode } from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import { Title } from 'client/atoms/typography';

const overlayStyles = { backgroundColor: 'rgba(47, 47, 47, 0.75)', zIndex: 10 };
const contentStyles = { top: '1rem', left: '1rem', right: '1rem', bottom: '1rem', padding: '0.7rem 1rem' };

const ModalHeader = styled.header<{ title?: string }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: white;
  margin: 0 -1rem 1rem;
  padding: 0 1rem 0.5rem;
  box-shadow: ${({ title }) => (title ? '0px -0.1rem 0.5rem -12px black' : 'none')};

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

type Props = {
  children: ReactNode,
  title?: string,
  isOpen: boolean,
  close: () => void,
  contentStyle?: {[string: key]: string},
};

export default ({ children, title = '', isOpen, close, contentStyle = null }: Props) => (
  <Modal
    isOpen={isOpen}
    onRequestClose={close}
    style={{
      overlay: overlayStyles,
      content: { ...contentStyles, ...contentStyle },
    }}
  >
    <ModalHeader title={title}>
      <Title>{ title }</Title>
      <ModalCloseButton onClick={close}>close</ModalCloseButton>
    </ModalHeader>
    { children }
  </Modal>
);
