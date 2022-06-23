import {
  Box,
  Button,
  Center,
  Checkbox,
  Divider,
  FormControl,
  FormHelperText,
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

  const [loading, setLoading] = useState(false)
  const { control, handleSubmit, register, watch } = useForm();
  const { fields, append, remove } = useFieldArray({ name: "rules", control });
  let navigate = useNavigate();
  const toast = useToast();

  const numOfRules = watch("numOfRules");

  useUpdateEffect(() => {
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
          data_input_properties: ""
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
      rules: convert(formData.rules)
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
            <Heading as="h3"> Add Rules </Heading>
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
              <section key={index}>
                <Heading as="h6"> Rule {index + 1} </Heading>
                <br />
                <FormControl>
                  <FormLabel htmlFor="request_path">Request Path</FormLabel>
                  <Input 
                    name={`rules[${index}]request_path`}
                    key={rule.id}
                    placeholder="v1/collections/obs"
                    {...register(`rules.${index}.request_path`)}
                  />
                  {/* <Checkbox {...register(`rules.${index}.split_path`)}>
                    {" "}
                    Split request path{" "}
                  </Checkbox> */}
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
                {/* <FormControl>
                  <FormLabel htmlFor="full_access">Allow full access</FormLabel>
                  <Input 
                    name={`rules[${index}]full_access`}
                    key={rule.id}
                    placeholder="groupname"
                    {...register(`rules.${index}.groupname`)}
                  />
                </FormControl> */}
                <br />
                <Heading as="h4">Create local variables</Heading>
                <Divider />
                <br />
                <FormControl>
                  <FormLabel htmlFor="datasource_name">
                    Datasource name
                  </FormLabel>
                  <Input 
                    name={`rules[${index}]datasource_name`}
                    key={rule.id}
                    placeholder="items"
                    {...register(`rules.${index}.datasource_name`)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="datasource_loop_variables">
                    Datasource variables
                  </FormLabel>
                  <Input 
                    name={`rules[${index}]datasource_loop_variables`}
                    key={rule.id}
                    placeholder="username, company"
                    {...register(`rules.${index}.datasource_loop_variables`)}
                  />
                  <FormHelperText>
                    {" "}
                    Seperate variables with a comma (,){" "}
                  </FormHelperText>
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="data_input_properties">
                    Datasource variable properties
                  </FormLabel>
                  <Input 
                    name={`rules[${index}]data_input_properties`}
                    key={rule.id}
                    placeholder="youngestdev, geobeyond"
                    {...register(`rules.${index}.data_input_properties`)}
                  />
                  <FormHelperText>
                    {" "}
                    Seperate properties with a comma (,){" "}
                  </FormHelperText>
                </FormControl>
              </section>
            ))}
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
