import { ThemeProvider } from 'styled-components';
import GlobalStyles from '../components/GlobalStyles';
import original from 'react95/dist/themes/original';
import Providers from '../Providers';

export default function App({ Component, pageProps }) {
  return (
    <>
      <GlobalStyles />
      <ThemeProvider theme={original}>
        <Providers>
          <Component {...pageProps} />
        </Providers>
      </ThemeProvider>
    </>
  );
}