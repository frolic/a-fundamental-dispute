import "tailwindcss/tailwind.css";
import "react-toastify/dist/ReactToastify.css";

import type { AppProps } from "next/app";
import Head from "next/head";
import { ToastContainer } from "react-toastify";

import { EthereumProviders } from "../EthereumProviders";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>A Fundamental Dispute</title>
        <link rel="shortcut icon" href="/favicon.jpg" type="image/jpeg" />
      </Head>
      <EthereumProviders>
        <Component {...pageProps} />
      </EthereumProviders>
      <ToastContainer theme="dark" position="bottom-right" draggable={false} />
    </>
  );
};

export default MyApp;
