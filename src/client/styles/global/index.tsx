import React from 'react';
import { useTheme } from 'styled-components';

import normalize from 'client/styles/global/normalize.css';
import reset from 'client/styles/global/reset.css';

export const maxPageWidth = 1200;
const fontSize = 4;
const maxFontSize = maxPageWidth * (fontSize / 100);

const GlobalStyle = () => {
  const theme = useTheme();

  return (
    <>
      <style>
        {
          `
            ${normalize}
            ${reset}

            html {
              font-family: "Poppins", sans-serif;
              font-size: min(${fontSize}vw, ${maxFontSize}px);
            }

            body {
              min-height: 100%;
              min-width: 100vw;
              overflow-x: hidden;
              background: ${theme.colors.offWhite};
              color: ${theme.colors.darkGrey};
            }

            *:focus {
              outline: 0;
            }
          `
        }
      </style>
    </>
  );
};

export default GlobalStyle;
