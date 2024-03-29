"use client";

import { useSession } from "@inrupt/solid-ui-react";
import { useContext } from "react";
import Button from '@mui/material/Button';
import { DeploymentContext } from "../contexts/deploymentContext";
import style from "./LoginButton.module.css";

// TODO: Make OP configurable.
const OPENID_PROVIDER = "https://login.inrupt.com";

export default function LoginButton() {
  const { session } = useSession();
  const { deploymentUrl } = useContext(DeploymentContext);
    return <Button 
      onClick={
        async () => await session.login({
          // Default to dynamic client registration when using a local deployment.
          clientId: deploymentUrl?.includes("localhost") 
            ? undefined
            : new URL("/id", deploymentUrl).href,
          oidcIssuer: OPENID_PROVIDER,
          redirectUrl: deploymentUrl,
        })
      }
      variant="contained"
      className={style.callToAction}
    >Login</Button>
}
