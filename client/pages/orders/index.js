import Link from "next/link";

const Orders = ({ orders }) => {
  return (
    <section>
      <h1>Orders</h1>

      <ul>
        {orders.map((order) => (
          <li key={order._id}>
            <Link href={`/orders/[orderId]`} as={`/orders/${order._id}`}>
              {`${order.ticket.title} - ${order.status}`}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

Orders.getInitialProps = async (_, client) => {
  const {
    data: { orders },
  } = await client.get("/api/orders");

  return { orders };
};

export default Orders;
