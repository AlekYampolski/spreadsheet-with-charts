var data1002 = {
    "id": 1002,
    "label": "Descriptive Statistics (use group variable)",
    "isenabled": true,
    "visibility": true,
    "description": "The procedure produces summary statistics separately for each sub-group defined by the group variable.",
    "advancedwindow": {
            "nodename": "advancedwindow",
            "label": "Descriptive Statistics",
            "items": [
                {
                    "nodename": "checkbox",
                    "name": "Plot histogram",
                    "value": false
                },
                {
                    "nodename": "checkbox",
                    "name": "Overlay histogram with normal curve",
                    "value": true,
                    "indent": 1
                },
                {
                    "nodename": "numberint",
                    "name": "Number of intervals [Leave 0 for auto]",
                    "value": 21,
                    "indent": 1
                },
                {
                    "nodename": "list",
                    "name": "Percentiles definition",
                    "value": "1. Inverse of EDF (SAS-3)\n2. EDF with averaging (SAS-5)\n3. Observation closest to N*p (SAS-2)\n4. Interpolation of EDF (SAS-1)\n5. Piecewise linear interpolation of EDF",
                    "valueex": 3
                },
                {
                    "nodename": "list",
                    "name": "Report",
                    "value": "For each variable\nSingle table",
                    "valueex": 1
                }
            ]
        },
        "window" :{
            "nodename": "window",
            "label": "Descriptive Statistics",
            "description": "Descriptive statistics command displays univariate summary statistics for selected variables.",
            "writenan": true,
            "items": [
                {
                    "nodename": "VarRange",
                    "label": "Variable",
                    "description": "Select the variable for analysis.",
                    "required": true,
                    "multi": true
                },
                {
                    "nodename": "VarRange",
                    "label": "Variable",
                    "description": "Select the variable for analysis.",
                    "required": true,
                    "multi": true
                },
           
            
                {
                    "nodename": "VarRangeText",
                    "label": "Groups",
                    "description": "Break variable (layer) distinct values will cause separate tables to be generated.",
                    "required": true,
                    "multi": false
                }
            ]
        }
}