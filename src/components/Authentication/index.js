import { Box, Center, VStack } from "@chakra-ui/react";
import GitHubAuth from "./GitHub";
import GitLabAuth from "./GitLab";

const Auth = () => (
    <VStack p={8} direction={"column"}>
        <Box borderWidth='5px' w="50%" p={4}>
            <GitHubAuth />
            <GitLabAuth />
        </Box>
    </VStack>
)

export default Auth;