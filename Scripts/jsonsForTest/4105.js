var data4105 = {
  id: 4105,
  label: "P Chart",
  isenabled: true,
  visibility: true,
  version: "1",
  advancedwindow: {
    nodename: "advancedwindow",
    label: "P Chart",
    items: [
      {
        nodename: "number",
        name: "Control limits at these multiples of standard deviations",
        value: 3.0
      },
      {
        nodename: "number",
        name: "Target proportion [leave 0 to estimate]",
        value: 0.0
      }
    ]
  },
  window: {
    nodename: "window",
    label: "P Chart",
    description:
      "P chart is used to monitor the proportion of defectives in a process.",
    items: [
      {
        nodename: "VarRange",
        label: "Measurements",
        description: "Variable with measurements.",
        required: true,
        multi: false
      },
      {
        nodename: "VarRange",
        label: "Subgroup Sizes",
        description:
          "Variable with subgroup sizes (or enter single number for equal subgroup sizes)",
        required: true,
        multi: false,
        constsubstitute: true,
        minrows: 1
      }
    ]
  }
};
