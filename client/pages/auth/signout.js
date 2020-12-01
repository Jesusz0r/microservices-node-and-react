import { useEffect } from "react";
import Router from "next/router";

import useRequest from "../../hooks/useRequest";

const Signout = () => {
  const { doRequest } = useRequest("/api/users/signout", {
    method: "POST",
    data: {},
    onSuccess: () => {
      Router.push("/");
    },
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <h1>Signing out</h1>;
};

export default Signout;
