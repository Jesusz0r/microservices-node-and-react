import { useState, useEffect } from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/useRequest";

const Order = ({ order, user }) => {
  const { doRequest } = useRequest("/api/payments", {
    method: "POST",
    data: {
      orderId: order._id,
    },
  });
  const [timeLeft, setTimeLeft] = useState(
    Math.round((new Date(order.expiresAt) - new Date()) / 1000)
  );

  useEffect(() => {
    const timerId = setInterval(calculateTimeLeft, 1000);

    function calculateTimeLeft() {
      const msLeft = new Date(order.expiresAt) - new Date();
      const secondsLeft = Math.round(msLeft / 1000);

      if (secondsLeft <= 0) {
        setTimeLeft(0);

        return clearInterval(timerId);
      }

      setTimeLeft(secondsLeft);
    }

    calculateTimeLeft();

    return () => {
      clearInterval(timerId);
    };
  }, []);

  return (
    <section>
      <h1>Order</h1>
      <h2>Price: ${order.ticket.price}</h2>

      <p>{timeLeft} seconds left</p>

      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey={"pk_test_8DQo50f1vIXSHd7HyJNecLm700tsbc4T0v"}
        amount={order.ticket.price * 100}
        email={user.email}
      />

      {/* <button type="button" className="btn btn-primary">
        Pay
      </button> */}
    </section>
  );
};

Order.getInitialProps = async (ctx, client) => {
  const { orderId } = ctx.query;
  const {
    data: { order },
  } = await client.get(`/api/orders/${orderId}`);

  return { order };
};

export default Order;
