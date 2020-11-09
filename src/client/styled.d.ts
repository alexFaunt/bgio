import 'styled-components';
import { Colors } from 'client/styles/theme/colors';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: Colors,
  }
}
