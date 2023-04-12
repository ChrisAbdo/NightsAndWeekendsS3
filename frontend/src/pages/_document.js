import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="Discover new music on Polygon, earn by creating and sharing your own music."
          />
          <meta property="og:site_name" content="etherwav-s3.vercel.app" />
          <meta
            property="og:description"
            content="Discover new music on Polygon, earn by creating and sharing your own music."
          />
          <meta property="og:title" content="Etherwav" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Etherwav" />
          <meta
            name="twitter:description"
            content="Discover new music on Polygon, earn by creating and sharing your own music."
          />
          <meta
            property="og:image"
            content="https://etherwav-s3.vercel.app/darkmode.jpeg"
          />
          <meta
            name="twitter:image"
            content="https://etherwav-s3.vercel.app/darkmode.jpeg"
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