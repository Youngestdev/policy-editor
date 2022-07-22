import LoginGithub from "react-login-github";
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";

import { AuthContext } from "../../index";
import request from "../../utils/request";
import { Center } from "@chakra-ui/react";

let client_id = process.env.REACT_APP_CLIENT_ID

const GitHubAuth = () => {
    const { state, dispatch } = useContext(AuthContext); 
    
    const onSuccess = response => {
        // store the code from the response object into a variable and send a request with the code as the body
        const code = response.code;
        request.get(`/github/token?code=${code}`, {params: {
            client_id: client_id,
            client_secret: process.env.REACT_APP_CLIENT_SECRET
        }})
            .then(res => {
                // dispatch result to the store
                dispatch({
                    type: "LOGIN",
                    payload: res.data,
                    provider: "github"
                });
            }
            )
            .catch(err => {
                console.log(err);
            });
        }
        const onFailure = response => console.error(response);
    
        // navigate to / is the user is logged in
        if (state.isLoggedIn) {
            return <Navigate to="/" />;
        }

    return (
        <Center>
            <LoginGithub
                clientId={client_id}
                onSuccess={onSuccess}
                onFailure={onFailure}
            />
        </Center>
    )
}

export default GitHubAuth;