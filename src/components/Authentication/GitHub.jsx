// https://levelup.gitconnected.com/how-to-implement-login-with-github-in-a-react-app-bd3d704c64fc
// https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect

import LoginGithub from "react-login-github";
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";

import { AuthContext } from "../../index";
import request from "../../utils/request";

let client_id = process.env.REACT_APP_CLIENT_ID

const GitHubAuth = () => {
    const { state, dispatch } = useContext(AuthContext);    
    
    const onSuccess = response => {
        // store the code from the response object into a variable and send a request with the code as the body
        const code = response.code;
        console.log(
            "code: ", code
        )
        request.get(`/token?code=${code}`)
            .then(res => {
                // dispatch result to the store
                dispatch({
                    type: "LOGIN",
                    payload: res.data,
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
        <LoginGithub
            clientId={client_id}
            onSuccess={onSuccess}
            onFailure={onFailure}
        />
    )
}

export default GitHubAuth;