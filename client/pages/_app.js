import "bootstrap/dist/css/bootstrap.css";
import { buildAxiosClient } from "../api";

import Header from "../components/Header";

const _App = ({ Component, user, pageProps }) => {
  return (
    <>
      <Header user={user} />
      <Component {...pageProps} user={user} />
    </>
  );
};

_App.getInitialProps = async ({ ctx, Component }) => {
  try {
    const axios = buildAxiosClient(ctx);
    const response = await axios.get("/api/users/current");
    const user = response?.data?.user || {};
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx, axios, user)
      : null;

    return {
      pageProps,
      user,
    };
  } catch (error) {
    return {
      pageProps: null,
      user: {},
    };
  }
};

export default _App;
