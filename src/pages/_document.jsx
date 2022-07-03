import Document, { Head, Html, Main, NextScript } from "next/document";
import {init} from '../three0lib';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const originalRenderPage = ctx.renderPage

    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html className="bg-gray-400">
        <Head>
          <script
            async
            defer
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_UUID}
            src={process.env.NEXT_PUBLIC_UMAMI_URI}></script>
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
