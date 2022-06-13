import { FormControl, FormLabel, Heading, Input, Stack } from "@chakra-ui/react";
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from "react-hook-form";
import { useParams } from 'react-router';
import { extract_properties_from_rules } from "../../utils/form";
import request from "../../utils/request";

const UpdatePolicy = () => {
    const [policy, setPolicy] = useState({
        name: "",
        rules: [],
    });

    let params = useParams()

    const { control, handleSubmit, register, watch } = useForm();
    const { fields, append, remove } = useFieldArray({ name: "rules", control });

    useEffect(() => {
        // retrieve all the policies from the endpoint
        // and set the state to the policies
        request.get(`policies/${params.name}`)
        .then((response) => {   
            setPolicy({
                name: response.data.name,
                rules: extract_properties_from_rules(response.data.rules),
            });
        }).catch((error) => {
            console.log(error);
        }
        )
    }, [])

    return (
        <>
            <Heading as="h2">Update Policy - { policy.name }</Heading>        
            { policy.rules.map((rule) => JSON.stringify(rule)) }    
        </>
    )
}

export default UpdatePolicy;