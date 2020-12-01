import { useState } from "react";
import Link from "next/link";
import Router from "next/router";

import useRequest from "../hooks/useRequest";

const SignForm = ({ title, url }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { errors, doRequest } = useRequest(url, {
    method: "POST",
    data: {
      email,
      password,
    },
    onSuccess: () => {
      Router.push("/");
    },
  });

  const changeEmail = (e) => {
    setEmail(e.target.value);
  };
  const changePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    doRequest();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>{title}</h1>

      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          className="form-control"
          value={email}
          onChange={changeEmail}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          className="form-control"
          value={password}
          onChange={changePassword}
        />
      </div>

      {errors && (
        <div className="alert alert-danger">
          <h4>Ooops...</h4>

          <ul>
            {errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      )}

      <button type="submit" className="btn btn-primary">
        Submit
      </button>
      <button type="button" className="btn btn-secondary">
        <Link href="/">Cancel</Link>
      </button>
    </form>
  );
};

export default SignForm;
