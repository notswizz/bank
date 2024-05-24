import Document, { Html, Head, Main, NextScript } from 'next/document';
import Cookies from 'js-cookie';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    const internalId = 'your-internal-id'; // Replace with your actual internal ID
    const publicKey = '4c0654348c4a7b8c4bf855d59ab16b65c5b69d6f';
    const extensionAuthToken = Cookies.get('extensionAuthToken');

    return (
      <Html>
        <Head>
          <script
            src="https://d1vhnbpkpweicq.cloudfront.net/extension-cdn.js"
            internalId={internalId}
            publicKey={publicKey}
            extensionAuthToken={extensionAuthToken}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
