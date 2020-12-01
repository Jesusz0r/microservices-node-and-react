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
  const axios = buildAxiosClient(ctx);
  const pageProps = Component.getInitialProps
    ? await Component.getInitialProps(ctx)
    : null;

  try {
    const response = await axios.get("/api/users/current");

    return {
      pageProps,
      ...response.data,
    };
  } catch (error) {
    return {
      pageProps,
      user: {},
    };
  }
};

export default _App;
