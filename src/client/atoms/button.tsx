import styled from 'styled-components';
import { ThemeColors } from 'client/styles/theme/colors';

const Button = styled.button<{ color?: ThemeColors }>`
  background: ${({ theme, color }) => theme.colors[color || 'green']};
  padding: 0.53rem 0.7rem 0.6rem;
  border-radius: 0.2rem;
  box-shadow: 0rem 0.3rem 0.4rem -0.4rem black;
  display: block;
  flex-shrink: 0;
`;

export default Button;
