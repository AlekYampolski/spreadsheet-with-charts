var data10052 = {
  id: 10052,
  label: "Compare Means (use summarized data)",
  isenabled: true,
  visibility: true,
  description:
    "The procedure compares the means of two variables with two-sample t-test, Pagurova and G criteria.",
  version: "1",
  window: {
    nodename: "window",
    label: "Compare Means",
    description:
      "The procedure compares the means of two variables with two-sample t-test, Pagurova and G criteria.",
    items: [
      {
        nodename: "Cell",
        label: "Variable #1 - Sample size",
        required: true,
        multi: false,
        numeric : true
      },
      {
        nodename: "Cell",
        label: "Variable #1 - Mean",
        required: true,
        multi: false,
        numeric : true
      },
      {
        nodename: "Cell",
        label: "Variable #1 - Standard Deviation",
        required: true,
        multi: false
      },
      {
        nodename: "Cell",
        label: "Variable #2 - Sample size",
        required: true,
        multi: false
      },
      {
        nodename: "Cell",
        label: "Variable #2 - Mean",
        required: true,
        multi: false
      },
      {
        nodename: "Cell",
        label: "Variable #2 - Standard Deviation",
        required: true,
        multi: false
      }
    ]
  },
  advancedwindow: {
    nodename: "advancedwindow",
    label: "Compare Means",
    items: [
      {
        nodename: "list",
        name: "T-Test Type",
        value: "sta.bst.compmeans.0\nsta.bst.compmeans.1",
        valueex: 0
      },
      { nodename: "number", name: "Hypothesized Mean Difference", value: 0 }
    ]
  }
};
