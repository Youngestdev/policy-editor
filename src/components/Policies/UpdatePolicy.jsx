import { FormControl, FormLabel, Heading, Input } from "@chakra-ui/react";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import request from "../../utils/request";

const UpdatePolicy = () => {
    const [policy, setPolicy] = useState({
        name: "",
        rules: [],
    });
    let params = useParams()

    useEffect(() => {
        // retrieve all the policies from the endpoint
        // and set the state to the policies
        request.get(`policies/${params.name}`)
        .then((response) => {
            setPolicy({
                name: response.data.name,
                rules: [...response.data.rules],
            });
            console.log(policy)
        }).catch((error) => {
            console.log(error);
        }
        )
    }, [])

    return (
        <>
            <Heading as="h2">Update Policy - { policy.name } </Heading>
        </>
    )
}

export default UpdatePolicy;