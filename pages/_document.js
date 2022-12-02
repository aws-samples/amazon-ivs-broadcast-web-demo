import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
        {/* Render modals */}
        <div id="modal-container"></div>
        {/* Render alerts */}
        <div id="alert-container"></div>
      </body>
    </Html>
  )
}
