import { Divider, Heading, Skeleton, Stack } from "@chakra-ui/react";
import { memo, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import request from "../../utils/request";
import RenderTable from "../Table/RenderTable";

// TODO: Split value of values.

const Policy = () => {
  const [policy, setPolicy] = useState({
    name: "",
    rules: []
  });
  const [loading, setLoading] = useState(true);

  let params = useParams();
  let ruleProperties = useMemo(() => [], []);
  let dataSourceProperties = useMemo(() => [], []);

  const capitalizeFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const retrievePolicy = () => {
    request
      .get(`policies/${params.name}`)
      .then((response) => {
        setPolicy({
          name: capitalizeFirst(response.data.name),
          rules: response.data.rules
        });

        policy.rules.map((rule) => {
          let temp = [];
          for (let prop in rule) {
            temp.push(rule[prop]["properties"]);
          }

          ruleProperties.push(temp);
        });

        ruleProperties.forEach((rule) => {
          rule.forEach((r) => {
            if ("datasource_name" in r) {
              dataSourceProperties.push([r]);
            }
          });
        });
        setLoading(false);
      })
      .catch((error) => {
        return error;
      });
  };

  useEffect(() => {
    retrievePolicy();
    document.title = `${policy.name} - Policy Editor`;
  }, [loading]);

  const columns = useMemo(
    () => [
      {
        Header: "Property",
        accessor: "input_property",
        width: "50%",
        Cell: (props) => {
          if (typeof props.value !== "undefined") {
            let value = props.value.replace("_", " ");
            return capitalizeFirst(value);
          }
        }
      },
      {
        Header: "Value",
        accessor: "value",
        width: "50%",
        Cell: (props) => {
          return typeof props.value === "object"
            ? props.value.join(", ")
            : props.value;
        }
      }
    ],
    []
  );

  const dataColumns = useMemo(
    () => [
      {
        Header: "Loop variables",
        accessor: "datasource_loop_variables",
        width: "50%",
        Cell: (props) => {
          return typeof props.value === "object"
            ? props.value.join(", ")
            : props.value;
        }
      },
      {
        Header: "Value",
        accessor: "data_input_properties",
        width: "50%",
        Cell: (props) => {
          return typeof props.value === "object"
            ? props.value.join(", ")
            : props.value;
        }
      }
    ],
    []
  );

  if (loading) {
    return (
      <Stack p={"8"}>
        <Skeleton height="40px" />
        <Skeleton height="40px" />
        <Skeleton height="40px" />
      </Stack>
    );
  } else {
    return (
      <Stack p={"12"}>
        <Heading as="h2"> {policy.name} </Heading>
        <Divider />

        {ruleProperties.map((d, idx) => (
          <>
            <br />
            <Heading as="h4" size="md">
              Rule {idx + 1}
            </Heading>
            <RenderTable key={idx} columns={columns} data={d} />
          </>
        ))}

        {dataSourceProperties.map((data, idx) => (
          <>
            <br />
            <Heading as="h4" size="md">
              Data source propety {idx + 1}
            </Heading>
            <RenderTable key={idx} columns={dataColumns} data={data} />
          </>
        ))}
      </Stack>
    );
  }
};

export default memo(Policy);
