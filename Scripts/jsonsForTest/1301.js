var data1301 = {
  id: 1301,
  label: "Multiple Linear Regression",
  isenabled: true,
  visibility: true,
  description:
    "The Multiple Linear Regression command performs simple multiple regression using least squares.",
  version: "1",
  advancedwindow: {
    nodename: "advancedwindow",
    label: "Linear Regression",
    items: [
      { nodename: "checkbox", name: "No intercept model", value: false },
      { nodename: "checkbox", name: "Plot residuals vs. fitted", value: false },
      {
        nodename: "checkbox",
        name: "Plot residuals vs. order",
        value: false,
        indent: 1
      },
      {
        nodename: "checkbox",
        name: "Plot line fit (univariate only)",
        value: false,
        indent: 1
      },
      {
        nodename: "checkbox",
        name: "Plot residuals vs. predictors",
        value: false,
        indent: 1
      },
      {
        nodename: "checkbox",
        name: "Emulate Excel ATP for standard residuals",
        value: false
      },
      { nodename: "checkbox", name: "Report residuals", value: true }
    ]
  },
  window: {
    nodename: "window",
    label: "Linear Regression",
    description:
      "The Multiple Linear Regression command performs simple multiple regression using least squares.",
    writenan: true,
    items: [
      
      {
        nodename: "VarRange",
        label: "Independent variables",
        description: "Select the independent (predictor) variables.",
        required: true,
        multi: true
      },
      {
        nodename: "VarRange",
        label: "Independent variables",
        description: "Select the independent (predictor) variables.",
        required: true,
        multi: true
      },
      {
        nodename: "VarRange",
        label: "Dependent variable",
        description:
          "Select the dependent variable. Also known as a response or predicted variable.",
        required: true,
        multi: false
      }
    ]
  }
};
