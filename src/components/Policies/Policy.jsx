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
          name: response.data.name,
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
  }, [loading]);

  const columns = useMemo(
    () => [
      {
        Header: "Property",
        accessor: "input_property"
      },
      {
        Header: "Value",
        accessor: "value"
      }
    ],
    []
  );

  const dataColumns = useMemo(
    () => [
      {
        Header: "Loop variables",
        accessor: "datasource_loop_variables"
      },
      {
        Header: "Value",
        accessor: "data_input_properties"
      }
    ],
    []
  );

  if (loading) {
    return (
      <Stack p={"8"}>
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
      </Stack>
    );
  } else {
    return (
      <Stack p={"8"}>
        <Heading as="h2"> {capitalizeFirst(policy.name)} </Heading>
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
