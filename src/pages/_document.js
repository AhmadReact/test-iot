import Document, { Html, Head, Main, NextScript } from 'next/document';

/**
 * Mirrors the CRA `public/index.html`: loads Tailwind base, Fuse fonts, and
 * the Material icon stylesheets the rest of the app expects, plus the
 * `emotion-insertion-point` marker so MUI / Emotion injects styles in the
 * correct order.
 */
export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <base href="/" />
          <meta name="theme-color" content="#000000" />
          <meta
            name="description"
            content="A centralized IoT portal to manage devices, SIM connectivity, usage analytics, and billing in real time"
          />
          <link href="/assets/tailwind-base.css" rel="stylesheet" />
          <link
            href="/assets/fonts/material-design-icons/MaterialIconsOutlined.css"
            rel="stylesheet"
          />
          <link href="/assets/fonts/inter/inter.css" rel="stylesheet" />
          <link href="/assets/fonts/meteocons/style.css" rel="stylesheet" />
          <noscript id="emotion-insertion-point" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
