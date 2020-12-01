import Link from "next/link";

const Header = ({ user }) => {
  return (
    <nav className="navbar navbar-light bg-light">
      <Link className="navbar-brand" href="/">
        Home
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">
          {!user?.id ? (
            <>
              <li>
                <Link href="/auth/signin">Signin</Link>
              </li>
              <li>
                <Link href="/auth/signup">Signup</Link>
              </li>
            </>
          ) : (
            <li>
              <Link href="/auth/signout">Signout</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
