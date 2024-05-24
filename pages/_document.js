import Document, { Html, Head, Main, NextScript } from 'next/document';
import { parseCookies } from 'nookies'; // Use nookies to parse cookies on the server

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    const cookies = parseCookies(ctx); // Parse cookies from the context
    const extensionAuthToken = cookies.extensionAuthToken || ''; // Get the specific cookie

    return { ...initialProps, extensionAuthToken };
  }

  render() {
    const internalId = 'your-internal-id'; // Replace with your actual internal ID
    const publicKey = '4c0654348c4a7b8c4bf855d59ab16b65c5b69d6f';
    const { extensionAuthToken } = this.props;

    return (
      <Html>
        <Head>
          <script
            src="https://d1vhnbpkpweicq.cloudfront.net/extension-cdn.js"
            data-internal-id={internalId}
            data-public-key={publicKey}
            data-extension-auth-token={extensionAuthToken}
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
