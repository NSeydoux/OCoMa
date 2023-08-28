import { useSession } from "@inrupt/solid-ui-react";
import Link from "next/link";

// TODO: Make OP configurable.
const OPENID_PROVIDER = "https://login.inrupt.com";

const LoginButton = () => {
  const { session } = useSession();
  if(!session.info.isLoggedIn) {
    return <button onClick={
      async () => await session.login({
        oidcIssuer: OPENID_PROVIDER,
        clientName: "OCoMa",
        redirectUrl: "http://localhost:3000/",
      })
    }>Login</button>
  }
  return <button onClick={async () => await session.logout()}>Logout</button>
}

export const NavBar = () => {
  return <nav><LoginButton /> <Link href="/">Home</Link> <Link href="/add">Add</Link></nav>
}
