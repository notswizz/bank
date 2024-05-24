import { ThemeProvider } from 'styled-components';
import GlobalStyles from '../components/GlobalStyles';
import original from 'react95/dist/themes/original';

export default function App({ Component, pageProps }) {
  return (
    <>
      <GlobalStyles />
      <ThemeProvider theme={original}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
