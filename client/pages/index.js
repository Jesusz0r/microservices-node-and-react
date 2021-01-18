import Link from "next/link";

const Index = ({ tickets }) => {
  return (
    <section>
      <h1>Tickets</h1>

      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
          </tr>
        </thead>

        <tbody>
          {tickets && tickets.length ? (
            tickets.map((ticket) => (
              <tr key={ticket._id}>
                <td>
                  <Link
                    href={`/tickets/[ticketId]`}
                    as={`/tickets/${ticket._id}`}
                  >
                    {ticket.title}
                  </Link>
                </td>
                <td>$ {ticket.price}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">
                <h2>Actualmente no hay tickets</h2>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
};

Index.getInitialProps = async (_, client) => {
  const {
    data: { tickets },
  } = await client.get("/api/tickets");

  return { tickets };
};

export default Index;
