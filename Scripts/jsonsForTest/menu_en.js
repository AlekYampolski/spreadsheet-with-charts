// var menuJSON = {
//     "items": [
//         {
//             "label": "Basic Statistics",
//             "short": "Basic",
//             "icon": "toolbar_icon_1000",
//             "items": [
//                 {
//                     "id": 1001,
//                     "label": "Descriptive Statistics...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "Descriptive statistics command displays univariate summary statistics for selected variables."
//                 },
//                 {
//                     "id": 1002,
//                     "label": "Descriptive Statistics (use group variable)...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "The procedure produces summary statistics separately for each sub-group defined by the group variable."
//                 },
//                 {
//                     "id": 1003,
//                     "label": "One-Sample T-Test...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "The one-sample t-test compares the mean of a normally distributed variable with a hypothesized value (fixed estimate)."
//                 },
//                 {
//                     "id": 1004,
//                     "label": "One-Sample z-Test for Mean...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "The one-sample z-test is used when we want to know whether the difference between a sample mean and the population mean is large enough to be statistically significant, that is, if it is unlikely to have occurred by chance."
//                 },
//                 {
//                     "id": 1005,
//                     "label": "Compare Means [T-Test]...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "The procedure compares the means of two variables with two-sample t-test, Pagurova and G criteria."
//                 },
//                 {
//                     "id": 10052,
//                     "label": "Compare Means (use summarized data)...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "The procedure compares the means of two variables with two-sample t-test, Pagurova and G criteria."
//                 },
//                 {
//                     "id": 1007,
//                     "label": "Two-Sample z-Test for Means...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "The two-sample z-test is used to compare the means of two samples to see if it is feasible that they come from the same population."
//                 },
//                 {
//                     "id": 1008,
//                     "label": "F-Test for Variances...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "The two-sample F-test is used to test for differences among sample variance. The null hypothesis is that the variances for the two samples are equal."
//                 },
//                 {
//                     "id": 1009,
//                     "label": "Linear Correlation [Pearson]...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "The Linear Correlation (Pearson) command calculates the Pearson product moment correlation coefficient between each pair of variables. Pearson correlation coefficient measures the strength of the linear association between variables."
//                 },
//                 {
//                     "id": 1010,
//                     "label": "Covariance...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "The covariance command calculates the covariance between all pairs of variables."
//                 },
//                 {
//                     "id": 1011,
//                     "label": "Normality Tests...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "Normality Tests command performs hypothesis tests to examine whether the observations follow a normal distribution."
//                 },
//                 {
//                     "label": "-"
//                 },
//                 {
//                     "id": 1012,
//                     "label": "Frequency Tables (discrete data)...",
//                     "isenabled": true,
//                     "visibility": true
//                 },
//                 {
//                     "id": 1013,
//                     "label": "Frequency Tables (continuous data)...",
//                     "isenabled": true,
//                     "visibility": true
//                 },
//                 {
//                     "id": 1014,
//                     "label": "Cross Tabulation and Chi-Square...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "Cross Tabulation command displays the joint distribution of two or more variables in a matrix format and allows to compare the relationship between the variables. Cross tabulation table (contingency table) and chi-square test results are produced for each distinct value of break variable (optional)."
//                 },
//                 {
//                     "label": "-"
//                 },
//                 {
//                     "id": 1015,
//                     "label": "Histogram...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "The command produces a histogram for each input variable. To plot a histogram for categorical variables use the Frequency tables (discrete data) command. To specify bin locations from keyboard  (without a bins variables) use the Frequency tables (continuous data) command."
//                 }
//             ]
//         },
//         {
//             "label": "Analysis of Variance (ANOVA)",
//             "short": "ANOVA",
//             "icon": "toolbar_icon_1100",
//             "items": [
//                 {
//                     "id": 1102,
//                     "label": "One-way ANOVA (unstacked)...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "The One-way ANOVA procedure compares means between two or more groups."
//                 },
//                 {
//                     "id": 1103,
//                     "label": "One-way ANOVA (use group variable)...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "The One-way ANOVA procedure compares means between two or more groups."
//                 },
//                 {
//                     "id": 1104,
//                     "label": "Two-way ANOVA...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "The Two-way ANOVA, also called two-factor ANOVA, determines how a response is affected by two factors.  A two-way ANOVA may be done with replication (more than one observation for each combination of the factors) or without replication (only one observation for each combination of the factors)."
//                 },
//                 {
//                     "id": 1105,
//                     "label": "Three-way ANOVA...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "The Three-way ANOVA, also called three-factor ANOVA, determines how a response is affected by three factors."
//                 },
//                 {
//                     "id": 1108,
//                     "label": "Repeated Measures (Within Subjects) ANOVA...",
//                     "isenabled": true,
//                     "visibility": true
//                 },
//                 {
//                     "id": 1106,
//                     "label": "Mixed Treatment by Subjects ANOVA...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "The command performs two-factor mixed-design ANOVA with 1 between-subjects factor and 1 within-subjects factor."
//                 },
//                 {
//                     "id": 1107,
//                     "label": "Mixed ANOVA with Two Treatments...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "The command performs mixed-design ANOVA with two between-subjects factors and one within-subjects factor. All groups are assumed to be of the same size."
//                 },
//                 {
//                     "label": "-"
//                 },
//                 {
//                     "id": 1109,
//                     "label": "General Linear Model (GLM)...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "Use General Linear Model (GLM) to perform univariate analysis of variance with balanced and unbalanced designs, analysis of covariance, and regression, for each response variable. Calculations are done using a regression approach."
//                 },
//                 {
//                     "label": "-"
//                 },
//                 {
//                     "id": 1110,
//                     "label": "Discriminant Function Analysis...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "Discriminant function is used to determine which variables discriminate between naturally occurring groups."
//                 },
//                 {
//                     "label": "Design of Experiments",
//                     "items": [
//                         {
//                             "label": "Latin Squares Analysis Plans:",
//                             "isenabled": false,
//                             "visibility": true
//                         },
//                         {
//                             "id": 1201,
//                             "label": "1: Three Factors (A, B, C) With No Interactions...",
//                             "isenabled": true,
//                             "visibility": true
//                         },
//                         {
//                             "id": 1202,
//                             "label": "2: Four Factors (A, B, C, D) With Partial Interactions...",
//                             "isenabled": true,
//                             "visibility": true
//                         },
//                         {
//                             "id": 1203,
//                             "label": "3: Four Factors (A, B, C, D) With Partial Confounding Of AxBxC Interaction...",
//                             "isenabled": true,
//                             "visibility": true
//                         },
//                         {
//                             "id": 1204,
//                             "label": "4: Greco-Latin With No Interactions...",
//                             "isenabled": true,
//                             "visibility": true
//                         },
//                         {
//                             "id": 1205,
//                             "label": "5: Repeated Measures Latin Square (Random Assignment Of Groups To Rows)...",
//                             "isenabled": true,
//                             "visibility": true
//                         },
//                         {
//                             "id": 1206,
//                             "label": "6: Fractional Replication Of A Three-Factor Factorial Experiment In Incomplete Blocks...",
//                             "isenabled": true,
//                             "visibility": true
//                         },
//                         {
//                             "id": 1207,
//                             "label": "7: Plan 5 With Superimposing An Orthogonal Latin Square...",
//                             "isenabled": true,
//                             "visibility": true
//                         },
//                         {
//                             "id": 1208,
//                             "label": "8: AxBxC (Same Squares Used For All Levels Of Factor C)...",
//                             "isenabled": true,
//                             "visibility": true
//                         }
//                     ]
//                 }
//             ]
//         },
//         {
//             "label": "Regression",
//             "short": "Regression",
//             "icon": "toolbar_icon_1300",
//             "items": [
//                 {
//                     "id": 1301,
//                     "label": "Multiple Linear Regression...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "The Multiple Linear Regression command performs simple multiple regression using least squares."
//                 },
//                 {
//                     "id": 1302,
//                     "label": "Weighted Least Squares Regression...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "Weighted least squares regression uses different weights for observations when estimating the regression model."
//                 },
//                 {
//                     "id": 1303,
//                     "label": "Polynomial Regression...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "This procedure performs regression with linear and polynomial (second or higher order) terms of a single predictor variable and plots a regression curve through the data."
//                 },
//                 {
//                     "id": 1304,
//                     "label": "Forward Stepwise...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "Forward selection regression is a stepwise regression approach that starts from the null model and adds a variable that improves the model the most, one at a time, until the stopping criterion is met."
//                 },
//                 {
//                     "id": 1305,
//                     "label": "Backward Stepwise...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "Backward stepwise regression is a stepwise regression approach that begins with a full (saturated) model and at each step gradually eliminates variables from the regression model to find a reduced model that best explains the data. Also known as Backward Elimination regression."
//                 },
//                 {
//                     "id": 1307,
//                     "label": "Best Subsets Regression...",
//                     "isenabled": true,
//                     "visibility": true
//                 },
//                 {
//                     "label": "-"
//                 },
//                 {
//                     "id": 1306,
//                     "label": "Binary Logistic...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "The binary logistic regression is used to model the relationship between a binary response variable and one or more explanatory variables that may be continuous or categorical"
//                 },
//                 {
//                     "id": 1309,
//                     "label": "Cox Regression...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "The Cox proportional-hazards regression analyzes the effect of several risk factors on survival."
//                 }
//             ]
//         },
//         {
//             "label": "Nonparametric Statistics",
//             "short": "Nonparametric",
//             "icon": "toolbar_icon_1400",
//             "items": [
//                 {
//                     "id": 1403,
//                     "label": "Rank and Percentile...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "The Rank and Percentile command calculates ranks and percentiles for input variable observations."
//                 },
//                 {
//                     "id": 1404,
//                     "label": "Rank Correlations [Spearman R, Kendall Tau, Gamma]...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "This procedure computes three different alternatives to the parametric Pearson product-moment correlation coefficient: Spearman rank R, Kendall Tau, and Gamma."
//                 },
//                 {
//                     "id": 1405,
//                     "label": "Fechner Correlation...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "The Fechner Correlation command calculates the Fechner signs correlation coefficient between all the pairs of variables."
//                 },
//                 {
//                     "label": "-"
//                 },
//                 {
//                     "id": 1401,
//                     "label": "2x2 Tables Analysis (tabulated data)...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "This procedure computes various statistics for a 2-by-2 table: chi-square, Yates-corrected chi-square, the Fisher Exact Test, Phi-square, the McNemar Change Test, and also indices relevant to various special kinds of 2-by-2 tables."
//                 },
//                 {
//                     "id": 1014,
//                     "label": "Cross Tabulation and Chi-Square...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "Cross Tabulation command displays the joint distribution of two or more variables in a matrix format and allows to compare the relationship between the variables. Cross tabulation table (contingency table) and chi-square test results are produced for each distinct value of break variable (optional)."
//                 },
//                 {
//                     "label": "-"
//                 },
//                 {
//                     "id": 1406,
//                     "label": "Compare Two Independent Samples [Mann-Whitney, Runs Test]...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "The procedure compares two independent samples using the Mann-Whitney U Test (nonparametric alternative to the t-test for independent samples), Kolmogorov-Smirnov test, Wald-Wolfowitz Runs test and Rosenbaum Q criterion."
//                 },
//                 {
//                     "id": 1407,
//                     "label": "Compare Multiple Independent Samples [Kruskal-Wallis, Median Test]...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "The Kruskal-Wallis ANOVA is a non-parametric method to test if samples are from the same distribution. The test is similar to the parametric one-way ANOVA, except that it is based on ranks rather than means. Median test checks the null hypothesis that the medians of the populations (from which two or more samples are drawn) are identical."
//                 },
//                 {
//                     "id": 14072,
//                     "label": "Compare Multiple Independent Samples (use group variable)...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "The Kruskal-Wallis ANOVA is a non-parametric method to test if samples are from the same distribution. The test is similar to the parametric one-way ANOVA, except that it is based on ranks rather than means. Median test checks the null hypothesis that the medians of the populations (from which two or more samples are drawn) are identical."
//                 },
//                 {
//                     "label": "-"
//                 },
//                 {
//                     "id": 1408,
//                     "label": "Compare Two Related Samples [Wilcoxon Pairs, Sign Test]...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "The procedure compares two related samples using the Wilcoxon Matched Pairs Test and Sign Test"
//                 },
//                 {
//                     "id": 1409,
//                     "label": "Compare Multiple Related Samples [Friedman ANOVA, Concordance]...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "This procedure compares multiple related samples. Report includes Friedman ANOVA results and Kendall's coefficient of concordance (Kendall's W)."
//                 },
//                 {
//                     "id": 14092,
//                     "label": "Compare Multiple Related Samples (use group variable)...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "This procedure compares multiple related samples. Report includes Friedman ANOVA results and Kendall's coefficient of concordance (Kendall's W)."
//                 },
//                 {
//                     "label": "-"
//                 },
//                 {
//                     "id": 1410,
//                     "label": "Cochran's Q Test...",
//                     "isenabled": true,
//                     "visibility": true
//                 }
//             ]
//         },
//         {
//             "label": "Time Series",
//             "short": "Time Series",
//             "icon": "toolbar_icon_1500",
//             "items": [
//                 {
//                     "label": "Analysis:",
//                     "isenabled": false,
//                     "visibility": true
//                 },
//                 {
//                     "id": 1501,
//                     "label": "Autocorrelation and Partial Autocorrelation...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "The command computes autocorrelation and partial autocorrelation functions and runs Ljung–Box Q test."
//                 },
//                 {
//                     "id": 1502,
//                     "label": "Moving Average...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "The Moving Average command projects values in the forecast period, based on the average value of the variable over a specific number of preceding periods."
//                 },
//                 {
//                     "id": 1503,
//                     "label": "Interrupted Series Analysis...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "The Interrupted time series analysis command performs analysis for longitudinal experiments involving a sequence of observations on a single dependent variable before and after an intervention."
//                 },
//                 {
//                     "label": "-"
//                 },
//                 {
//                     "label": "Data Processing:",
//                     "isenabled": false,
//                     "visibility": true
//                 },
//                 {
//                     "id": 1520,
//                     "label": "Remove Mean...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "Remove Mean command subtracts the sample mean value from each time series value."
//                 },
//                 {
//                     "id": 1521,
//                     "label": "Differences...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "This command computes the differenced series of order n (\"Differencing order\"). If the \"Remove mean\" option is checked the sample mean is first subtracted from the series before the differencing."
//                 },
//                 {
//                     "id": 1522,
//                     "label": "Exponential Smoothing...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "Exponential smoothing command computes exponentially weighted averages and provides short-term forecasts. Measures of accuracy are calculated."
//                 },
//                 {
//                     "id": 1523,
//                     "label": "Fast Fourier Transform - Direct...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "A Fast Fourier Transform commands compute the discrete Fourier transform (DFT) and its inverse using a fast Fourier transform (FFT) algorithm."
//                 },
//                 {
//                     "id": 1524,
//                     "label": "Fast Fourier Transform - Inverse...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "A Fast Fourier Transform commands compute the discrete Fourier transform (DFT) and its inverse using a fast Fourier transform (FFT) algorithm."
//                 }
//             ]
//         },
//         {
//             "label": "Survival Analysis",
//             "short": "Survival",
//             "icon": "toolbar_icon_1600",
//             "items": [
//                 {
//                     "id": 1309,
//                     "label": "Cox Regression...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "The Cox proportional-hazards regression analyzes the effect of several risk factors on survival."
//                 },
//                 {
//                     "id": 1601,
//                     "label": "Probit Analysis...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "Probit Analysis is a method of analyzing the relationship between a stimulus and the binomial response. The command runs probit regression and calculates dose-response percentiles, such as LD50 (ED50), LD16, LD84."
//                 }
//             ]
//         },
//         {
//             "label": "Data",
//             "short": "Data",
//             "icon": "toolbar_icon_3000",
//             "items": [
//                 {
//                     "label": "Data Generation:",
//                     "isenabled": false,
//                     "visibility": true
//                 },
//                 {
//                     "id": 3001,
//                     "label": "Stack Columns...",
//                     "isenabled": true,
//                     "visibility": true
//                 },
//                 {
//                     "id": 3002,
//                     "label": "Unstack Column...",
//                     "isenabled": true,
//                     "visibility": true
//                 },
//                 {
//                     "id": 3003,
//                     "label": "Standardize Variables...",
//                     "isenabled": true,
//                     "visibility": true
//                 },
//                 {
//                     "label": "Random Numbers Generation",
//                     "items": [
//                         {
//                             "id": 3100,
//                             "label": "Discrete Uniform...",
//                             "isenabled": true,
//                             "visibility": true
//                         },
//                         {
//                             "id": 3101,
//                             "label": "Continuous Uniform...",
//                             "isenabled": true,
//                             "visibility": true
//                         },
//                         {
//                             "id": 3102,
//                             "label": "Normal...",
//                             "isenabled": true,
//                             "visibility": true
//                         },
//                         {
//                             "id": 3103,
//                             "label": "Chi-Square...",
//                             "isenabled": true,
//                             "visibility": true
//                         },
//                         {
//                             "id": 3104,
//                             "label": "F-distribution...",
//                             "isenabled": true,
//                             "visibility": true
//                         }
//                     ]
//                 },
//                 {
//                     "label": "Sample Size",
//                     "items": [
//                         {
//                             "id": 1701,
//                             "label": "Prevalence survey with finite population correction...",
//                             "isenabled": true,
//                             "visibility": true,
//                             "description": "The procedure calculates sample size for a prevalence survey needed for a specified p-level %. The population size is the total size of the population from which a sample is drawn. If the population size is small, the correction for finite population will reduce the sample size."
//                         },
//                         {
//                             "id": 1702,
//                             "label": "Binomial exact confidence interval...",
//                             "isenabled": true,
//                             "visibility": true,
//                             "description": "Calculates binomial exact confidence interval. See help for examples."
//                         },
//                         {
//                             "id": 1703,
//                             "label": "Sample size needed to observe at least N events...",
//                             "isenabled": true,
//                             "visibility": true,
//                             "description": "Calculates sample size needed to observe at least N events with probability of occurrence equal to prevalence."
//                         },
//                         {
//                             "id": 1704,
//                             "label": "Sample size for a case-control study...",
//                             "isenabled": true,
//                             "visibility": true,
//                             "description": "Sample size for a case-control study"
//                         }
//                     ]
//                 },
//                 {
//                     "label": "-"
//                 },
//                 {
//                     "label": "Matrix Operations:",
//                     "isenabled": false,
//                     "visibility": true
//                 },
//                 {
//                     "id": 3200,
//                     "label": "Transpose Matrix...",
//                     "isenabled": true,
//                     "visibility": true
//                 },
//                 {
//                     "id": 3201,
//                     "label": "Matrix Multiplication...",
//                     "isenabled": true,
//                     "visibility": true
//                 },
//                 {
//                     "id": 3202,
//                     "label": "Inverse Matrix...",
//                     "isenabled": true,
//                     "visibility": true
//                 },
//                 {
//                     "id": 3203,
//                     "label": "Matrix Determinant...",
//                     "isenabled": true,
//                     "visibility": true
//                 },
//                 {
//                     "label": "-"
//                 },
//                 {
//                     "label": "Data Sampling:",
//                     "isenabled": false,
//                     "visibility": true
//                 },
//                 {
//                     "id": 3301,
//                     "label": "Random Sample...",
//                     "isenabled": true,
//                     "visibility": true
//                 },
//                 {
//                     "id": 3302,
//                     "label": "Periodic Sample...",
//                     "isenabled": true,
//                     "visibility": true
//                 },
//                 {
//                     "id": 3303,
//                     "label": "Conditional Sample...",
//                     "isenabled": true,
//                     "visibility": true
//                 }
//             ]
//         },
//         {
//             "label": "Charts",
//             "short": "Charts",
//             "icon": "toolbar_icon_4000",
//             "items": [
//                 {
//                     "label": "Statistical Charts:",
//                     "isenabled": false,
//                     "visibility": true
//                 },
//                 {
//                     "id": 4001,
//                     "label": "Box Plot...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "This command builds box plot for selected variables. A box plot is a graphical method of displaying data based on the five-number summary."
//                 },
//                 {
//                     "id": 4002,
//                     "label": "Scatter Plot...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "Scatter diagram shows the relationship between two quantitative variables by displaying data points on a two-dimensional graph. The explanatory variable ('X Values') is plotted on the x-axis, and the response variable ('Y Values') is plotted on the y-axis."
//                 },
//                 {
//                     "id": 1015,
//                     "label": "Histogram...",
//                     "isenabled": true,
//                     "visibility": true,
//                     "description": "The command produces a histogram for each input variable. To plot a histogram for categorical variables use the Frequency tables (discrete data) command. To specify bin locations from keyboard  (without a bins variables) use the Frequency tables (continuous data) command."
//                 },
//                 {
//                     "label": "Control Charts:",
//                     "isenabled": false,
//                     "visibility": true
//                 },
//                 {
//                     "id": 4102,
//                     "label": "Xbar-R Chart...",
//                     "isenabled": true,
//                     "visibility": true
//                 },
//                 {
//                     "id": 4103,
//                     "label": "Xbar-S Chart...",
//                     "isenabled": true,
//                     "visibility": true
//                 },
//                 {
//                     "label": "-"
//                 },
//                 {
//                     "id": 4104,
//                     "label": "CUSUM Chart...",
//                     "isenabled": true,
//                     "visibility": true
//                 },
//                 {
//                     "label": "-"
//                 },
//                 {
//                     "id": 4105,
//                     "label": "P Chart...",
//                     "isenabled": true,
//                     "visibility": true
//                 },
//                 {
//                     "id": 4106,
//                     "label": "C Chart...",
//                     "isenabled": true,
//                     "visibility": true
//                 },
//                 {
//                     "id": 4107,
//                     "label": "U Chart...",
//                     "isenabled": true,
//                     "visibility": true
//                 },
//                 {
//                     "label": "-"
//                 },
//                 {
//                     "id": 4108,
//                     "label": "Individuals and Moving Range...",
//                     "isenabled": true,
//                     "visibility": true
//                 }
//             ]
//         }
//     ]
// }

// renderCmdsMenu();