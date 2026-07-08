// Data Science & Analytics Complete Course Data
// Formatted for dynamic catalog consumption and lesson viewer parsing

export const allPhases = [
  {
    id: "ds-phase-1",
    title: "Phase 1: NumPy, Pandas, Data Cleaning & Time-Series (Weeks 1–2)",
    description: "Learn to clean, filter, aggregate, and manipulate raw datasets using Python's NumPy and Pandas libraries, including time-series datasets.",
    modules: [
      {
        id: "ds-m-1",
        title: "Module 1: Foundations of Data Wrangling & Manipulation",
        duration: "1 Week",
        difficulty: "Beginner-Intermediate",
        objectives: [
          "Perform multi-dimensional array operations using NumPy",
          "Navigate Pandas indexing, label selectors, and loaders",
          "Audit and impute missing database fields and outliers",
          "Merge tables and execute group aggregations",
          "Manipulate datetime indices and rolling statistics"
        ],
        lessons: [
          {
            id: "ds-l-1-1",
            title: "NumPy Basics & Vectorized Computations",
            time: "45 min",
            summary: "N-dimensional arrays, vectorized computations, indexing, slicing, and broadcasting principles.",
            content: `
### NumPy Basics & Vectorized Computations

Python lists are highly flexible, but they are slow for numerical computations because they store pointers to objects scattered across memory. **NumPy** (Numerical Python) provides a homogeneous, contiguous memory data structure called the **ndarray** (n-dimensional array) that enables blazing fast vectorized computations written in C.

#### Why NumPy?
1. **Contiguous Memory:** NumPy arrays are stored in a continuous block of memory, allowing CPUs to leverage cache performance and SIMD (Single Instruction, Multiple Data) instructions.
2. **Vectorization:** Eliminates the need for explicit Python \`for\` loops, executing operations across whole arrays simultaneously.
3. **Broadcasting:** Mathematical rules that allow arithmetic operations between arrays of different shapes.

#### Vectorization and Broadcasting Rules:
Broadcasting allows operations on arrays of different dimensions:
* NumPy compares array shapes from right to left (trailing dimensions).
* Two dimensions are compatible if they are equal, or if one of them is 1.

#### NumPy Code Example:
\`\`\`python
import numpy as np

# 1. Create a 1D and 2D array
arr_1d = np.array([1, 2, 3])
arr_2d = np.array([[10, 20, 30], [40, 50, 60]])

# 2. Vectorized arithmetic (No loop needed!)
doubled = arr_2d * 2
print("Doubled:\\n", doubled)

# 3. Broadcasting Example
# Adding 1D array of shape (3,) to 2D array of shape (2, 3)
broadcast_sum = arr_2d + arr_1d
print("Broadcast Sum:\\n", broadcast_sum)
\`\`\`

#### Quiz Questions:
1. **Why is NumPy significantly faster than native Python lists for numeric calculations?**
   *   a) It stores data as linked lists
   *   b) It utilizes contiguous memory blocks and compiled C-based vectorized functions (Correct)
   *   c) It runs on multiple server databases
2. **Which shapes are compatible for broadcasting?**
   *   a) (3, 3) and (2, 3)
   *   b) (4, 3) and (1, 3) (Correct)
   *   c) (5, 2) and (5, 3)

#### Interview Questions:
* **Explain the difference between np.copy() and a basic array slice.**
  *   *Answer:* A slice of a NumPy array is a **view** of the original data. Modifying a slice alters the parent array. \`np.copy()\` creates a complete copy of the array allocating new memory, so changes do not affect the original.
* **What is vectorization and why is it preferred?**
  *   *Answer:* Vectorization is the process of applying mathematical operations to an entire array at once rather than looping through individual indices. It is preferred because it delegates operations to highly optimized compiled C code, bypassing Python's slow interpreter loops.

#### Summary:
NumPy ndarrays provide contiguous storage and vectorization. Broadcasting allows operations on arrays of different shapes if their dimensions match or one is 1.
            `,
            exercise: "Create a 5x5 NumPy array containing random numbers. Extract the 3x3 core sub-array and replace all its values with its mean."
          },
          {
            id: "ds-l-1-2",
            title: "Pandas Series & DataFrames Foundations",
            time: "50 min",
            summary: "Data structures, Series, DataFrame selectors (.loc and .iloc), and CSV file loading.",
            content: `
### Pandas Series & DataFrames Foundations

Pandas is Python's primary tool for structured data analysis. Built on top of NumPy, it introduces labeled axes, aligning data automatically and handling mixed data types.

#### Core Data Structures:
1. **Series:** A 1D array containing a sequence of values associated with data labels (index).
2. **DataFrame:** A 2D tabular structure with columns of potentially different data types, indexed rows, and header columns.

#### Loc vs. Iloc Selectors:
* **.loc:** Label-based selection. You specify the row name and column name: \`df.loc[row_label, col_label]\`.
* **.iloc:** Integer index position-based selection. You specify integer coordinates: \`df.iloc[row_idx, col_idx]\`.

#### Pandas Code Example:
\`\`\`python
import pandas as pd

# Load CSV dataset into a DataFrame
df = pd.read_csv("https://raw.githubusercontent.com/mwaskom/seaborn-data/master/iris.csv")

# 1. Inspect first 3 rows
print(df.head(3))

# 2. Selecting with .loc (Label-based)
# Select rows where species is setosa, showing only sepal_length
setosa_lengths = df.loc[df["species"] == "setosa", ["sepal_length"]]
print("Setosa Sepal Lengths Count:", setosa_lengths.shape[0])

# 3. Selecting with .iloc (Integer index-based)
# Select the first 5 rows and the first 2 columns
subset = df.iloc[0:5, 0:2]
print("Subset:\\n", subset)
\`\`\`

#### Quiz Questions:
1. **What is the key difference between .loc and .iloc in Pandas?**
   *   a) .loc is faster than .iloc
   *   b) .loc uses row/column labels, whereas .iloc uses integer-based index positions (Correct)
   *   c) .loc only selects rows, .iloc only selects columns
2. **What data structure represents a single column extracted from a Pandas DataFrame?**
   *   a) NumPy Scalar
   *   b) Pandas Series (Correct)
   *   c) Matrix

#### Interview Questions:
* **How does Pandas handle indexing, and why does it help in data alignment?**
  *   *Answer:* Pandas indexes associate labels with each row. When you perform operations between two DataFrames or Series, Pandas aligns data automatically based on index labels rather than index position, preventing misaligned operations.
* **How would you read a massive 10GB CSV file in Pandas without running out of RAM?**
  *   *Answer:* I would use the \`chunksize\` parameter in \`pd.read_csv(file, chunksize=100000)\`. This loads the CSV iteratively in blocks of 100,000 rows, allowing us to process and aggregate data block-by-block without loading the whole file into memory.

#### Summary:
Pandas Series are 1D arrays; DataFrames are 2D tables. Use \`.loc\` for labels and \`.iloc\` for coordinate index coordinates. Chunk loading handles large files.
            `,
            exercise: "Load a CSV file containing user logs. Filter for users from 'US' aged over 25, and select only their 'username' and 'email' columns."
          },
          {
            id: "ds-l-1-3",
            title: "Data Cleaning: Handling Missing Values & Outliers",
            time: "55 min",
            summary: "Audit missing values, drop vs impute techniques, and identify outliers using Z-score and IQR.",
            content: `
### Data Cleaning: Handling Missing Values & Outliers

Real-world data is messy, incomplete, and contains errors. Cleaning data ensures models receive high-quality inputs, avoiding garbage-in, garbage-out outcomes.

#### 1. Handling Missing Data (NaN / None):
* **Drop:** If a column or row has >50% missing data, you can drop it using \`df.dropna()\`.
* **Impute (Fill):** Replacing missing fields:
  * *Mean/Median:* Good for numerical variables. Use median if the variable has skew or outliers.
  * *Mode:* Good for categorical variables.
  * *Forward/Backward Fill:* Good for time-series data.

#### 2. Detecting and Filtering Outliers:
* **Z-Score Method:** Measures how many standard deviations a data point is from the mean. Points with \`|Z| > 3\` are usually outliers.
  * Formula: \`Z = (X - mean) / std\`
* **Interquartile Range (IQR) Method:**
  * Calculate Interquartile Range: \`IQR = Q3 - Q1\`
  * Outlier Bounds: Below \`Q1 - 1.5 * IQR\` or above \`Q3 + 1.5 * IQR\`.

#### Data Cleaning Code Example:
\`\`\`python
import pandas as pd
import numpy as np

# Create mock DataFrame with missing value and outlier
data = {'age': [23, 25, np.nan, 28, 22, 120, 24, 26, 25]}
df = pd.DataFrame(data)

# Impute missing age with the median
median_age = df['age'].median()
df['age'] = df['age'].fillna(median_age)

# Detect outliers using IQR
Q1 = df['age'].quantile(0.25)
Q3 = df['age'].quantile(0.75)
IQR = Q3 - Q1
lower_bound = Q1 - 1.5 * IQR
upper_bound = Q3 + 1.5 * IQR

# Filter out the outlier (age 120)
cleaned_df = df[(df['age'] >= lower_bound) & (df['age'] <= upper_bound)]
print("Cleaned DataFrame:\\n", cleaned_df)
\`\`\`

#### Quiz Questions:
1. **When is it better to fill missing numeric data with the median rather than the mean?**
   *   a) When the dataset is small
   *   b) When the distribution is highly skewed or contains strong outliers (Correct)
   *   c) When the data consists of text strings
2. **According to the IQR method, a value is marked as an outlier if it is outside which bounds?**
   *   a) [Mean - Std, Mean + Std]
   *   b) [Q1 - 1.5*IQR, Q3 + 1.5*IQR] (Correct)
   *   c) [Median - IQR, Median + IQR]

#### Interview Questions:
* **What is the risk of blindly dropping all rows that contain missing data?**
  *   *Answer:* Dropping rows introduces sampling bias if the missingness is not completely random (e.g., lower-income survey respondents refusing to state their salary). It also shrinks the dataset size, stripping away critical training signals.
* **Explain the difference between Z-Score and IQR for outlier detection.**
  *   *Answer:* Z-Score relies on the mean and standard deviation, which are themselves highly sensitive to extreme outliers. IQR relies on percentiles (quantiles), which are robust to outliers, making IQR better for heavily skewed datasets.

#### Summary:
Missing data can be dropped or imputed (mean, median, mode). Outliers are detected using standard Z-scores or percentile-based IQR methods.
            `,
            exercise: "Write a function that accepts a DataFrame and a list of numeric columns, then clips values in those columns to the 1st and 99th percentiles."
          },
          {
            id: "ds-l-1-4",
            title: "Advanced Wrangling: GroupBy, Merging, and Aggregations",
            time: "50 min",
            summary: "Split-apply-combine GroupBy mechanics, outer/inner merges, and custom aggregations.",
            content: `
### Advanced Wrangling: GroupBy, Merging, and Aggregations

Data science often requires combining multiple tables and summarizing details across specific groups.

#### 1. The Split-Apply-Combine Pattern:
Pandas implements GroupBy using three stages:
1. **Split:** Divides the DataFrame into groups based on key values.
2. **Apply:** Computes functions (mean, sum, count) on each group.
3. **Combine:** Merges results back into a single Series or DataFrame.

#### 2. Merging Tables:
Analogous to SQL Joins:
* **Inner Join:** Returns rows with matching keys in both tables.
* **Left Join:** Returns all rows from left table, with matches from right table.
* **Outer Join:** Returns all records when there is a match in either table.

#### Aggregations Code Example:
\`\`\`python
import pandas as pd

# Data tables
employees = pd.DataFrame({
    'emp_id': [1, 2, 3],
    'name': ['Alice', 'Bob', 'Charlie'],
    'dept_id': [101, 102, 101]
})
departments = pd.DataFrame({
    'dept_id': [101, 102],
    'dept_name': ['Engineering', 'Marketing'],
    'budget': [500000, 300000]
})

# Merge DataFrames on dept_id
merged_df = pd.merge(employees, departments, on='dept_id', how='inner')
print("Merged Table:\\n", merged_df)

# Compute average budget by department name (Mock GroupBy)
dept_budget = merged_df.groupby('dept_name')['budget'].mean()
print("\\nDepartment Budgets:\\n", dept_budget)
\`\`\`

#### Quiz Questions:
1. **Which merge type returns all rows from the left table and matching rows from the right table?**
   *   a) Inner Merge
   *   b) Left Merge (Correct)
   *   c) Outer Merge
2. **What are the three steps of a GroupBy operation in Pandas?**
   *   a) Load, Clean, Plot
   *   b) Split, Apply, Combine (Correct)
   *   c) Sort, Filter, Print

#### Interview Questions:
* **What is the difference between merge() and concat() in Pandas?**
  *   *Answer:* \`merge()\` combines DataFrames horizontally based on shared columns (keys), acting like SQL Joins. \`concat()\` glues DataFrames together along an axis (either stacking rows vertically or columns horizontally) by matching indexes.
* **How do you use the .agg() method to run different aggregate functions on different columns?**
  *   *Answer:* You pass a dictionary to the \`.agg()\` method where keys are column names and values are the operations, like: \`df.groupby('category').agg({'price': 'mean', 'sales_id': 'count'})\`.

#### Summary:
GroupBy uses the split-apply-combine model. Table merging joins records horizontally via shared keys, while concatenation stacks records along an axis.
            `,
            exercise: "Perform an outer merge on user demographics and activity tables, and calculate the sum of active clicks grouped by location."
          },
          {
            id: "ds-l-1-5",
            title: "Working with Datetime and Time-Series Data",
            time: "55 min",
            summary: "Datetime parsing, resampling frequencies, rolling window aggregates, and shifting shifts.",
            content: `
### Working with Datetime and Time-Series Data

A vast amount of business data is index-timestamped (e.g., daily sales, server metrics, stocks). Pandas offers comprehensive tools for datetime index slicing and aggregations.

#### 1. Datetime Indexing:
Converting string timestamps into Pandas Datetime index objects:
\`\`\`python
df['date'] = pd.to_datetime(df['date'])
df.set_index('date', inplace=True)
\`\`\`
This enables slicing data by date ranges: \`df.loc['2026-01-01':'2026-06-30']\`.

#### 2. Resampling:
Similar to GroupBy, resampling aggregates dates into lower or higher frequencies (e.g. converting hourly data to daily sums):
* \`df.resample('D').sum()\` (Resample to Daily sums)
* \`df.resample('M').mean()\` (Resample to Monthly averages)

#### 3. Rolling Windows:
Computes statistics on a sliding window of time (e.g., 7-day moving average):
\`\`\`python
df['moving_avg'] = df['sales'].rolling(window=7).mean()
\`\`\`

#### Time-Series Code Example:
\`\`\`python
import pandas as pd
import numpy as np

# Generate daily timeline index
dates = pd.date_range(start='2026-01-01', periods=10, freq='D')
df = pd.DataFrame({'sales': [100, 120, 110, 130, 140, 150, 160, 155, 170, 180]}, index=dates)

# Calculate 3-day rolling mean
df['rolling_3d'] = df['sales'].rolling(window=3).mean()
print("Time Series with Rolling Mean:\\n", df)
\`\`\`

#### Quiz Questions:
1. **Which frequency code represents resampling to Monthly intervals in Pandas?**
   *   a) 'D'
   *   b) 'W'
   *   c) 'M' (Correct)
2. **What calculation is rolling(window=7).mean() calculating?**
   *   a) The overall dataset mean
   *   b) A 7-period moving average (Correct)
   *   c) The sum of the first 7 rows

#### Interview Questions:
* **Explain the difference between downsampling and upsampling in time series.**
  *   *Answer:* Downsampling reduces frequency (e.g., hourly to daily), which requires aggregating data (e.g., sum or mean). Upsampling increases frequency (e.g., monthly to daily), which requires interpolating missing timestamps (e.g., linear interpolation or forward fill).
* **What does the shift() method do, and when is it useful?**
  *   *Answer:* \`shift()\` moves index values backward or forward in time by a specified offset. It is highly useful in calculating period-over-period growth rates or aligning lag variables for training forecasting models.

#### Summary:
Datetime indexes allow direct date range selections. Resampling groups timestamps by frequency. Rolling windows compute metrics over sliding schedules.
            `,
            exercise: "Load stock price records, convert the index to a datetime sequence, resample it to weekly averages, and add a column showing 30-day rolling maxes."
          }
        ]
      },
      {
        id: "ds-m-2",
        title: "Module 2: Exploratory Data Analysis (EDA) & Statistics",
        duration: "1 Week",
        difficulty: "Intermediate",
        objectives: [
          "Explain descriptive stats and normal distributions",
          "Plot statistical charts using Matplotlib and Seaborn",
          "Formulate hypothesis tests and analyze p-values",
          "Apply MinMaxScaler and StandardScaler normalizations",
          "Synthesize charts into functional Power BI reports"
        ],
        lessons: [
          {
            id: "ds-l-2-1",
            title: "Descriptive Statistics & Probability Distributions",
            time: "50 min",
            summary: "Central tendency, dispersion metrics, normal distribution skewness, and the Central Limit Theorem.",
            content: `
### Descriptive Statistics & Probability Distributions

Before running machine learning models, you must understand the shape, range, and distributions of your dataset.

#### 1. Central Tendency & Dispersion:
* **Mean:** Average value (sensitive to outliers).
* **Median:** Middle value (robust to outliers).
* **Variance ($\sigma^2$):** Average of squared differences from the Mean.
* **Standard Deviation ($\sigma$):** Square root of variance, measuring average spread.

#### 2. Normal (Gaussian) Distribution:
A symmetric, bell-shaped distribution where:
* Mean = Median = Mode.
* **68-95-99.7 Rule:** 68% of data falls within $\pm1\sigma$, 95% within $\pm2\sigma$, and 99.7% within $\pm3\sigma$.

#### 3. Central Limit Theorem (CLT):
States that the distribution of sample means approaches a normal distribution as sample size grows ($N \ge 30$), regardless of the shape of the population distribution. This allows us to use normal-theory statistics on non-normal populations.

#### Python Summary Stats Example:
\`\`\`python
import pandas as pd

# Load sample dataset
df = pd.DataFrame({'salaries': [45000, 50000, 52000, 48000, 150000, 49000]})

# Outlier (150000) skews mean, median is robust
print("Mean Salary:", df['salaries'].mean())
print("Median Salary:", df['salaries'].median())
print("Std Deviation:", df['salaries'].std())
\`\`\`

#### Quiz Questions:
1. **According to the 68-95-99.7 rule, what percentage of values fall within two standard deviations of the mean in a normal distribution?**
   *   a) 68%
   *   b) 95% (Correct)
   *   c) 99.7%
2. **What does skewness represent in a distribution?**
   *   a) The dispersion range
   *   b) The measure of asymmetry of the distribution (Correct)
   *   c) The total number of rows

#### Interview Questions:
* **Why does the Central Limit Theorem matter in Data Science?**
  *   *Answer:* The CLT is the foundation for hypothesis testing and parametric statistical modeling. It guarantees that the sampling distribution of the mean will be normally distributed if the sample size is large enough, enabling statistical inference on variables with unknown distributions.
* **Explain how standard deviation is affected by adding a constant outlier to a dataset.**
  *   *Answer:* Standard deviation will increase significantly. Because the deviation calculations square the distances from the mean, single extreme outliers heavily weight and expand standard deviation values.

#### Summary:
Mean, median, and variance summarize distributions. Normal curves follow standard deviation spread zones. CLT enables statistical inference by guaranteeing normal sample means.
            `,
            exercise: "Generate a skewed distribution using numpy.random, print its mean and median, and note which direction the mean is pulled."
          },
          {
            id: "ds-l-2-2",
            title: "Data Visualization with Matplotlib & Seaborn",
            time: "50 min",
            summary: "Scatter plots, histograms, box plots, heatmap correlations, and aesthetic styling.",
            content: `
### Data Visualization with Matplotlib & Seaborn

Visualization is critical for identifying patterns, verifying assumptions, and communicating findings.

#### Visualization Categories:
1. **Histograms:** Display frequency distribution of continuous numerical columns. Good for detecting skewness and multimodal peaks.
2. **Scatter Plots:** Show relationship between two continuous variables. Good for identifying correlation patterns or clustering.
3. **Box Plots (Whisker Plots):** Visualize data distributions showing Q1, median, Q3, and points marked as outliers beyond 1.5*IQR.
4. **Correlation Heatmaps:** Color-coded grids mapping linear relationships between numeric columns.

#### Plotting Code Example:
\`\`\`python
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd

# Load sample dataset
tips = sns.load_dataset("tips")

# Set theme style
sns.set_theme(style="whitegrid")

# Create a boxplot mapping total bill across days
plt.figure(figsize=(8, 5))
sns.boxplot(data=tips, x="day", y="total_bill", hue="smoker", palette="Set2")
plt.title("Total Bill Distribution by Day and Smoking Preference")
plt.xlabel("Day of Week")
plt.ylabel("Total Bill ($)")

# Render plot (in non-interactive script saves or shows plot)
# plt.show()
\`\`\`

#### Quiz Questions:
1. **Which plot type is most appropriate for displaying distribution range, median, and outlier points simultaneously?**
   *   a) Scatter Plot
   *   b) Box Plot (Correct)
   *   c) Line Plot
2. **What library is built on top of Matplotlib, offering simpler syntax and high-quality default themes?**
   *   a) NumPy
   *   b) Seaborn (Correct)
   *   c) Pandas

#### Interview Questions:
* **How would you decide whether to use a Bar Plot versus a Histogram?**
  *   *Answer:* I would use a **Bar Plot** to compare values of discrete categorical variables (e.g., average sales by department). I would use a **Histogram** to visualize the underlying frequency distribution of a single continuous numerical variable (e.g., count of transactions across bin ranges).
* **What is a Heatmap, and how is it used to identify collinearity?**
  *   *Answer:* A heatmap is a color-coded 2D matrix representing variables. In EDA, we pass a correlation matrix to a heatmap. Bright colored blocks with values close to +1.0 or -1.0 indicate highly correlated features, signaling potential collinearity issues that might skew models.

#### Summary:
Histograms show frequency peaks. Boxplots isolate dispersion outliers. Scatter plots map correlations. Seaborn simplifies Matplotlib layouts.
            `,
            exercise: "Create a pairplot using Seaborn on the Iris dataset, setting the hue to 'species', and summarize your observed feature clusters."
          },
          {
            id: "ds-l-2-3",
            title: "Feature Engineering & Scaling",
            time: "50 min",
            summary: "One-Hot encoding, Ordinal encoding, MinMaxScaler normalization, and StandardScaler standardization.",
            content: `
### Feature Engineering & Scaling

Raw datasets must be transformed into numeric features that machine learning models can interpret. Distances and gradients behave poorly if feature scales differ widely.

#### 1. Categorical Encodings:
* **One-Hot Encoding:** Creates binary columns for each unique category. Used for nominal variables with no inherent order (e.g., Colors: Red, Blue).
* **Ordinal Encoding:** Maps categories to sequential integers. Used when order matters (e.g., Education: High School=0, BSc=1, PhD=2).

#### 2. Feature Scaling:
* **MinMaxScaler (Normalization):** Rescales features to a fixed range, typically 0 to 1.
  * Formula: \`X_scaled = (X - X_min) / (X_max - X_min)\`
  * Good for neural nets or distance algorithms like k-NN.
* **StandardScaler (Standardization):** Centers data by removing the mean and scaling to unit variance.
  * Formula: \`X_scaled = (X - mean) / std\`
  * Results in a distribution with mean=0 and std=1. Robust to outliers and standard for most linear/regression algorithms.

#### Feature Engineering Example:
\`\`\`python
from sklearn.preprocessing import StandardScaler, OneHotEncoder
import pandas as pd

df = pd.DataFrame({
    'income': [50000, 120000, 30000],
    'city': ['NY', 'SF', 'NY']
})

# 1. Scale numeric data
scaler = StandardScaler()
df['income_scaled'] = scaler.fit_transform(df[['income']])

# 2. Encode categorical data
encoder = OneHotEncoder(sparse_output=False)
encoded_city = encoder.fit_transform(df[['city']])
city_cols = encoder.get_feature_names_out(['city'])
encoded_df = pd.DataFrame(encoded_city, columns=city_cols)

# Combine
final_df = pd.concat([df, encoded_df], axis=1).drop(columns=['city'])
print("Engineered DataFrame:\\n", final_df)
\`\`\`

#### Quiz Questions:
1. **Which scaling technique scales data to have a mean of 0 and a standard deviation of 1?**
   *   a) MinMaxScaler
   *   b) StandardScaler (Correct)
   *   c) Log Transform
2. **What encoding should be used for the non-ordered feature 'Device_Type' (values: Mobile, Desktop, Tablet)?**
   *   a) Ordinal Encoding
   *   b) One-Hot Encoding (Correct)
   *   c) Target Encoding

#### Interview Questions:
* **Why must we fit preprocessing scalers on training data and only transform test data?**
  *   *Answer:* Fitting calculating scales (mean, min, std) on both training and test datasets causes **Data Leakage**. Information from the test dataset leaks into the model training pipeline, resulting in overly optimistic validation scores and poor real-world accuracy.
* **What is the dummy variable trap in One-Hot encoding?**
  *   *Answer:* It occurs when one encoded column is highly collinear with others (e.g., if columns are 'Is_Male' and 'Is_Female', one can predict the other perfectly). To prevent this collinearity, we must drop one of the category columns using \`drop_first=True\`.

#### Summary:
Nominal variables use One-Hot encoding; ordered values use Ordinal encoding. StandardScaler sets mean=0, std=1; MinMaxScaler normalizes inputs to [0,1].
            `,
            exercise: "Load the Titanic dataset. Clean missing values in age, One-Hot encode sex and class columns, and normalize age."
          },
          {
            id: "ds-l-2-4",
            title: "Correlation, Covariance, and Hypothesis Testing",
            time: "55 min",
            summary: "Pearson correlation coefficient, covariance, null/alternative hypotheses, type I/II errors, and p-values.",
            content: `
### Correlation, Covariance, and Hypothesis Testing

Statistics allow us to validate whether trends in data are mathematically significant or simply random noise.

#### 1. Covariance vs. Correlation:
* **Covariance:** Measures the direction of linear relationship between two variables. Scale-dependent, making comparison difficult.
* **Pearson Correlation ($r$):** Standardizes covariance into a scale from -1.0 (perfect negative) to +1.0 (perfect positive).
  * $r = 0$: No linear relationship.

#### 2. Hypothesis Testing Framework:
A process to test sample assertions:
* **Null Hypothesis ($H_0$):** States there is no effect or no difference (e.g., drug has no effect).
* **Alternative Hypothesis ($H_a$):** States there is an effect or difference.
* **Significance Level ($\alpha$):** Threshold of probability (usually 0.05).
* **P-Value:** Probability of observing results at least as extreme as the sample data, assuming $H_0$ is true. If \`p-value < \alpha\`, we **reject** $H_0$.

#### 3. Error Types:
* **Type I Error ($\alpha$):** False positive (rejecting $H_0$ when it is true).
* **Type II Error ($\beta$):** False negative (failing to reject $H_0$ when it is false).

#### Hypothesis Test Code Example:
\`\`\`python
from scipy import stats
import numpy as np

# Height of sample players vs general population mean of 175cm
sample_heights = np.array([178, 182, 175, 180, 185, 177, 181, 183])
pop_mean = 175

# 1-Sample T-test
t_stat, p_value = stats.ttest_1samp(sample_heights, pop_mean)
print(f"T-statistic: {t_stat:.3f}, P-value: {p_value:.5f}")

if p_value < 0.05:
    print("Reject Null: The sample group is statistically taller.")
else:
    print("Fail to Reject Null: No statistically significant difference.")
\`\`\`

#### Quiz Questions:
1. **If a hypothesis test returns a p-value of 0.012 at a significance level of 0.05, what is the conclusion?**
   *   a) Fail to reject the null hypothesis
   *   b) Reject the null hypothesis in favor of the alternative (Correct)
   *   c) Request more data variables
2. **What represents a Type I error?**
   *   a) A false negative
   *   b) A false positive (rejecting a true null hypothesis) (Correct)
   *   c) A coding syntax bug

#### Interview Questions:
* **Explain correlation does not imply causation with a real-world example.**
  *   *Answer:* Ice cream sales and drowning rates are highly correlated. However, eating ice cream doesn't cause drowning. A confounding third variable—hot summer weather—drives both. Correlation only maps co-movement, not causation pathways.
* **What is the statistical power of a test?**
  *   *Answer:* Statistical power ($1 - \beta$) is the probability of correctly rejecting the null hypothesis when it is false (i.e., avoiding a Type II error). It depends on sample size, effect size, and significance level.

#### Summary:
Pearson correlation maps variable co-movement. P-value measures the probability that $H_0$ is true; reject it if $p < 0.05$. Type I is false positive; Type II is false negative.
            `,
            exercise: "Perform a two-sample Independent T-test comparing total bills of male vs female tip givers and interpret the p-value result."
          },
          {
            id: "ds-l-2-5",
            title: "Storytelling with Data: Power BI & Dashboards",
            time: "45 min",
            summary: "Data importing, modeling tables relationships, Dax formulas, and creating clean visual reports.",
            content: `
### Storytelling with Data: Power BI & Dashboards

Data analysis is incomplete if decision-makers cannot understand the insights. Dashboards translate tabular numbers into interactive visual flows.

#### 1. Data Import & Transformation (Power Query):
* Imports data from databases, files, or cloud APIs.
* Allows transforming, splitting, and merging tables without writing SQL queries.

#### 2. Star Schema & Data Modeling:
* **Fact Tables:** Contain numerical transaction facts (e.g., sales_amount, quantity, date).
* **Dimension Tables:** Contain descriptive tables attributes linking to facts (e.g., customer details, store locations).
* The **Star Schema** connects dimensions to facts via 1-to-many relationships, optimizing query speed.

#### 3. DAX (Data Analysis Expressions):
Microsoft's formula language used to build calculations:
* *Calculated Columns:* Calculated row-by-row (e.g., \`Margin = Sales[Amount] - Sales[Cost]\`).
* *Measures:* Aggregated dynamically based on dashboard filter states (e.g., \`Total Revenue = SUM(Sales[Amount])\`).

#### Quiz Questions:
1. **In Power BI modeling, what type of table contains transactional metric metrics like sales volume or product price?**
   *   a) Dimension Table
   *   b) Fact Table (Correct)
   *   c) Matrix Table
2. **How do measures differ from calculated columns in Power BI?**
   *   a) Measures consume CPU memory at startup
   *   b) Measures compute dynamically based on interactive dashboard filters (Correct)
   *   c) Measures do not support aggregations

#### Interview Questions:
* **Why is the Star Schema preferred over a single large flat table in BI tools?**
  *   *Answer:* Large flat tables duplicate text data millions of times, consuming memory and slowing down database queries. A Star Schema segregates descriptive categories into compact dimension tables and links them to fact keys, which optimizes performance and simplifies dashboard filter scopes.
* **Explain the difference between DAX CALCULATE() and standard aggregation functions.**
  *   *Answer:* DAX \`CALCULATE()\` is the most powerful function in Power BI because it evaluates expressions under a **modified filter context**. It can override dashboard selections to calculate metrics (e.g. comparing active category sales to total global sales).

#### Summary:
Fact tables store transactions; dimensions store descriptors. Star schemas link them. DAX calculations run on dynamic dashboard filters to enable interactive exploration.
            `,
            exercise: "Sketch out a conceptual star schema for an online library containing fact_rentals, dim_books, and dim_readers tables."
          }
        ]
      }
    ]
  },
  {
    id: "ds-phase-2",
        title: "Phase 2: Supervised, Unsupervised & Advanced Machine Learning (Weeks 3–4)",
        description: "Build, evaluate, tune, and deploy predictive models using Scikit-Learn, including text processing and deep learning foundations.",
        modules: [
          {
            id: "ds-m-3",
            title: "Module 3: Supervised Machine Learning: Regression & Classification",
            duration: "1 Week",
            difficulty: "Advanced",
            objectives: [
              "Implement Linear and Logistic regression estimators",
              "Construct Decision Trees and Random Forests",
              "Compute classification score metrics (ROC-AUC, F1)",
              "Configure cross-validation and Hyperparameter search",
              "Compare k-Nearest Neighbors and SVM boundary lines"
            ],
            lessons: [
              {
                id: "ds-l-3-1",
                title: "Linear & Logistic Regression Mechanics",
                time: "50 min",
                summary: "Ordinary Least Squares (OLS), cost functions, gradient descent, sigmoid functions, and binary cross-entropy.",
                content: `
### Linear & Logistic Regression Mechanics

Regression is the core starting point of predictive modeling, spanning linear value prediction and binary classification.

#### 1. Linear Regression:
Predicts a continuous output variable ($Y$) based on input features ($X$):
* **Model Equation:** $Y = W^T X + b$ (where $W$ represents weight coefficients and $b$ is the bias intercept).
* **Cost Function:** **Mean Squared Error (MSE)**. We minimize MSE using **Ordinary Least Squares (OLS)** math or iterative **Gradient Descent**.
* **Assumptions:** Linearity, homoscedasticity (constant error variance), independence of errors, and normality of residuals.

#### 2. Logistic Regression:
Predicts the probability of a binary categorical outcome (0 or 1).
* **Sigmoid Activation Function:** Maps output values to a probability between 0 and 1.
  * Formula: $\sigma(z) = 1 / (1 + e^{-z})$
* **Cost Function:** **Binary Cross-Entropy (Log Loss)**. Evaluates differences between actual classes and estimated probabilities.

#### Scikit-Learn Regression Example:
\`\`\`python
from sklearn.linear_model import LogisticRegression
import numpy as np

# Feature: hours studied. Class: passed exam (0 or 1)
X = np.array([[1], [2], [3], [4], [5], [6]])
y = np.array([0, 0, 0, 1, 1, 1])

# Initialize and fit logistic classifier
model = LogisticRegression()
model.fit(X, y)

# Predict probability of pass for 3.5 study hours
prob = model.predict_proba([[3.5]])[0, 1]
print(f"Pass Probability for 3.5 hours: {prob:.2%}")
\`\`\`

#### Quiz Questions:
1. **What function maps inputs from $(-\infty, +\infty)$ to a probability range $[0, 1]$ in Logistic Regression?**
   *   a) Rectified Linear Unit (ReLU)
   *   b) Sigmoid function (Correct)
   *   c) Standard Scaler
2. **What is the default cost function minimized in Linear Regression models?**
   *   a) Binary Cross-Entropy
   *   b) Mean Squared Error (MSE) (Correct)
   *   c) Accuracy

#### Interview Questions:
* **Why can't we use Mean Squared Error (MSE) as the cost function for Logistic Regression?**
  *   *Answer:* Sigmoid activation combined with MSE results in a **non-convex** cost function with many local minima. Gradient descent can get trapped in these local minima. Binary Cross-Entropy results in a convex curve, guaranteeing gradient descent finds the global minimum.
* **What are the key assumptions of Linear Regression, and how do you check them?**
  *   *Answer:* Assumptions include: Linearity (checked via scatter plots), Homoscedasticity (checked via residual plots showing constant error dispersion), Independence (Durbin-Watson statistic), and Normality of residuals (Q-Q plot).

#### Summary:
Linear regression uses OLS to fit lines predicting numeric values. Logistic regression applies a Sigmoid function to output probabilities for binary targets.
            `,
            exercise: "Train a Linear Regression model using scikit-learn on a housing dataset, print the intercept and coefficients, and predict pricing."
          },
          {
            id: "ds-l-3-2",
            title: "Decision Trees & Random Forests Ensemble Methods",
            time: "55 min",
            summary: "Information Gain, Gini impurity, tree pruning, bagging mechanisms, and Random Forest estimators.",
            content: `
### Decision Trees & Random Forests Ensemble Methods

Tree-based models are highly popular because they handle non-linear relationships, scale well, and are easy to interpret.

#### 1. Decision Trees:
Divide data recursively into subsets based on features that maximize split purity:
* **Split Metrics:**
  * *Gini Impurity:* Measures probability of misclassification (0 indicates absolute purity).
  * *Entropy / Information Gain:* Measures reduction in randomness (variance).
* **Vulnerability:** Highly prone to **Overfitting** (building deep, complex trees that memorize training noise). Prevented using max-depth pruning limits.

#### 2. Random Forests (Bagging Ensemble):
Combines predictions from hundreds of independent Decision Trees to construct a robust estimator:
* **Bootstrap Aggregating (Bagging):** Each tree is trained on a random bootstrap sample of the training data (sampled with replacement).
* **Feature Randomness:** Each split in a tree considers only a random subset of features, reducing correlation between trees.
* Output is the average prediction (regression) or majority vote (classification).

#### Random Forest Code Example:
\`\`\`python
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split

# Generate mock classification dataset
X, y = make_classification(n_samples=500, n_features=10, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train Random Forest Classifier with 100 trees
clf = RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42)
clf.fit(X_train, y_train)

# Calculate accuracy
accuracy = clf.score(X_test, y_test)
print(f"Random Forest Test Accuracy: {accuracy:.2%}")
# Inspect feature importance ranking
print("Feature Importances:", clf.feature_importances_)
\`\`\`

#### Quiz Questions:
1. **Why does Random Forest reduce model variance compared to a single Decision Tree?**
   *   a) By building deeper trees
   *   b) By averaging the outputs of many independent trees trained on random data and feature subsets (Correct)
   *   c) By reducing learning rates
2. **What does a Gini Impurity of 0 represent in a decision tree node?**
   *   a) High noise
   *   b) Complete purity (all records belong to a single class) (Correct)
   *   c) An empty folder

#### Interview Questions:
* **Explain how bagging differs from boosting in ensemble modeling.**
  *   *Answer:* Bagging trains multiple independent estimators in parallel (e.g., Random Forest) and averages their predictions to reduce variance. Boosting trains estimators sequentially (e.g., XGBoost), where each new tree focuses on correcting the errors of the preceding trees, reducing bias.
* **Why are Random Forests resistant to overfitting?**
  *   *Answer:* By averaging many decorrelated trees, individual errors and noise cancel out. While individual trees might overfit their bootstrap samples, the collective ensemble generalizes well, yielding stable predictions.

#### Summary:
Decision trees split data using Gini or Entropy checks. Random Forests combine multiple trees using bootstrap sampling (bagging) and random feature selection.
            `,
            exercise: "Train a DecisionTreeClassifier. Limit max_depth to 3, print the tree rules using export_text, and evaluate output accuracy."
          },
          {
            id: "ds-l-3-3",
            title: "Support Vector Machines (SVM) & k-Nearest Neighbors (k-NN)",
            time: "50 min",
            summary: "Instance-based learning, distance metrics, margin maximization hyperplanes, and kernel trick mechanics.",
            content: `
### Support Vector Machines (SVM) & k-Nearest Neighbors (k-NN)

These algorithms represent two distinct approaches to decision boundaries: proximity grouping vs geometric margin isolation.

#### 1. k-Nearest Neighbors (k-NN):
An instance-based, lazy learning algorithm:
* **Mechanism:** To classify a new point, calculate its distance (e.g., Euclidean distance) to all training points. Assign the class based on the majority vote of the $k$ closest neighbors.
* **Scale Sensitive:** Because it relies on coordinate distances, **features must be scaled** (e.g. standardizer) before training.

#### 2. Support Vector Machines (SVM):
Finds the optimal hyperplane that separates classes by maximizing the **margin** (distance between boundary and support vectors).
* **Soft Margin:** Allows some misclassifications to handle noisy overlapping data, controlled by parameter $C$.
* **Kernel Trick:** Maps non-linearly separable data into a higher-dimensional space where they become linearly separable (e.g., RBF kernel).

#### SVM Scikit-Learn Example:
\`\`\`python
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
import numpy as np

# Training inputs (scaled)
X = np.array([[2, 30], [3, 90], [5, 45], [8, 120]])
y = np.array([0, 1, 0, 1])

# Scale variables
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Initialize Support Vector Classifier with linear kernel
svm = SVC(kernel='linear', C=1.0)
svm.fit(X_scaled, y)
print("Support Vectors Indices:", svm.support_)
\`\`\`

#### Quiz Questions:
1. **Why is feature scaling crucial for k-Nearest Neighbors (k-NN)?**
   *   a) Distance calculations are dominated by features with larger numerical ranges if left unscaled (Correct)
   *   b) It prevents tree overfitting
   *   c) It converts categories to columns
2. **What is the kernel trick in SVM?**
   *   a) A method to drop features
   *   b) A mathematical technique to map data into higher dimensions to find linear separation bounds (Correct)
   *   c) A file compression method

#### Interview Questions:
* **How does the hyperparameter C affect an SVM's decision boundary?**
  *   *Answer:* Parameter $C$ controls the trade-off between maximizing margin width and minimizing training classification errors. A small $C$ creates a wider margin but allows some training errors (high bias, low variance). A large $C$ strictly classifies all training points correctly, narrowing the margin (low bias, high variance, prone to overfitting).
* **Explain the computational downside of k-NN during runtime.**
  *   *Answer:* k-NN is a lazy learner, meaning it does no training. During inference, it must calculate distance from the query point to **every single point** in the database, making it computationally expensive and slow for large datasets.

#### Summary:
k-NN classifies data based on closest neighbor votes and requires scaled inputs. SVM finds hyperplanes that maximize margins, using kernels to separate complex data.
            `,
            exercise: "Train a k-NN classifier on the Iris dataset, loop through odd values of K from 1 to 15, and plot test accuracies."
          },
          {
            id: "ds-l-3-4",
            title: "Model Evaluation Metrics",
            time: "50 min",
            summary: "Confusion matrices, accuracy vs precision vs recall, F1-scores, ROC curves, and AUC scores.",
            content: `
### Model Evaluation Metrics

Choosing the right metric is vital. In imbalanced datasets, standard accuracy metrics can be highly misleading.

#### 1. The Confusion Matrix:
A grid mapping prediction outcomes:
* **TP (True Positive):** Predicted positive, actual positive.
* **TN (True Negative):** Predicted negative, actual negative.
* **FP (False Positive):** Predicted positive, actual negative (Type I Error).
* **FN (False Negative):** Predicted negative, actual positive (Type II Error).

#### 2. Key Metrics Formulas:
* **Accuracy:** \`(TP + TN) / Total\`. Poor for imbalanced data (e.g., 99% normal transactions).
* **Precision:** \`TP / (TP + FP)\`. Out of all predicted positives, how many were actually positive? Focus on minimizing false positives.
* **Recall (Sensitivity):** \`TP / (TP + FN)\`. Out of all actual positives, how many did we capture? Focus on minimizing false negatives.
* **F1-Score:** Harmonic mean of Precision and Recall:
  * \`F1 = 2 * (Precision * Recall) / (Precision + Recall)\`

#### 3. ROC Curve & AUC Score:
* **ROC Curve:** Plots True Positive Rate (Recall) vs False Positive Rate (1-Specificity) across decision thresholds.
* **AUC (Area Under Curve):** Measures probability that model ranks random positive higher than negative. An AUC of 0.5 represents random guessing; 1.0 is perfect.

#### Metrics Code Example:
\`\`\`python
from sklearn.metrics import classification_report, roc_auc_score
import numpy as np

# Ground truth vs predicted class probabilities
y_true = np.array([0, 0, 1, 1, 1])
y_probs = np.array([0.1, 0.35, 0.4, 0.8, 0.9])
# Threshold probability at 0.5
y_pred = (y_probs >= 0.5).astype(int)

# Generate detailed scores
print(classification_report(y_true, y_pred, target_names=["Negative", "Positive"]))
print("ROC-AUC Score:", roc_auc_score(y_true, y_probs))
\`\`\`

#### Quiz Questions:
1. **If a cancer detection model must minimize missed diagnoses (avoiding False Negatives), which metric should we prioritize?**
   *   a) Precision
   *   b) Recall (Sensitivity) (Correct)
   *   c) Accuracy
2. **What does an ROC-AUC score of 0.5 indicate?**
   *   a) Perfect classification
   *   b) Performance equivalent to random guessing (Correct)
   *   c) 50% model database error

#### Interview Questions:
* **Why is F1-score preferred over Accuracy on highly imbalanced datasets?**
  *   *Answer:* If 99% of transactions are legitimate, a dummy classifier predicting 'legitimate' always gets 99% accuracy while capturing 0 fraud. F1-score balances precision and recall, focusing on the minority target, and would score 0 for such a model, revealing its failure.
* **What is the difference between ROC-AUC and Precision-Recall (PR) AUC, and when do you use each?**
  *   *Answer:* ROC-AUC is robust when classes are balanced. However, when the positive class is extremely rare (e.g., fraud at 0.1%), the False Positive Rate stays low due to massive True Negatives. A PR-AUC curve ignores True Negatives, focusing on precision changes relative to minority recall, making it better for highly imbalanced datasets.

#### Summary:
Confusion grids track errors. Precision checks false positive rates; recall checks false negative rates. F1 combines both. AUC evaluates thresholds.
            `,
            exercise: "Calculate the confusion matrix, precision, recall, and F1-score manually for actual values [0,1,1,0,1,1,1] and predictions [0,0,1,0,1,1,0]."
          },
          {
            id: "ds-l-3-5",
            title: "Cross-Validation, Hyperparameter Tuning & Grid Search",
            time: "55 min",
            summary: "K-Fold splits, GridSearchCV, RandomizedSearchCV, and preventing test leakage.",
            content: `
### Cross-Validation & Tuning

We tune hyperparameters to control model complexity and prevent overfitting. Cross-validation ensures our tuning generalizes well to unseen datasets.

#### 1. K-Fold Cross-Validation:
Splits data into $K$ equal subsets (folds):
* Iterates $K$ times.
* In each iteration, use $K-1$ folds for training and 1 fold for validation.
* Average validation scores across all runs to estimate model generalization.
* **Stratified K-Fold:** Ensures each fold maintains the same target class proportions as the parent dataset.

#### 2. Tuning Searches:
* **GridSearchCV:** Exhaustively trains and evaluates models on all parameter combinations from a specified grid. Guaranteed to find the best configuration but computationally expensive.
* **RandomizedSearchCV:** Samples a random selection of configurations from specified distributions. Runs faster while yielding comparable performance.

#### Search Tuning Code Example:
\`\`\`python
from sklearn.model_selection import GridSearchCV
from sklearn.ensemble import RandomForestClassifier
import numpy as np

# Mock inputs
X = np.random.rand(100, 5)
y = np.random.randint(0, 2, 100)

# Define parameter grid
param_grid = {
    'n_estimators': [10, 50],
    'max_depth': [3, 5, None]
}

# Grid search with 3-fold cross-validation
grid_search = GridSearchCV(RandomForestClassifier(), param_grid, cv=3)
grid_search.fit(X, y)

print("Best Parameters Found:", grid_search.best_params_)
print("Best CV Accuracy Score:", grid_search.best_score_)
\`\`\`

#### Quiz Questions:
1. **How does K-Fold Cross-Validation help evaluate model performance?**
   *   a) By increasing data size
   *   b) By averaging scores across multiple data splits to ensure the metric is robust and not lucky (Correct)
   *   c) By accelerating code compilation
2. **Which search method evaluates every single combination of parameters in a grid?**
   *   a) RandomizedSearchCV
   *   b) GridSearchCV (Correct)
   *   c) Linear Search

#### Interview Questions:
* **What is the difference between a parameter and a hyperparameter?**
  *   *Answer:* Parameters are learned automatically from training data (e.g., weights in linear regression or split thresholds in decision trees). Hyperparameters are configuration settings defined by developers before training starts (e.g., learning rate, number of trees, or tree max-depth) to control learning.
* **Why is Stratified K-Fold preferred over standard K-Fold for classification tasks?**
  *   *Answer:* Standard K-Fold splits data randomly. If classes are highly imbalanced, some folds might accidentally contain zero positive class instances, causing calculations to fail. Stratified splits guarantee that every fold contains the exact same class percentage as the parent dataset.

#### Summary:
K-Fold splits test variance. GridSearchCV tests all parameter combinations; RandomizedSearchCV checks random combinations to save compute time.
            `,
            exercise: "Configure a hyperparameter search using RandomizedSearchCV for a Support Vector Machine, testing values of C and gamma."
          }
        ]
      },
      {
        id: "ds-m-4",
        title: "Module 4: Unsupervised Learning, Text Mining & Deployment",
        duration: "1 Week",
        difficulty: "Advanced",
        objectives: [
          "Apply K-Means clustering and evaluate silhouette widths",
          "Analyze Principal Component Analysis (PCA) projections",
          "Wrangle text documents using TF-IDF and bag-of-words",
          "Formulate PyTorch artificial neural network forward runs",
          "Build and deploy prediction endpoints using FastAPI wrappers"
        ],
        lessons: [
          {
            id: "ds-l-4-1",
            title: "K-Means Clustering & Hierarchical Clustering",
            time: "50 min",
            summary: "Centroids, Within-Cluster Sum of Squares (WCSS), the Elbow method, and dendrogram linkages.",
            content: `
### K-Means Clustering & Hierarchical Clustering

Unsupervised learning isolates patterns and structures in unlabeled datasets, primarily via clustering.

#### 1. K-Means Clustering:
Groups data points into $K$ clusters based on distance coordinates:
1. Initialize $K$ random centroids.
2. Assign points to the nearest centroid.
3. Recalculate centroids as the average of all points in the cluster.
4. Repeat steps 2 and 3 until centroids stabilize.
* **Determining K:** Plot the **Within-Cluster Sum of Squares (WCSS)** against $K$ values. Locate the "Elbow" point where adding more clusters yields diminishing returns.

#### 2. Hierarchical Clustering:
Builds a tree of clusters (Dendrogram):
* **Agglomerative (Bottom-Up):** Starts with each point as its own cluster, recursively merging the closest clusters.
* **Divisive (Top-Down):** Starts with one cluster, recursively splitting it.

#### K-Means Scikit-Learn Example:
\`\`\`python
from sklearn.cluster import KMeans
import numpy as np

# Coordinate points (Features must be scaled!)
X = np.array([[1, 2], [1.5, 1.8], [5, 8], [8, 8], [1, 0.6], [9, 11]])

# Cluster data into K=2 groups
kmeans = KMeans(n_clusters=2, random_state=42, n_init='auto')
kmeans.fit(X)

print("Cluster Centroids:\\n", kmeans.cluster_centers_)
print("Assigned Labels:", kmeans.labels_)
\`\`\`

#### Quiz Questions:
1. **What metric is plotted against K to find the optimal cluster count using the Elbow method?**
   *   a) Accuracy
   *   b) Within-Cluster Sum of Squares (WCSS) (Correct)
   *   c) Precision
2. **What visualization represents nested hierarchical clustering relationships?**
   *   a) Histogram
   *   b) Dendrogram (Correct)
   *   c) Heatmap

#### Interview Questions:
* **How does K-Means handle outliers, and how do you mitigate this?**
  *   *Answer:* K-Means calculates cluster centers using average coordinates, which are highly sensitive to outliers. Outliers can pull centroids away from dense data regions. We mitigate this by detecting and removing outliers before clustering, or using K-Medoids which uses actual data points as cluster centers.
* **Why must we scale features before running K-Means?**
  *   *Answer:* K-Means calculates cluster boundaries using distance formulas (like Euclidean distance). If one feature is measured in thousands (e.g. income) and another in single digits (e.g. ratings), the distance calculations will be dominated by the larger feature scale, rendering the other feature useless.

#### Summary:
K-Means groups data around $K$ centroids using distance formulas. WCSS Elbow plots find optimal $K$ values. Hierarchical links build dendrogram trees.
            `,
            exercise: "Generate synthetic clusters using make_blobs, cluster them using K-Means, and check accuracy using silhouette_score."
          },
          {
            id: "ds-l-4-2",
            title: "Principal Component Analysis (PCA) for Dimensionality Reduction",
            time: "50 min",
            summary: "The Curse of Dimensionality, eigenvalues, eigenvectors, orthogonal transformations, and explained variance ratios.",
            content: `
### Principal Component Analysis (PCA)

High-dimensional datasets (hundreds of columns) degrade model performance, consume disk storage, and cause overfitting. PCA reduces dimensionality while preserving maximum variance.

#### 1. The Curse of Dimensionality:
As feature dimensions increase, data space expands exponentially, making data points sparse. Distance metrics lose meaning, and models require exponentially more training data to generalize.

#### 2. PCA Mechanics:
An orthogonal linear transformation that:
* Identifies the axis of maximum variance (Principal Component 1).
* Identifies the next perpendicular axis of maximum remaining variance (Principal Component 2).
* Projects high-dimensional coordinates onto these lower-dimension components.
* Principal components are decorrelated, eliminating multi-collinearity.

#### PCA Code Example:
\`\`\`python
from sklearn.decomposition import PCA
import numpy as np

# Mock dataset with 4 features
X = np.random.rand(100, 4)

# Reduce dimensions to 2 principal components
pca = PCA(n_components=2)
X_reduced = pca.fit_transform(X)

print("Reduced Shape:", X_reduced.shape)
print("Explained Variance Ratio per PC:", pca.explained_variance_ratio_)
print("Cumulative Variance Captured:", np.sum(pca.explained_variance_ratio_))
\`\`\`

#### Quiz Questions:
1. **What is the main geometric property of Principal Components generated by PCA?**
   *   a) They are parallel
   *   b) They are orthogonal (perpendicular) to each other (Correct)
   *   c) They pass through zero
2. **What does the Curse of Dimensionality imply for distance metrics?**
   *   a) Distances become negative
   *   b) All points become roughly equidistant in high dimensions, reducing metric meaning (Correct)
   *   c) Compilations accelerate

#### Interview Questions:
* **How do you decide the number of principal components to keep in a model?**
  *   *Answer:* I fit PCA with all features and plot the **cumulative explained variance ratio** against the number of components (a Scree Plot). I select the number of components where the variance curve bends, typically retaining enough components to explain 80% to 95% of the total variance.
* **Why must we standard-scale data before fitting PCA?**
  *   *Answer:* PCA maximizes variance along components. If features have different scales, features with larger scales will show artificially high variance, dominating PCA projections. Scaling ensures all features contribute equally.

#### Summary:
PCA reduces dimensions by projecting data onto orthogonal components of maximum variance, resolving collinearity and scaling limits.
            `,
            exercise: "Apply PCA to the Iris dataset, project it down to 2 components, and construct a scatter plot coloring points by target class."
          },
          {
            id: "ds-l-4-3",
            title: "Natural Language Processing & Text Vectorization",
            time: "50 min",
            summary: "Text cleaning, tokenization, stopword filtering, Bag-of-Words, and TF-IDF weighting models.",
            content: `
### Natural Language Processing & Text Vectorization

Computers cannot process raw text. NLP transforms strings of characters into numeric feature matrices.

#### 1. Text Preprocessing:
* **Lowercasing:** Standardizes capitalization.
* **Tokenization:** Splits paragraphs into individual word tokens.
* **Stopword Removal:** Deletes common words with low informational value (e.g., 'and', 'the', 'is').
* **Lemmatization:** Reduces words to their dictionary root form (e.g., 'running', 'ran' -> 'run').

#### 2. Vectorization Models:
* **Bag-of-Words (CountVectorizer):** Counts word frequencies in documents, ignoring word order.
* **TF-IDF (Term Frequency-Inverse Document Frequency):** Weights words based on uniqueness across documents:
  * **TF:** Word frequency in a document.
  * **IDF:** Log of total documents divided by documents containing the word. Highly frequent words across all documents (e.g., 'company') get lower weights.

#### Text Vectorization Example:
\`\`\`python
from sklearn.feature_extraction.text import TfidfVectorizer

documents = [
    "Machine learning models analyze tabular data.",
    "Data science projects require clean data inputs."
]

# Calculate TF-IDF matrices
vectorizer = TfidfVectorizer(stop_words='english')
tfidf_matrix = vectorizer.fit_transform(documents)

# Inspect feature terms list
print("Feature Words:", vectorizer.get_feature_names_out())
print("TF-IDF Array:\\n", tfidf_matrix.toarray())
\`\`\`

#### Quiz Questions:
1. **Why does TF-IDF assign lower weights to words that appear in almost all documents?**
   *   a) They are spelling errors
   *   b) They carry less unique information for distinguishing between documents (Correct)
   *   c) They occupy too much memory
2. **What text preprocessing step reduces words like 'studied' and 'studies' to their root form 'study'?**
   *   a) Tokenization
   *   b) Lemmatization (Correct)
   *   c) One-Hot Encoding

#### Interview Questions:
* **Explain how TF-IDF calculations mitigate the shortcomings of basic Bag-of-Words models.**
  *   *Answer:* Bag-of-Words simply counts word occurrences. Common words like 'the' or 'is' dominate the vectors, even though they contain little signal. TF-IDF applies an inverse document frequency penalty, reducing the weight of words common across all documents, which highlights unique topic keywords.
* **What is the disadvantage of Bag-of-Words and TF-IDF regarding word context?**
  *   *Answer:* Both models ignore word order and grammatical structure. For example, "not good, but bad" and "not bad, but good" yield similar vector representations despite having opposite meanings. Modern systems use word embeddings (Word2Vec, BERT) to capture semantic relationships.

#### Summary:
NLP cleans text via tokenization and lemmatization. TF-IDF weights words by frequency and document uniqueness, converting raw text to numeric feature matrices.
            `,
            exercise: "Build a TF-IDF text classifier using scikit-learn Naive Bayes to classify movie reviews as positive or negative."
          },
          {
            id: "ds-l-4-4",
            title: "Neural Networks & Deep Learning Foundations",
            time: "55 min",
            summary: "Neurons, weights, bias, activation functions (ReLU, Sigmoid), backpropagation, and loss functions.",
            content: `
### Neural Networks & Deep Learning Foundations

Deep learning extends machine learning by stacking layers of nodes (neurons) to learn complex hierarchical feature representations directly from raw data.

#### 1. The Artificial Neuron (Perceptron):
Takes inputs ($X$), multiplies them by weights ($W$), adds a bias ($b$), and passes the result through an **Activation Function** to produce the output ($Y$).
* **Common Activation Functions:**
  * **ReLU (Rectified Linear Unit):** Output $f(x) = \max(0, x)$. Prevents vanishing gradients.
  * **Sigmoid:** Maps output to $[0, 1]$. Used for binary classification.
  * **Softmax:** Normalizes outputs into probability distributions. Used for multi-class classification.

#### 2. Network Layout & Training:
* **Forward Pass:** Input data flows forward through hidden layers to compute predictions.
* **Loss Function:** Evaluates prediction errors (e.g., Mean Squared Error or Categorical Cross-Entropy).
* **Backpropagation:** Computes gradients of the loss function relative to all weights using the Chain Rule.
* **Optimization (e.g., Adam, SGD):** Updates weights in the direction that minimizes loss.

#### Python PyTorch Concepts Example:
\`\`\`python
import torch
import torch.nn as nn

# Define a simple Neural Network with 1 hidden layer
class SimpleNN(nn.Module):
    def __init__(self, input_dim, hidden_dim, output_dim):
        super(SimpleNN, self).__init__()
        # Linear layer mapping
        self.fc1 = nn.Linear(input_dim, hidden_dim)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(hidden_dim, output_dim)
        
    def forward(self, x):
        out = self.fc1(x)
        out = self.relu(out)
        out = self.fc2(out)
        return out

# Initialize network: input dimensions 5, output 1
model = SimpleNN(input_dim=5, hidden_dim=10, output_dim=1)
dummy_input = torch.randn(1, 5)
print("Forward Output Tensor:", model(dummy_input))
\`\`\`

#### Quiz Questions:
1. **Which activation function is defined as f(x) = max(0, x) and helps prevent vanishing gradients?**
   *   a) Sigmoid
   *   b) ReLU (Correct)
   *   c) Softmax
2. **What algorithm computes loss gradients backward through the network to update weights?**
   *   a) Principal Component Analysis
   *   b) Backpropagation (Correct)
   *   c) Resampling

#### Interview Questions:
* **What is the vanishing gradient problem, and how do activation functions like ReLU address it?**
  *   *Answer:* In deep networks, gradients are backpropagated by multiplying derivative values layer-by-layer. If activation functions like Sigmoid are used, their derivatives are small ($\le 0.25$). Multiplying these small decimals repeatedly causes the gradient to vanish, stopping the early layers from learning. ReLU has a derivative of 1.0 for all positive inputs, allowing gradients to propagate back without shrinking.
* **What is overfitting in neural networks, and how do dropout layers prevent it?**
  *   *Answer:* Overfitting occurs when a neural network memorizes training data noise, failing to generalize. A dropout layer randomly deactivates a percentage of neurons during each training step. This prevents neurons from co-adapting and forces the network to learn redundant representations, improving generalization.

#### Summary:
Neurons combine weights, biases, and activation functions. Networks train by running forward passes to calculate loss, then backpropagating gradients to optimize weights.
            `,
            exercise: "Define a PyTorch network with 3 inputs, 1 hidden layer of 5 nodes, and a binary Sigmoid output, and run a dummy forward pass."
          },
          {
            id: "ds-l-4-5",
            title: "Deploying ML Models as APIs & Data Science Ethics",
            time: "55 min",
            summary: "Model serialization (pickle, joblib), FastAPI endpoint wrappers, prediction structures, bias mitigation, and ethical boundaries.",
            content: `
### Deploying ML Models & Ethics

A data science project is only valuable when integrated into production systems. At the same time, we must ensure our predictions are fair, transparent, and unbiased.

#### 1. Model Serialization (Saving):
Once trained, we serialize the model object to disk (as a \`.pkl\` or \`.joblib\` file) so it can be loaded later without retraining.
\`\`\`python
import joblib
joblib.dump(model, "prediction_model.joblib")
\`\`\`

#### 2. Creating API Endpoints (FastAPI):
We wrap our serialized model in a lightweight web API like FastAPI, allowing software applications to request predictions via HTTP POST requests.

#### 3. Data Science Ethics & Bias:
* **Algorithmic Bias:** Models learn and amplify biases present in historical training datasets (e.g. discriminatory hiring models).
* **Feedback Loops:** Predictions dictate behavior, creating data that reinforces the original bias.
* **Mitigations:** Regularly audit training data demographics, check feature importances, and avoid using protected characteristics (race, gender, age) as predictive inputs.

#### FastAPI Model Server Example:
\`\`\`python
# Concept script:
# Run using: uvicorn app_name:app --reload
from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI()

# Input structure
class PredictionRequest(BaseModel):
    feature1: float
    feature2: float

@app.post("/predict")
def predict(request: PredictionRequest):
    # Load model (mock loading in API call)
    # model = joblib.load("prediction_model.joblib")
    features = np.array([[request.feature1, request.feature2]])
    
    # Mock prediction: sum features
    prediction = float(np.sum(features))
    return {"prediction": prediction, "status": "success"}
\`\`\`

#### Quiz Questions:
1. **Which Python library is used to save (serialize) trained machine learning models to disk?**
   *   a) Scipy
   *   b) Joblib (or Pickle) (Correct)
   *   c) Matplotlib
2. **What is algorithmic bias?**
   *   a) A programming compile syntax error
   *   b) When models learn and amplify systemic prejudices present in training datasets (Correct)
   *   c) An unstable cloud server

#### Interview Questions:
* **How would you deploy a machine learning model to serve real-time predictions?**
  *   *Answer:* I would serialize the trained model using \`joblib\`. Then, I would create a REST API endpoint using FastAPI or Flask that loads the model into memory. Finally, I would package the application using Docker and deploy it to a cloud service (like AWS ECS or Kubernetes) shielded by an API Gateway.
* **Why can removing protected attributes (like gender or race) fail to eliminate algorithmic bias?**
  *   *Answer:* Because other features can act as proxies for the protected attributes. For example, zip codes can correlate highly with race, and search histories can correlate with gender. Models can reconstruct the excluded demographic signal from these proxy variables, preserving bias.

#### Summary:
Deploy models by serializing them to files and wrapping them in FastAPI endpoints. Audit systems constantly to detect and mitigate data bias and feedback loops.
            `,
            exercise: "Create a complete FastAPI mock endpoint that accepts user variables, loads a mock array, and returns a JSON dictionary of predicted costs."
          }
        ]
      }
    ]
  }
];

export const resourcesList = [
  {
    category: "Data Science Guides",
    items: [
      { name: "Pandas User Documentation", desc: "Reference guides for tabular data aggregation and wrangling.", link: "https://pandas.pydata.org/docs" },
      { name: "Scikit-Learn Machine Learning Guide", desc: "Tutorials on building, tuning, and evaluating models.", link: "https://scikit-learn.org/stable/user_guide.html" },
      { name: "Seaborn Visualization Guide", desc: "How to design statistical visual plots.", link: "https://seaborn.pydata.org" },
      { name: "Power BI DAX Language Reference", desc: "DAX calculations, measures, and star schemas.", link: "https://learn.microsoft.com/dax" }
    ]
  }
];

export const glossary = [
  { term: "NumPy", def: "Python library designed to perform fast vectorized calculations using contiguous memory arrays." },
  { term: "DataFrame", def: "A 2D tabular data structure in Pandas with labeled axes containing rows and columns." },
  { term: "Z-Score", def: "Statistical measure tracking how many standard deviations a data point is from the mean." },
  { term: "IQR", def: "Interquartile Range - the middle 50% range of values (Q3 - Q1) used to detect outliers." },
  { term: "Star Schema", def: "Data modeling design separating transactions into fact tables and descriptors into dimension tables." },
  { term: "Overfitting", def: "When a model learns noise in training data, failing to generalize to unseen test data." },
  { term: "Bagging", def: "Bootstrap Aggregating - training multiple independent estimators on random data subsets to reduce variance." },
  { term: "ROC-AUC", def: "Receiver Operating Characteristic Area Under Curve - metric tracking binary classification thresholds." },
  { term: "PCA", def: "Principal Component Analysis - dimensionality reduction projecting features onto orthogonal axes." },
  { term: "TF-IDF", def: "Term Frequency-Inverse Document Frequency - weighting word importance relative to document databases." }
];
