import React, { ReactChild } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import colors from 'client/styles/theme/colors';

type Props = {
  children: ReactChild,
};

const defaultTheme = {
  colors,
};

const ThemeProvider = ({ children }: Props) => (
  <StyledThemeProvider theme={defaultTheme}>
    { children }
  </StyledThemeProvider>
);

export default ThemeProvider;
