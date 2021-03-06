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
              background: ${theme.colors.white};
              color: ${theme.colors.darkGrey};
            }

            *:focus {
              outline: 0;
            }

            .bgio-client {
              height: 100%;
              max-width: calc(100vw - 2rem);
            }
          `
        }
      </style>
    </>
  );
};

export default GlobalStyle;
