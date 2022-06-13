export const convert = (rules) => {
  let result = [];

  rules.map((rule, idx) => {
    let commands = [];
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

    for (let val in rule) {
      let new_command = {}
      if (!val.startsWith("data")) {
        new_command["command"] = "input_prop_equals"
        new_command["properties"] = {
          input_property: val,
          value: rule[val]
        }
      }
      if (Object.keys(new_command).length !== 0) {
        commands.push(new_command)
      }
    };


    result.push(commands)
  })

  return result
};

export const extract_properties_from_rules = rules => {
  let result = []
  rules.map((rule) => {
    let temp = [];
    for (let prop in rule) {
      temp.push(rule[prop]["properties"])
    }

    result.push(temp)
  })
  return result;
}