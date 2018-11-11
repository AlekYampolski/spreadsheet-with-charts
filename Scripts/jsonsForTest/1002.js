var data1002 = {
  id: 1001,
  label: "Descriptive Statistics",
  isenabled: true,
  visibility: true,
  description:
    "Descriptive statistics command displays univariate summary statistics for selected variables.",
  version: "1",
  window: {
    nodename: "window",
    label: "Descriptive Statistics",
    description:
      "Descriptive statistics command displays univariate summary statistics for selected variables.",
    items: [
      {
        nodename: "VarRange",
        label: "Variables",
        description: "Select variable(s) for analysis.",
        required: true,
        multi: true
      }
    ]
  }
};
dataInputWindow = data1002;