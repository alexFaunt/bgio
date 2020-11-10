import React, { ReactNode } from 'react';
import styled from 'styled-components';

type Props = {
  className?: string,
  children: ReactNode,
};

const Typography = ({ children, className }: Props) => <span className={className}>{ children }</span>;

export const HeroHeader = styled(Typography)`
  font-size: 2.6rem;
  line-height: 0.95;
  font-weight: 500;
`;

export const Title = styled(Typography)`
  display: block;
  font-weight: bold;
  font-size: 1.4rem;
`;

export const Copy = styled(Typography)`
  font-weight: 200;
`;

export const Secondary = styled(Typography)`
  font-size: 0.8rem;
  font-family: "Arapey", serif;
  font-style: italic;
`;

export const Quote = styled(Secondary)`
  font-size: 1.2rem;
  display: block;
`;

export default Typography;
