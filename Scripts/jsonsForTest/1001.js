var data1001 = {
  id: 1001,
  label: "Descriptive Statistics",
  isenabled: true,
  visibility: true,
  description:
    "Descriptive statistics command displays univariate summary statistics for selected variables.",
  version: "1",
  advancedwindow: {
    nodename: "advancedwindow",
    label: "Descriptive Statistics",
    items: [
      { nodename: "checkbox", name: "Plot histogram", value: false },
      {
        nodename: "checkbox",
        name: "Overlay histogram with normal curve",
        value: true,
        indent: 1,
        platformdisabled: false
      },
      {
        nodename: "numberint",
        name: "Number of intervals [Leave 0 for auto]",
        value: 5656,
        indent: 1
      },
      {
        nodename: "list",
        name: "Percentiles definition",
        value:
          "1. Inverse of EDF (SAS-3)\n2. EDF with averaging (SAS-5)\n3. Observation closest to N*p (SAS-2)\n4. Interpolation of EDF (SAS-1)\n5. Piecewise linear interpolation of EDF (midway values as knots)\n6. Interpolation of the expectations for the order statistics (SPSS,NIST)\n7. Interpolation of the modes for the order statistics (Excel)\n8. Interpolation of the approximate medians for order statistics\n9. Blom's unbiased approximation",
        valueex: 6
      },
      {
        nodename: "list",
        name: "Report",
        value: "For each variable\nSingle table",
        valueex: 0
      }
    ]
  },
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
        multi: false
      },  {
        nodename: "VarRange",
        label: "Variables",
        description: "Select variable(s) for analysis.",
        required: true,
        multi: true
      }
    ]
  }
};
