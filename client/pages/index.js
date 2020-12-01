const Index = ({ user }) => {
  if (user?.id) {
    return <h1>You are logged in</h1>;
  }

  return <h1>Lading page</h1>;
};

export default Index;
