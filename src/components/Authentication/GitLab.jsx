import { Button } from "@chakra-ui/react";
import axios from "axios";
import { useContext } from "react";
import { Navigate } from "react-router";

import { AuthContext } from "../../index";

const GitLabAuth = () => {

  const GITLAB_URL = "https://gitlab.com/oauth/authorize"
  const { state, dispatch } = useContext(AuthContext); 

  if (state.isLoggedIn) {
    return <Navigate to="/" />
  }

  const retrieveAccessToken = () => {
    axios.get(GITLAB_URL, {
      params: {
        client_id: process.env.REACT_APP_GITLAB_APP_ID,
        redirect_uri: "https://youngestdev-policy-editor-6w5wxpvj35qrq-8080.githubpreview.dev",
        response_type: "code",
        scope: "write_repository"
      }
    }).then(response => console.log(response.data))
  }

  return (
    <Button onClick={retrieveAccessToken}>Sign in with GitLab</Button>
  )
}

export default GitLabAuth;