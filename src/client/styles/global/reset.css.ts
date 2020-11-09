// CSS reset - additional rules over normalise to provide a consistent approach to styling
// https://medium.com/@elad/normalize-css-or-css-reset-9d75175c5d1e
export default `
  /****** Elad Shechter's RESET *******/
  /*** box sizing border-box for all elements ***/
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  a {
    text-decoration: none;
    color: currentColor;
    cursor: pointer;
  }
  button {
    background-color: transparent;
    color: currentColor;
    border-width: 0;
    padding: 0;
    cursor: pointer;
  }
  figure {
    margin: 0;
  }
  input::-moz-focus-inner {
    border: 0;
    padding: 0;
    margin: 0;
  }
  input {
    color: currentColor;
  }
  ul, dd {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  ol {
    margin: 0;
  }
  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    font-size: inherit;
    font-weight: inherit;
  }
  p {
    margin: 0;
  }
  cite  {
    font-style: normal;
  }
  fieldset {
    border-width: 0;
    padding: 0;
    margin: 0;
  }
`;
