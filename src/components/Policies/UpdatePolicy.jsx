import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import request from "../../utils/request";

const UpdatePolicy = () => {
    const [policy, setPolicy] = useState({});
    let params = useParams()

    useEffect(() => {
        // retrieve all the policies from the endpoint
        // and set the state to the policies
        request.get(`policies/${params.name}`)
        .then((response) => {
            console.log(response.data);
            setPolicy(response.data);
        }).catch((error) => {
            console.log(error);
        }
        )
    }, [])
}

export default UpdatePolicy;