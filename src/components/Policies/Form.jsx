import {
  Box,
  Button,
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
  Stack
} from "@chakra-ui/react";
import { useUpdateEffect } from "../../utils/hooks";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { cleanRulesData } from "../../utils/form";
import request from "../../utils/request";

const PolicyForm = () => {
  const { control, handleSubmit, register, watch } = useForm();
  const { fields, append, remove } = useFieldArray({ name: "rules", control });
  let navigate = useNavigate();

  const numOfRules = watch("numOfRules");

  useUpdateEffect(() => {
    const newVal = parseInt(numOfRules || 0, 10);
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
  }, [numOfRules]);

  const onSubmit = (formData) => {
    const cleanedRrules = cleanRulesData(formData.rules);
    const requestBody = {
      name: formData.name,
      rules: cleanedRrules
    };

    request
      .post("policies", requestBody)
      .then((response) => {
        navigate(`/${formData.name}`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
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
                    placeholder="items"
                    {...register(`rules.${index}.datasource_name`)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="datasource_loop_variables">
                    Datasource variables
                  </FormLabel>
                  <Input
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
