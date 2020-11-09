const colors = {
  white: '#ffffff',
  darkGrey: '#333333',
  grey: '#777777',
  lightGrey: '#efefef',
  red: '#ff7070',
  blue: '#6170b1',
  green: '#7ec99d',
  yellow: '#f3d77c',
};
export type Colors = typeof colors;
export type ThemeColors = keyof Colors;

export default colors;
