import { getSession } from "../lib/session";

// TODO: Make OP configurable.
const OPENID_PROVIDER = "https://login.inrupt.com";

const handleLogin = async () => {
  return getSession().login({
    oidcIssuer: OPENID_PROVIDER,
    clientName: "OCoMa",
    redirectUrl: window.location.href,
  })
}

const handleLogout = async () => {
  return getSession().logout();
}

const LoginButton = () => {
  if(!getSession().info.isLoggedIn) {
    return <button onClick={async () => await handleLogin()}>Login</button>
  }
  return <button onClick={async () => await handleLogout()}>Logout</button>
}

export const NavBar = () => {
  return <div><LoginButton /></div>
}
