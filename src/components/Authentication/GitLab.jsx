import { Button, Link } from "@chakra-ui/react";
import axios from "axios";
import { useContext } from "react";
import { Navigate } from "react-router";
import { useLocation } from "react-router-dom";

import { AuthContext } from "../../index";

const GitLabAuth = () => {

  const GITLAB_URL = `https://gitlab.com/oauth/authorize?client_id=${process.env.REACT_APP_GITLAB_APP_ID}&redirect_uri=${process.env.REACT_APP_GITLAB_REDIRECT_URI}&response_type=code&scope=read_user%20read_repository`;
  const { state, dispatch } = useContext(AuthContext); 

  if (state.isLoggedIn) {
    return <Navigate to="/" />
  }

  return (
    <Link href={GITLAB_URL}>
      Login with GitLab
    </Link>    
  )
}

export const HandleAccessToken = () => {
  const { state, dispatch } = useContext(AuthContext); 

  const location = useLocation();
  const code = location.search.substring(6);

  if (code.length < 64 ) {
    if (state.isLoggedIn) {
      return <Navigate to="/policies" />
    }
    return <Navigate to="/" />;
  }

  // make a request to the gitlab api to get the access token
  axios
    .get(
      // Temporary address until I'm able to fix the direct interaction with GitLab
      `https://web-youngestdev.cloud.okteto.net/api/auth/callback/gitlab?code=${code}&redirect_uri=${process.env.REACT_APP_GITLAB_REDIRECT_URI}&client_id=${process.env.REACT_APP_GITLAB_APP_ID}&client_secret=${process.env.REACT_APP_GITLAB_SECRET}`
    )
    .then((response) => {
      console.log("Response from GitLab: ", response)
      // store the access token in the state
      dispatch({
        type: "LOGIN",
        payload: response.data,
      });
    }
    )
    .catch((error) => {
      console.log(error);
    }
    );    

    if (state.isLoggedIn) {
      return <Navigate to="/policies" />
    }
  return (
    <p>This is the first test here.</p>
  )
} 

export default GitLabAuth;