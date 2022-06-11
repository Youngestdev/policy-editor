// https://levelup.gitconnected.com/how-to-implement-login-with-github-in-a-react-app-bd3d704c64fc
// https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect

import LoginGithub from "react-login-github";
import React from "react";

const onSuccess = response => console.log(response.code);
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