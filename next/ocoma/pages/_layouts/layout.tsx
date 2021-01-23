import Head from 'next/head'
import Link from 'next/link'
import styles from '../../styles/Home.module.css'
import {
  LoginButton,
  LogoutButton,
} from "@inrupt/solid-ui-react";

function openNav(e) {
  document.getElementById("sideNav")!.style.width = "8em";
}

function closeNav(e) {
  document.getElementById("sideNav")!.style.width = "0";
}

export const Layout: React.FC<{children:JSX.Element[] | JSX.Element, redirectUrl: string, oidcIssuer: string}> = ({ children, redirectUrl, oidcIssuer }) => {
  return (
    <div className={styles.container}>
        <Head>
          <title>OCoMa</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <header>
            <ul className="horizontal">
              <li><a onClick={openNav}>Menu</a></li>
              <li><LoginButton oidcIssuer={oidcIssuer} redirectUrl={redirectUrl} /></li>
              <li><LogoutButton /></li>
            </ul>
        </header>
        <nav id="sideNav" className="sidenav">
            <a className="closebtn" onClick={closeNav}>&times;</a>
            <Link href="/add"><a>Add</a></Link>
            <Link href="/browse"><a>Browse</a></Link>
            <Link href="/give"><a>Give</a></Link>
          </nav>
          { children }
    </div>
  )
}
