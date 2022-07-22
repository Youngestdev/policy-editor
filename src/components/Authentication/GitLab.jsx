import { Center, Spinner, Link } from "@chakra-ui/react";
import axios from "axios";
import { useContext } from "react";
import { Navigate } from "react-router";
import { useLocation } from "react-router-dom";

import { AuthContext } from "../../index";

const GitLabAuth = () => {

  const GITLAB_URL = `https://gitlab.com/oauth/authorize?client_id=${process.env.REACT_APP_GITLAB_APP_ID}&redirect_uri=${process.env.REACT_APP_GITLAB_REDIRECT_URI}&response_type=code&scope=profile%20api%20read_api%20write_repository%20email`;
  const { state, dispatch } = useContext(AuthContext); 

  if (state.isLoggedIn) {
    return <Navigate to="/policies" />
  }

  return (
    <Link href={GITLAB_URL}>
      Login with GitLab
    </Link>    
  )
}

export const HandleAccessToken = () => {
  const { state, dispatch } = useContext(AuthContext);
  
  // Check if the url has the GitLab code with it.
  const location = useLocation();
  const code = location.search.substring(6);

  if (state.isLoggedIn) {
    return <Navigate to="/policies" />
  }

  if (code.length < 64 ) {
    if (state.isLoggedIn) {
      return <Navigate to="/policies" />
    }
    return <Navigate to="/login" />;
  }

  // make a request to the gitlab api to get the access token
  axios
    .post(
      // Temporary address until I'm able to fix the direct interaction with GitLab
      `https://gitlab.com/oauth/token`, {
          code: code,
          client_id: process.env.REACT_APP_GITLAB_APP_ID,
          client_secret: process.env.REACT_APP_GITLAB_SECRET,
          grant_type: "authorization_code",
          redirect_uri: process.env.REACT_APP_GITLAB_REDIRECT_URI
        }
  )
    .then((response) => {
      // store the access token in the state
      dispatch({
        type: "LOGIN",
        payload: response.data,
        provider: "gitlab",
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
     <Center>  
      <Spinner size='xl' /> 
     </Center>
  )
} 

export default GitLabAuth;