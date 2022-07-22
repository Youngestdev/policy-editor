import { Stack } from "@chakra-ui/react";
import GitHubAuth from "./GitHub";
import GitLabAuth from "./GitLab";

const Auth = () => (
    <Stack>
    <GitHubAuth />
    <GitLabAuth />
    </Stack>
)

export default Auth;