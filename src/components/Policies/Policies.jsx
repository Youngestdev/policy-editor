import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Button, Link, Stack} from "@chakra-ui/react";
import { useContext, useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { AuthContext } from "../../index";
import request from "../../utils/request";
import RenderTable from "../Table/RenderTable";

const Policies = () => {
    const { state, dispatch } = useContext(AuthContext);

  // redirect to login if isLoggedIn is false
    if (!state.isLoggedIn) {
        return <Navigate to="/login" />;
    }

    const [ policies, setPolicies ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    let navigate = useNavigate();

    const columns = useMemo(() => [
        {
            Header: "Policy name",
            accessor: "name",
            Cell: (props) => {
                return (
                    <Link href={`policy/${props.value}`}>
                        {props.value} <ExternalLinkIcon mx='2px' />
                    </Link>
                )
            }
        },
        {
            Header: "Owner  ",
            accessor: "owner"            
        }
    ], []);

    const deletePolicy = () => {
        request.delete(`/policies/${name}`).then(res => {
          toast({
            title: "Policy deleted",
            description: "Policy deleted successfully",
            status: "success",
            duration: 9000,
            isClosable: true
          });
          navigate("/policies");      
        }
        );
      }

    useEffect(() => {
        document.title = "Policies - Policy Editor";
        const fetchData = () => {
            request
                .get("/policies")
                .then((response) => {
                    setPolicies(response.data);
                    setLoading(false);
                }
                );
        }
        fetchData();
    }, []);    
    return (
        <Stack p={"12"}>
            <Button onClick={() => navigate("/policy/new")}> Create Policy </Button>
            <RenderTable columns={columns} data={policies}/>            
        </Stack>   
   )}

export default Policies;