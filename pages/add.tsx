import { useSession } from "@inrupt/solid-ui-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Add() {
  const { session } = useSession();
  const router = useRouter();
  const [isLoggedIn, setLoggedIn] = useState<boolean>(session.info.isLoggedIn);

  useEffect(() => {
  
  }, [router, session]);

  return (
    <>
      <h1>Welcome to OCoMa</h1>
      { isLoggedIn === false ? "Not logged in": `Logged in as ${session.info.webId}`}
    </>
  )
}
