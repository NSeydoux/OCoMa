import { useSession } from "@inrupt/solid-ui-react";
import { GetServerSideProps } from "next";
import Link from "next/link";

export const getServerSideProps: GetServerSideProps<{
  deployUrl: string
}> = async () => {
  return { props: { deployUrl: process.env.VERCEL_URL ?? "http://localhost:3000/" } }
}

// TODO: Make OP configurable.
const OPENID_PROVIDER = "https://login.inrupt.com";

const LoginButton = ({ deployUrl }: { deployUrl: string }) => {
  const { session } = useSession();
  if(!session.info.isLoggedIn) {
    return <button onClick={
      async () => await session.login({
        oidcIssuer: OPENID_PROVIDER,
        clientName: "OCoMa",
        redirectUrl: deployUrl,
      })
    }>Login</button>
  }
  return <button onClick={async () => await session.logout()}>Logout</button>
}

export const NavBar = ({ deployUrl }: { deployUrl: string }) => {
  return (
    <nav>
      <LoginButton deployUrl={ deployUrl } />
      <Link href="/">Home</Link>
      <Link href="/add">Add</Link>
    </nav>
  );
}
