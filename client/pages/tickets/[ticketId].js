import Router from "next/router";

import useRequest from "../../hooks/useRequest";

const SingleTicket = ({ ticket }) => {
  const { errors, doRequest } = useRequest("/api/orders", {
    method: "POST",
    data: {
      ticketId: ticket._id,
    },
    onSuccess: ({ order }) => {
      Router.push("/orders/[orderId]", `/orders/${order._id}`);
    },
  });

  return (
    <section>
      <h1>{ticket.title}</h1>
      <h2>{ticket.price}</h2>

      <button
        type="button"
        className="btn btn-primary"
        onClick={() => doRequest()}
      >
        Purchase
      </button>
    </section>
  );
};

SingleTicket.getInitialProps = async (ctx, client) => {
  const { ticketId } = ctx.query;
  const {
    data: { ticket },
  } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket };
};

export default SingleTicket;
