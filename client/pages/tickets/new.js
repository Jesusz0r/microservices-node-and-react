import { useState } from "react";
import Router from "next/router";
import Link from "next/link";

import useRequest from "../../hooks/useRequest";

const NewTicketForm = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const { errors, doRequest } = useRequest("/api/tickets", {
    method: "POST",
    data: {
      title,
      price,
    },
    onSuccess: () => {
      Router.push("/");
    },
  });

  const changeTitle = (e) => {
    setTitle(e.target.value);
  };
  const changePrice = (e) => {
    setPrice(e.target.value);
  };
  const onPriceBlur = () => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    doRequest();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>New Ticket</h1>

      <div className="form-group">
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          className="form-control"
          value={title}
          onChange={changeTitle}
        />
      </div>

      <div className="form-group">
        <label htmlFor="price">Password:</label>
        <input
          type="text"
          id="price"
          name="price"
          className="form-control"
          value={price}
          onBlur={onPriceBlur}
          onChange={changePrice}
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

export default NewTicketForm;
