// https://levelup.gitconnected.com/how-to-implement-login-with-github-in-a-react-app-bd3d704c64fc
// https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect

import LoginGithub from "react-login-github";
import React from "react";

import request from "../../utils/request";

const onSuccess = response => {
    // store the code from the response object into a variable and send a request with the code as the body
    const code = response.code;
    request.get(`/token?code=${code}`)
        .then(res => {
            // store access_token and expires_in in local storage
            localStorage.setItem("access_token", res.data.access_token);
            localStorage.setItem("expires_in", res.data.expires_in);
        }
        )
        .catch(err => {
            console.log(err);
        }
        );        
}

const onFailure = response => console.error(response);

let client_id = process.env.REACT_APP_CLIENT_ID

const GitHubAuth = () => {
    return (
        <LoginGithub
            clientId={client_id}
            onSuccess={onSuccess}
            onFailure={onFailure}
        />
    )
}

export default GitHubAuth;