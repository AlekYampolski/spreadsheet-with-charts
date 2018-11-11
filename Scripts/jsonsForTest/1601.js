var data1601 = {
  id: 1601,
  label: "Probit Analysis",
  isenabled: true,
  visibility: true,
  description:
    "Probit Analysis is a method of analyzing the relationship between a stimulus and the binomial response. The command runs probit regression and calculates dose-response percentiles, such as LD50 (ED50), LD16, LD84.",
  version: "1",
  advancedwindow: {
    nodename: "advancedwindow",
    label: "Probit Analysis",
    items: [
      {
        nodename: "list",
        name: "Show results for",
        value: "log(Dose)\nDose\nBoth"
      },
      {
        nodename: "checkbox",
        name: "Plot Probit-Dose instead of Percent-Dose",
        value: false
      },
      {
        nodename: "list",
        name: "Correction for 0%/100% effect (Finney)",
        value: "25%/N\n49%/N"
      }
    ]
  },
  window: {
    nodename: "window",
    label: "Probit Analysis",
    description:
      "Probit Analysis is a method of analyzing the relationship between a stimulus and the binomial response. The command runs probit regression and calculates dose-response percentiles, such as LD50 (ED50), LD16, LD84.",
    writenan: true,
    items: [
      {
        nodename: "VarRange",
        label: "Stimulus (Dose)",
        description:
          "Variable with dose values or stimulus levels. Zero values must not be used with log(Dose) transformation.",
        required: true,
        multi: false
      },
      {
        nodename: "VarRange",
        label: "Effect (Count)",
        description:
          "Response variable containing the number of subjects with the desired response. Values must be less than the corresponding group size.",
        required: true,
        multi: false
      },
      {
        nodename: "VarRange",
        label: "Group Size",
        description:
          "Variable containing sample size or number of trials at each stimulus level.",
        required: true,
        multi: false
      },
      {
        nodename: "VarRange",
        label: "Stimulus (Dose) #N",
        description: "For estimation of the cumulative action. Optional.",
        required: false,
        multi: false
      },
      {
        nodename: "VarRange",
        label: "Effect (Count) #N",
        description: "For estimation of the cumulative action. Optional.",
        required: false,
        multi: false
      },
      {
        nodename: "VarRange",
        label: "Group Size #N",
        description: "For estimation of the cumulative action. Optional.",
        required: false,
        multi: false
      }
    ]
  }
};
