import {
  Box,
  Button,
  Center,
  Checkbox,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Select,
  Spinner,
  Stack,
  useToast
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";

import { useUpdateEffect } from "../../utils/hooks";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { convert } from "../../utils/form";
import request from "../../utils/request";

import { AuthContext } from "../../index";

const PolicyForm = () => {
  const { state, dispatch } = useContext(AuthContext);

  // redirect to login if isLoggedIn is false
  if (!state.isLoggedIn) {
    return <Navigate to="/login" />;
  }

  const [loading, setLoading] = useState(false);
  const [repos, setRepos] = useState([]);
  const [data, setData] = useState({
    name: "",
    data: []
  });

  const { control, handleSubmit, register, watch } = useForm();
  const { fields, append, remove } = useFieldArray({ name: "rules", control });
  let navigate = useNavigate();
  const toast = useToast();

  const numOfRules = watch("numOfRules");

  useUpdateEffect(() => {
    window.scrollTo(0, 0);
    const gitProvider = localStorage.getItem("provider");

    // retrieve the repo list from /user/repo and store them in a repos array state.
    
    // if the git provider retrieved from localstorage is gitlab, retrieve the repos from /user/repos/gitlab

    if (gitProvider === "gitlab") {
      request
        .get("/user/repos/gitlab")
        .then((response) => {
          setRepos(response.data);
        })
        .catch((err) => {
          console.log(err);
      })
    } else {
      // if the git provider retrieved from localstorage is github, retrieve the repos from /user/repos/github
      request
        .get("/user/repos/github")
        .then((response) => {
          setRepos(response.data);
        })
        .catch((err) => {
          console.log(err);
      })

      request
        .get("/data")
        .then((response) => {
          let name = Object.keys(response.data)[0];
          let data = Object.values(response.data)[0][0];
          setData({ name, data });
        }
        )
        .catch((err) => {
          console.log(err);
        }
      );

    }
    // handle number of rules.

    const newVal = parseInt(numOfRules || 0);
    const oldVal = fields.length;

    if (newVal > oldVal) {
      for (let idx = oldVal; idx < newVal; idx++) {
        append({
          request_path: "",
          company: "",
          request_method: "",
          datasource_name: "",
          datasource_loop_variables: "",
          data_input_properties: "",
          allow_access: ""
        });
      }
    } else {
      for (let idx = oldVal; idx > newVal; idx--) {
        remove(idx - 1);
      }
    }
  }, [numOfRules, loading]);

  const onSubmit = (formData) => {
    setLoading(true);
    const requestBody = {
      name: formData.name,
      rules: convert(formData.rules),
      repo_url: formData.repo
    };
    
    // Add spinner to replace idle state after button click
    request
      .post("policies/", requestBody)
      .then((response) => {
        navigate(`/policy/${formData.name}`);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status == 409) {
          toast({
            title: 'Policy exists.',
            description: "You already have a policy with this name.",
            status: 'error',
            duration: 9000,
            isClosable: true,
          })``
        }
      });
  };

  return loading ?
  <Center>  
     <Spinner size='xl' /> 
  </Center> 
     :      
   (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box p={8}>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel htmlFor="name">Policy name</FormLabel>
              <Input
                placeholder="auth"
                {...register("name", { required: true })}
              />
            </FormControl>
            <Divider />
            <Heading as="h3" size="md"> Add Rules </Heading>
            <Divider />
            <Select
              name="numOfRules"
              placeholder="How many rules will you like to add?"
              {...register("numOfRules")}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <option key={i} value={i}>
                  {i}{" "}
                </option>
              ))}
            </Select>
            {fields.map((rule, index) => (
              <Stack spacing={4} key={index}>
                <Heading as="h4" size="sm"> Rule {index + 1} </Heading>
                <br />
                <FormControl>
                  <FormLabel htmlFor="request_path">Request Path</FormLabel>
                  <Input 
                    name={`rules[${index}]request_path`}
                    key={rule.id}
                    placeholder="v1/collections/obs"
                    {...register(`rules.${index}.request_path`)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="company">Company</FormLabel>
                  <Input 
                    name={`rules[${index}]company`}
                    key={rule.id}
                    placeholder="geobeyond"
                    {...register(`rules.${index}.company`)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="request_method">Request method</FormLabel>
                  <RadioGroup>
                    <Stack spacing="2">
                      <Radio
                        value="POST"
                        {...register(`rules.${index}.request_method`)}
                      >
                        {" "}
                        POST{" "}
                      </Radio>
                      <Radio
                        value="GET"
                        {...register(`rules.${index}.request_method`)}
                      >
                        {" "}
                        GET{" "}
                      </Radio>
                      <Radio
                        value="UPDATE"
                        {...register(`rules.${index}.request_method`)}
                      >
                        {" "}
                        UPDATE{" "}
                      </Radio>
                      <Radio
                        value="DELETE"
                        {...register(`rules.${index}.request_method`)}
                      >
                        {" "}
                        DELETE{" "}
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>
                <br />
                <FormControl>
                  <FormLabel htmlFor="datasource_name">
                    Datasource variables
                  </FormLabel>
                  <Select
                    name="datasource_name"
                    placeholder="Select a datasource"
                    {...register("datasource_name")}
                  >         
                           {/* When we have database results with multiple names, this will be modified.  */}
                      <option value={data.name}>
                        {data.name}{" "}
                      </option>
                   </Select>
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="datasource_loop_variables">
                    Datasource variables
                  </FormLabel>
                  <Select
                    name="datasource_loop_variables"
                    placeholder="Select a datasource"
                    {...register("datasource_loop_variables")}
                  >         
                           {/* When we have thought of managing all that queries, i'll fix this.  */}
                      <option value={data.name}>
                        {Object.values(data.data).join(", ")}{" "}
                      </option>
                   </Select>
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="full_access">Allow full access</FormLabel>
                  <Select
                    name="allow_full_access"
                    placeholder="Select "
                    {...register("allow_full_access")}
                  >
                      <option value={data.data.groupname}>
                        {data.data.groupname}{" "}
                      </option>
                   </Select>
                </FormControl>              
              </Stack>            
            ))}
              <Divider />
              <Heading as="h4"> Save to repository: </Heading>
              <Select
              name="repo"
              placeholder="Select a repo to store policy"
              {...register("repo")}
            >
              {repos.map((name, idx) => (
                <option key={idx} value={name.html_url}>
                  {name.name}{" "}
                </option>
              ))}
            </Select>
              <Divider />
            <FormControl>
              <Button mt={4} colorScheme="teal" type="submit">
                Create policy
              </Button>
            </FormControl>
          </Stack>
        </Box>
      </form>
    </>
  );
};

export default PolicyForm;
