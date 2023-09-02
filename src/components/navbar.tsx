import { useSession } from "@inrupt/solid-ui-react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useContext } from "react";
import { DeploymentContext } from "../contexts/deploymentContext";

// TODO: Make OP configurable.
const OPENID_PROVIDER = "https://login.inrupt.com";

const LoginButton = () => {
  const { session } = useSession();
  const { deploymentUrl } = useContext(DeploymentContext);
  if(!session.info.isLoggedIn) {
    return <button onClick={
      async () => await session.login({
        oidcIssuer: OPENID_PROVIDER,
        clientName: "OCoMa",
        redirectUrl: deploymentUrl,
      })
    }>Login</button>
  }
  return <button onClick={async () => await session.logout()}>Logout</button>
}

export const NavBar = () => {
  return (
    <nav>
      <LoginButton/>
      <Link href="/">Home</Link>
      <Link href="/add">Add</Link>
    </nav>
  );
}
