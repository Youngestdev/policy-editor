const cleanStrings = (string) => {
  string = string.split(",").map((value) => {
    return value.trim();
  });
  return string;
};

const convert = (rules) => {
  const result = [];
  let commands = [];

  rules.forEach((rule) => {
    for (const val in rule) {
      if (!val.startsWith("data")) {
        let new_command = {
          command: "input_prop_equals",
          properties: {
            input_property: val,
            value: rule[val]
          }
        };
        commands.push(new_command);
      }
    }
    const filtered = Object.fromEntries(
      Object.entries(rule).filter(([key]) => key.includes("data"))
    );

    if (rule["datasource_name"]) {
      let blank = {
        command: "input_prop_in_as",
        properties: filtered
      };
      commands.push(blank);
    }
    result.push(commands);
  });
  return result;
};

export const cleanRulesData = (rules) => {
  rules.forEach((data) => {
    Object.keys(data).forEach((key) => {
      if (data[key] === "") {
        delete data[key];
      }
    });

    if ("datasource_name" in data) {
      data.data_input_properties = cleanStrings(data.data_input_properties);
      data.datasource_loop_variables = cleanStrings(
        data.datasource_loop_variables
      );
    }
    if (data.request_path) {
      data.request_path = data.request_path.split("/");
    }
  });
  const conv = convert(rules);
  return conv;
};
