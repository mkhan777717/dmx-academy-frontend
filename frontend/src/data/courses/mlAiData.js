// Machine Learning & AI Complete Course Data
// Formatted for dynamic catalog consumption and lesson viewer parsing

export const allPhases = [
  {
    id: "ml-phase-1",
    title: "Phase 1: Linear Algebra, Regression Models & Tree Ensembles (Weeks 1–2)",
    description: "Learn statistics and linear algebra fundamentals, supervised regression and classification models, decision trees, and ensemble boosting methods.",
    modules: [
      {
        id: "ml-m-1",
        title: "Module 1: Mathematics & Supervised Classifiers",
        duration: "1 Week",
        difficulty: "Beginner-Intermediate",
        objectives: [
          "Explain vectors, matrices, eigenvalues, and gradient calculations",
          "Apply linear and logistic regression models to datasets",
          "Construct decision trees and tune Gini split impurities"
        ],
        lessons: [
          {
            id: "ml-l-1-1",
            title: "Linear Algebra & Matrix Calculus Basics",
            time: "45 min",
            summary: "Vectors operations, matrix multiplication, systems of equations, eigenvalues, and derivative gradients.",
            content: `
### Linear Algebra & Matrix Calculus Basics

Machine learning models are mathematical structures. Features are represented as vectors, and datasets are stored as matrices.

#### Core Mathematical Concepts:
* **Vectors:** 1D arrays of numbers representing features in a multi-dimensional space.
* **Matrix Multiplication:** Combines datasets and weights: $Y = X \cdot W$. The number of columns in matrix $X$ must equal the number of rows in matrix $W$.
* **Eigenvalues & Eigenvectors:** Vector directions ($v$) that do not change direction under a linear transformation ($A$), scaled by factor $\lambda$:
  $$A v = \lambda v$$
  Crucial for dimension reduction (PCA).
* **The Gradient ($\nabla$):** A vector of partial derivatives pointing in the direction of the steepest ascent of a function, used to update model weights in optimization.

#### Python NumPy Math Example:
\`\`\`python
import numpy as np

# 1. Define matrices
X = np.array([[1, 2], [3, 4]])
W = np.array([[0.5], [1.5]])

# 2. Perform matrix dot product
Y = np.dot(X, W)
print("Matrix Dot Product Y:\\n", Y)
\`\`\`

#### Quiz Questions:
1. **Under what constraint is matrix multiplication X * W mathematically defined?**
   *   a) Both matrices must be square
   *   b) The number of columns in matrix X must equal the number of rows in matrix W (Correct)
   *   c) Both matrices must contain only positive numbers
2. **What does the gradient vector represent in optimization algorithms?**
   *   a) The minimum value of a function
   *   b) The vector of partial derivatives pointing in the direction of steepest ascent (Correct)
   *   c) The variance of the dataset

#### Interview Questions:
* **What is an eigenvector, and where is it used in Machine Learning?**
  *   *Answer:* An eigenvector is a non-zero vector that changes only by a scalar factor (eigenvalue) when a linear transformation is applied. Eigenvectors are used in Principal Component Analysis (PCA) to find the axes of maximum variance in a dataset.
* **Why do we need partial derivatives in training machine learning models?**
  *   *Answer:* Partial derivatives calculate how the loss function changes relative to each specific model weight. This allows optimization algorithms (like Gradient Descent) to update each weight in the direction that minimizes loss.

#### Summary:
ML uses vectors for features and matrices for datasets. Gradients calculate slopes, directing optimization steps to update weights.
            `,
            exercise: "Write a NumPy script that calculates the dot product of a 3x3 matrix and a 3x1 vector, then computes the transpose of the result."
          },
          {
            id: "ml-l-1-2",
            title: "Probability & Bayes Theorem",
            time: "40 min",
            summary: "Conditional probability, joint probability, Bayes theorem, and Naive Bayes classifiers.",
            content: `
### Probability & Bayes Theorem

Probability quantifies uncertainty, which is the foundation of classification models.

#### Bayes Theorem:
Calculates the probability of an event based on prior knowledge of conditions related to the event:
$$P(A|B) = \\frac{P(B|A) P(A)}{P(B)}$$
* $P(A|B)$: Posterior probability of hypothesis $A$ given evidence $B$.
* $P(B|A)$: Likelihood of observing evidence $B$ given hypothesis $A$.
* $P(A)$: Prior probability of hypothesis $A$.
* $P(B)$: Marginal probability of evidence $B$.

#### Naive Bayes Classifier:
Assumes all features are **independent** given the class label, simplifying calculations for text classification (e.g. spam filtering).

#### Quiz Questions:
1. **What is the core assumption of a Naive Bayes classifier?**
   *   a) Features are highly correlated
   *   b) All features are conditionally independent of each other given the class label (Correct)
   *   c) The dataset is normally distributed
2. **What does P(A|B) represent in Bayes Theorem?**
   *   a) Prior probability
   *   b) Posterior probability (Correct)
   *   c) Likelihood

#### Interview Questions:
* **Why is Naive Bayes called 'Naive'?**
  *   *Answer:* Because it assumes that all input features are completely independent of each other given the class label. In real-world data (like text), features are often correlated, but the classifier still performs well.
* **Explain how Bayes Theorem is used in spam filtering.**
  *   *Answer:* It calculates the probability that an email is spam given the words inside: $P(\text{Spam}|\text{Words}) \propto P(\text{Words}|\text{Spam}) P(\text{Spam})$. If the probability exceeds a threshold, the email is flagged as spam.

#### Summary:
Bayes Theorem calculates posterior probabilities from prior info. Naive Bayes assumes independent features to classify text efficiently.
            `,
            exercise: "Calculate the probability that an email is spam if the word 'offer' appears, given: P(Spam) = 0.3, P('offer'|Spam) = 0.6, and P('offer'|Ham) = 0.1."
          },
          {
            id: "ml-l-1-3",
            title: "Linear & Ridge Regression Mechanics",
            time: "45 min",
            summary: "Ordinary Least Squares, MSE, gradient descent steps, multicollinearity, L2 regularization (Ridge), and parameter tuning.",
            content: `
### Linear & Ridge Regression Mechanics

Regression models predict continuous numeric values by fitting a line to data points.

#### 1. Linear Regression:
Minimizes the **Mean Squared Error (MSE)** between predictions and actual targets:
$$\text{MSE} = \\frac{1}{N} \\sum_{i=1}^{N} (y_i - \\hat{y}_i)^2$$

#### 2. Overfitting & Multicollinearity:
If features are highly correlated or too numerous, model weights can inflate, causing overfitting.

#### 3. Ridge Regression (L2 Regularization):
Adds a penalty proportional to the **square of the weights** to the cost function:
$$\text{Cost} = \text{MSE} + \lambda \\sum_{j=1}^{M} w_j^2$$
* $\lambda$ (alpha) controls the penalty strength.
* Shrinks weights close to zero (but not exactly zero), reducing model variance.

#### Ridge Regression Code Example:
\`\`\`python
from sklearn.linear_model import Ridge
import numpy as np

# Inputs
X = np.array([[1, 2], [2, 4], [3, 6], [4, 8]]) # Collinear features
y = np.array([5, 10, 15, 20])

# Initialize Ridge regression with penalty lambda=1.0
model = Ridge(alpha=1.0)
model.fit(X, y)
print("Coefficients:", model.coef_)
\`\`\`

#### Quiz Questions:
1. **What type of penalty does Ridge Regression add to the cost function?**
   *   a) Absolute value of weights (L1)
   *   b) Squared value of weights (L2) (Correct)
   *   c) Product of weights
2. **How does increasing the regularization parameter lambda (alpha) affect model bias and variance?**
   *   a) Decreases bias, increases variance
   *   b) Increases bias, decreases variance (Correct)
   *   c) Both decrease

#### Interview Questions:
* **What is the difference between Ridge (L2) and Lasso (L1) regularization?**
  *   *Answer:* Ridge adds a squared weight penalty, shrinking coefficients close to zero but retaining all features. Lasso adds an absolute weight penalty, which can shrink coefficients to exactly zero, performing feature selection.
* **Why is L2 regularization preferred when features are highly collinear?**
  *   *Answer:* Collinearity causes standard OLS weights to have high variance. L2 regularization constrains the weights, distributing the coefficients across correlated features and stabilizing predictions.

#### Summary:
Linear regression fits lines by minimizing MSE. Ridge regression adds an L2 squared-weight penalty to shrink coefficients, reducing variance and multicollinearity.
            `,
            exercise: "Train a Ridge regression model on a dataset. Plot model coefficients as lambda (alpha) increases from 0.01 to 100."
          },
          {
            id: "ml-l-1-4",
            title: "Logistic Regression & Binary Cross-Entropy",
            time: "45 min",
            summary: "Sigmoid mapping, log odds, decision boundaries, and Binary Cross-Entropy (Log Loss) calculations.",
            content: `
### Logistic Regression

Logistic regression classifies data points into binary categories (0 or 1) by outputting class probabilities.

#### 1. Sigmoid Function:
Maps any real-valued input $z$ to a probability between 0 and 1:
$$\sigma(z) = \\frac{1}{1 + e^{-z}}$$

#### 2. Binary Cross-Entropy Loss (Log Loss):
Evaluates prediction errors. When actual label is $y$ and prediction probability is $p$:
$$\text{Loss} = - [y \\log(p) + (1 - y) \\log(1 - p)]$$
* Penalizes confident wrong predictions exponentially.

#### Quiz Questions:
1. **Which activation function maps outputs to a probability range between 0 and 1 in Logistic Regression?**
   *   a) ReLU
   *   b) Sigmoid (Correct)
   *   c) Hyperbolic Tangent (tanh)
2. **What occurs to the Log Loss score when a classifier predicts a probability of 0.01 for a sample whose actual class is 1?**
   *   a) Loss becomes 0
   *   b) Loss increases exponentially (Correct)
   *   c) Loss decreases linearly

#### Interview Questions:
* **Why do we use Log Loss instead of MSE for Logistic Regression?**
  *   *Answer:* Sigmoid activation combined with MSE yields a non-convex cost function with multiple local minima. Log Loss ensures a convex cost function, guaranteeing gradient descent converges to the global minimum.
* **What is the meaning of Odds Ratio in Logistic Regression?**
  *   *Answer:* Odds Ratio is the probability of an event occurring divided by the probability of it not occurring: $p / (1-p)$. The log of the odds ratio forms a linear relationship with input features.

#### Summary:
Logistic regression outputs probabilities using a Sigmoid function, minimizing Log Loss to optimize binary boundaries.
            `,
            exercise: "Calculate the binary cross-entropy loss manually for targets [1, 0, 1] and prediction probabilities [0.9, 0.1, 0.4]."
          },
          {
            id: "ml-l-1-5",
            title: "Decision Trees & Gini Impurity",
            time: "45 min",
            summary: "Recursive splitting, Gini impurity, entropy calculations, and tree pruning limits.",
            content: `
### Decision Trees

Decision Trees split datasets recursively into pure subgroups based on feature decision thresholds.

#### Purity Metrics:
1. **Gini Impurity ($I_G$):** Measures the probability of misclassifying a random element:
   $$I_G = 1 - \\sum_{i=1}^{C} p_i^2$$
   * $I_G = 0$: All elements belong to a single class (pure).
2. **Entropy:** Measures the level of randomness (variance):
   $$\text{Entropy} = - \\sum_{i=1}^{C} p_i \\log_2(p_i)$$

#### Overfitting Mitigation:
Unconstrained trees grow complex, memorizing noise. We mitigate this using:
* **Max Depth Limits:** Restricts tree depth.
* **Min Samples Split:** Minimum sample count required to split a node.
* **Pruning:** Removing weak branches post-growth.

#### Quiz Questions:
1. **What is the Gini impurity value of a node containing exactly 50% class A and 50% class B samples?**
   *   a) 0.0
   *   b) 0.5 (Correct)
   *   c) 1.0
2. **Why do we apply tree pruning and depth limits to decision trees?**
   *   a) To increase training time
   *   b) To prevent the tree from overfitting the training dataset (Correct)
   *   c) To merge features

#### Interview Questions:
* **Explain how Information Gain is calculated.**
  *   *Answer:* Information Gain is the difference in entropy before and after a split. The algorithm selects the feature split that yields the highest Information Gain.
* **What is the structural advantage of Decision Trees regarding feature scale?**
  *   *Answer:* Decision Trees are scale-invariant. Since splits are simple threshold comparisons (e.g., $x_i > 5$), scaling or normalizing features does not affect the tree structure.

#### Summary:
Decision trees split data using Gini or Entropy checks. Use depth limits and pruning to prevent overfitting.
            `,
            exercise: "Calculate Gini impurity for a node containing 10 positive and 30 negative samples."
          }
        ]
      },
      {
        id: "ml-m-2",
        title: "Module 2: Advanced Ensemble Methods & SVM",
        duration: "1 Week",
        difficulty: "Intermediate",
        objectives: [
          "Differentiate Bagging and Boosting ensemble architectures",
          "Train Random Forest estimators and analyze feature importances",
          "Implement Gradient Boosting and AdaBoost classifiers",
          "Formulate SVM margin maximization boundaries and apply kernel tricks"
        ],
        lessons: [
          {
            id: "ml-l-2-1",
            title: "Random Forests & Bagging Ensembles",
            time: "45 min",
            summary: "Bootstrap aggregating, feature subspaces, Out-Of-Bag error, and forest estimators.",
            content: `
### Random Forests & Bagging Ensembles

Ensemble methods combine predictions from multiple base models to create a robust model.

#### Bootstrap Aggregating (Bagging):
* **Bootstrap Sampling:** Each base estimator (tree) is trained on a random sample of the training data (sampled with replacement).
* **Aggregating:** Predictions are averaged (regression) or voted on (classification) to reduce variance.

#### Random Forest:
Extends bagging by adding feature randomness:
* When splitting a node, the tree searches only a random subset of features, decorrelating individual trees and reducing variance.

#### Quiz Questions:
1. **What is the key mechanism of Bootstrap Aggregating (Bagging)?**
   *   a) Training trees sequentially on error weights
   *   b) Training multiple independent models in parallel on random data subsets sampled with replacement (Correct)
   *   c) Dropping random neurons
2. **What does Out-Of-Bag (OOB) error represent in Random Forests?**
   *   a) A programming compile syntax error
   *   b) Validation error calculated using training samples that were left out of a tree's bootstrap sample (Correct)
   *   c) The count of empty leaves

#### Interview Questions:
* **Why does feature randomness improve Random Forests over standard Bagging?**
  *   *Answer:* Standard bagging trees can look similar if one feature is highly dominant. By forcing trees to choose from a random subset of features, trees become decorrelated. Averaging these decorrelated trees yields a larger reduction in variance.
* **How do you calculate feature importance in a Random Forest?**
  *   *Answer:* By measuring the average decrease in node impurity (Gini or Entropy) brought by a feature across all trees in the forest.

#### Summary:
Bagging averages predictions from independent parallel trees to reduce variance. Random Forest adds feature subsets to decorrelate trees.
            `,
            exercise: "Train a RandomForestClassifier. Print the feature importance score for each feature and list the top three features."
          },
          {
            id: "ml-l-2-2",
            title: "AdaBoost & Gradient Boosting (GBM)",
            time: "50 min",
            summary: "Sequential learning, weak learners weights, gradient descent in function space, and XGBoost structures.",
            content: `
### Boosting: AdaBoost & Gradient Boosting

While Bagging trains trees in parallel, **Boosting** trains trees sequentially, where each new tree corrects the errors of its predecessors.

#### 1. AdaBoost (Adaptive Boosting):
* Starts by training a weak learner (usually a shallow tree stump).
* Increases the weights of misclassified samples.
* Trains the next weak learner on the re-weighted dataset, assigning higher weights to more accurate models.

#### 2. Gradient Boosting (GBM):
* Instead of adjusting sample weights, subsequent trees are trained to predict the **residuals (errors)** of the preceding ensemble.
* Uses gradient descent to minimize the loss function when adding new trees.

#### Boosting Code Example:
\`\`\`python
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split

# Generate data
X, y = make_classification(n_samples=500, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train Gradient Boosting Classifier
gbm = GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, max_depth=3)
gbm.fit(X_train, y_train)
print("GBM Accuracy:", gbm.score(X_test, y_test))
\`\`\`

#### Quiz Questions:
1. **How does Boosting construct its ensemble of trees?**
   *   a) In parallel, independently
   *   b) Sequentially, where each tree corrects the errors of preceding trees (Correct)
   *   c) By pruning leaves
2. **What does a Gradient Boosting model fit each new tree to predict?**
   *   a) The original target labels
   *   b) The residual errors of the current ensemble predictions (Correct)
   *   c) Random noise

#### Interview Questions:
* **What is the role of the learning rate parameter in Gradient Boosting?**
  *   *Answer:* The learning rate scales the contribution of each new tree. A smaller learning rate ($\le 0.1$) slows down training but acts as regularization, preventing overfitting.
* **How does AdaBoost handle misclassified samples differently from Gradient Boosting?**
  *   *Answer:* AdaBoost adjusts sample weights, forcing the next tree to focus on misclassified points. Gradient Boosting fits new trees to the residual errors (gradient) of the collective loss function directly.

#### Summary:
Boosting builds sequential trees. AdaBoost adjusts sample weights, while Gradient Boosting fits trees to residual errors to minimize loss.
            `,
            exercise: "Compare test accuracies of a Random Forest and Gradient Boosting classifier on a complex dataset, and summarize their performance."
          },
          {
            id: "ml-l-2-3",
            title: "Support Vector Machines (SVM) & Kernel Tricks",
            time: "50 min",
            summary: "Hyperplane margins, support vectors, soft margin cost (C), and Radial Basis Function (RBF) kernels.",
            content: `
### Support Vector Machines (SVM)

SVM finds the optimal hyperplane that separates classes by maximizing the margin width between classes.

#### Core Mechanics:
* **Support Vectors:** The data points closest to the decision boundary, which dictate the hyperplane's position.
* **The Margin:** The distance between the boundary and the closest support vectors.
* **Soft Margin (Parameter C):** Controls the trade-off between maximizing margin width and minimizing training classification errors.
* **Kernel Trick:** Maps non-linearly separable data into a higher-dimensional space where they become linearly separable, without calculating coordinates in that space.

#### SVM Math Projections:
\`\`\`
1D Data (Non-linear):  --[Class A]--[Class B]--[Class A]--
                               | (Kernel Trick maps to 2D)
2D Data (Linear):     Class A points curve upward.
                      A straight line can now separate Class A and Class B.
\`\`\`

#### Quiz Questions:
1. **Which data points dictate the position of an SVM decision boundary?**
   *   a) The mean values of each class
   *   b) Support Vectors (the closest points to the margin) (Correct)
   *   c) Outliers
2. **What does the SVM kernel trick accomplish?**
   *   a) It deletes columns
   *   b) It projects data into higher dimensions to find linear separation boundaries (Correct)
   *   c) It compresses models

#### Interview Questions:
* **How do you choose between a linear, polynomial, or RBF kernel in SVM?**
  *   *Answer:* Use a linear kernel if the dataset is linearly separable or has many features ($F > N$). Use polynomial or RBF kernels for complex non-linear boundaries. Validate kernel performance using cross-validation.
* **What is the effect of setting a very large C parameter in SVM?**
  *   *Answer:* A large $C$ penalizes misclassifications heavily, creating a narrow margin that classifies all training points correctly, which can lead to overfitting (low bias, high variance).

#### Summary:
SVM maximizes decision margins. Support vectors dictate boundaries, and kernels enable linear separation of non-linear data in higher dimensions.
            `,
            exercise: "Train an SVM with an RBF kernel on a circular dataset (make_circles) and plot the decision boundary."
          }
        ]
      }
    ]
  },
  {
    id: "ml-phase-2",
        title: "Phase 2: Tuning, Unsupervised Clustering, PyTorch Deep Learning & Deploy (Weeks 3–4)",
        description: "Configure hyperparameter searches, build K-Means clusters, write PyTorch networks, and deploy endpoints.",
        modules: [
          {
            id: "ml-m-3",
            title: "Module 3: Validation, Clustering & Dimensionality Reduction",
            duration: "1 Week",
            difficulty: "Advanced",
            objectives: [
              "Compute precision-recall and ROC-AUC curves",
              "Execute GridSearchCV and K-Fold cross-validations",
              "Group data using K-Means and evaluate elbow WCSS curves",
              "Reduce feature dimensions using Principal Component Analysis (PCA)"
            ],
            lessons: [
              {
                id: "ml-l-3-1",
                title: "Model Evaluation: Metrics & Cross-Validation",
                time: "50 min",
                summary: "Imbalanced classification metrics, Stratified K-Fold splits, GridSearchCV, and data leakage checks.",
                content: `
### Model Evaluation & Tuning

Evaluating models on training accuracy leads to overfitting. We use cross-validation and specialized metrics to check generalization.

#### 1. Imbalanced Classification Metrics:
* **Accuracy:** Can be misleading (e.g., 99% normal transactions).
* **Precision:** \`TP / (TP + FP)\`. Minimizes false positives (e.g. spam detection).
* **Recall:** \`TP / (TP + FN)\`. Minimizes false negatives (e.g. disease screening).
* **ROC-AUC:** Measures classifier performance across thresholds.

#### 2. Stratified K-Fold Cross-Validation:
Splits data into $K$ folds while preserving target class proportions, ensuring robust evaluations on imbalanced datasets.

#### 3. Data Leakage:
Occurs when info from the validation/test set leaks into the training pipeline (e.g. scaling the entire dataset before splitting). **Always fit preprocessing scalers on the training split only.**

#### Quiz Questions:
1. **Which metric is most appropriate for disease detection models where missing a positive case is critical (False Negatives must be minimized)?**
   *   a) Precision
   *   b) Recall (Correct)
   *   c) Accuracy
2. **What occurs during Data Leakage?**
   *   a) Data is deleted
   *   b) Information from validation/test datasets leaks into the training pipeline, yielding overly optimistic evaluation scores (Correct)
   *   c) Servers crash

#### Interview Questions:
* **How does Stratified K-Fold differ from standard K-Fold cross-validation?**
  *   *Answer:* Standard K-Fold splits data randomly. Stratified K-Fold ensures each split contains the exact same class proportions as the parent dataset, preventing folds with zero positive instances.
* **Explain how GridSearchCV optimizes hyperparameters.**
  *   *Answer:* It exhaustively trains and evaluates models on all combinations of parameters from a specified grid, using cross-validation to identify the best configuration.

#### Summary:
Validate models using cross-validation and metrics tailored to the task. Avoid data leakage by fitting scalers only on training splits.
            `,
            exercise: "Configure a Stratified K-Fold cross-validation loop and compare average recall scores of two classifiers."
          },
          {
            id: "ml-l-3-2",
            title: "K-Means Clustering & WCSS Elbow Plots",
            time: "50 min",
            summary: "Centroids, Euclidean distances, WCSS, finding K using the Elbow method, and silhouette width analysis.",
            content: `
### K-Means Clustering

K-Means is an unsupervised algorithm that groups unlabeled data points into $K$ clusters based on feature coordinates.

#### Algorithmic Workflow:
1. Initialize $K$ random centroids.
2. Assign points to the nearest centroid based on Euclidean distance.
3. Update centroids by calculating the average coordinates of all points in the cluster.
4. Repeat steps 2 and 3 until centroids stabilize.

#### Finding the Optimal K:
Plot the **Within-Cluster Sum of Squares (WCSS)** against $K$ values. The WCSS measures the sum of squared distances between points and their cluster centroids. Choose the "Elbow" point where the rate of WCSS decrease slows down.

#### Quiz Questions:
1. **What distance metric does K-Means typically use to assign points to centroids?**
   *   a) Cosine Similarity
   *   b) Euclidean distance (Correct)
   *   c) Jaccard Distance
2. **What does the WCSS measure in clustering?**
   *   a) Classification accuracy
   *   b) The sum of squared distances between data points and their assigned cluster centroids (Correct)
   *   c) The training time

#### Interview Questions:
* **Why must you scale features before running K-Means?**
  *   *Answer:* K-Means calculates boundaries using distances. Unscaled features with large ranges (e.g. salary) will dominate distance calculations, rendering smaller-range features useless.
* **What are the limitations of the K-Means clustering algorithm?**
  *   *Answer:* It requires specifying $K$ upfront, is sensitive to outliers (which pull centroids away from dense data regions), and assumes clusters are spherical and of similar size, struggling with complex shapes.

#### Summary:
K-Means groups data points around $K$ centroids using distance metrics. WCSS elbow plots help determine the optimal number of clusters.
            `,
            exercise: "Scale a customer transaction dataset, run K-Means for K=1 to 10, plot the WCSS curve, and locate the elbow."
          },
          {
            id: "ml-l-3-3",
            title: "Principal Component Analysis (PCA) Dimension Reduction",
            time: "50 min",
            summary: "Curse of dimensionality, covariance matrices, orthogonal projections, and cumulative explained variance ratios.",
            content: `
### Principal Component Analysis (PCA)

High-dimensional datasets (thousands of features) can cause overfitting and slow down training (the Curse of Dimensionality). PCA reduces features while preserving maximum variance.

#### Core Mechanics:
1. **Covariance Matrix:** Calculates linear relationships between all features.
2. **Eigenvalue Decomposition:** Computes eigenvectors (principal component directions) and eigenvalues (variance magnitude).
3. **Orthogonal Projection:** Projects data coordinates onto these perpendicular principal components.
* Principal components are ordered by variance, allowing you to drop lower-variance components.

#### Quiz Questions:
1. **Why does PCA project data onto orthogonal axes?**
   *   a) To increase dimensions
   *   b) To ensure principal components are perpendicular and completely decorrelated (Correct)
   *   c) To drop targets
2. **What does a Scree Plot display in PCA?**
   *   a) Classifier accuracy
   *   b) The variance explained by each principal component (Correct)
   *   c) Outlier values

#### Interview Questions:
* **How do you determine how many principal components to retain?**
  *   *Answer:* By plotting the cumulative explained variance ratio against the number of components. I select the number of components where the variance curve bends, typically retaining enough components to explain 80% to 95% of the total variance.
* **Why must data be standard-scaled before running PCA?**
  *   *Answer:* PCA maximizes variance along components. Unscaled features with large ranges show artificially high variance, dominating PCA projections. Scaling ensures all features contribute equally.

#### Summary:
PCA reduces dimensions by projecting data onto orthogonal principal components, eliminating multicollinearity and reducing variance.
            `,
            exercise: "Fit PCA on a 10-feature dataset, project it to 3 components, and print the cumulative explained variance ratio."
          }
        ]
      },
      {
        id: "ml-m-4",
        title: "Module 4: Deep Learning Foundations & Deployment",
        duration: "1 Week",
        difficulty: "Advanced",
        objectives: [
          "Explain artificial neural network architectures",
          "Write PyTorch modules executing forward passes",
          "Implement backpropagation and compute loss gradients",
          "Deploy models as REST APIs using FastAPI wrappers"
        ],
        lessons: [
          {
            id: "ml-l-4-1",
            title: "Neural Networks: Neurons & Activations",
            time: "50 min",
            summary: "Perceptrons, weights, bias, activation functions (ReLU, Sigmoid, Softmax), and multi-layer perceptrons.",
            content: `
### Neural Networks & Activations

Deep Learning uses layers of artificial neurons to learn hierarchical representations directly from raw data.

#### 1. The Artificial Neuron:
Multiplies inputs ($x$) by weights ($w$), adds a bias ($b$), and passes the sum through an **Activation Function** to introduce non-linearity:
$$z = \\sum w_i x_i + b$$
$$y = a(z)$$

#### 2. Activation Functions:
* **ReLU (Rectified Linear Unit):** $f(x) = \max(0, x)$. Standard for hidden layers, preventing vanishing gradients.
* **Sigmoid:** Output is mapped to $[0, 1]$. Used for binary classification outputs.
* **Softmax:** Normalizes outputs into probability distributions, used for multi-class classification outputs.

#### Quiz Questions:
1. **Which activation function outputs values in the range [0, 1], making it ideal for binary classification?**
   *   a) ReLU
   *   b) Sigmoid (Correct)
   *   c) Softmax
2. **Why do we include activation functions in neural networks?**
   *   a) To speed up matrix multiplications
   *   b) To introduce non-linearities, allowing the network to learn complex non-linear decision boundaries (Correct)
   *   c) To scale weights to 1

#### Interview Questions:
* **What is the vanishing gradient problem, and how does ReLU address it?**
  *   *Answer:* In deep networks, gradients are backpropagated by multiplying derivatives layer-by-layer. Sigmoid derivatives are small ($\le 0.25$). Multiplying these decimals repeatedly causes gradients to vanish, stopping early layers from learning. ReLU has a derivative of 1.0 for positive inputs, preventing gradients from shrinking.
* **What is the difference between Sigmoid and Softmax activation functions?**
  *   *Answer:* Sigmoid outputs a single probability between 0 and 1, used for binary classification. Softmax normalizes a vector of outputs into a probability distribution that sums to 1.0, used for multi-class classification.

#### Summary:
Neurons weight inputs and apply activation functions. ReLU handles hidden layers, and Sigmoid/Softmax handle classification outputs.
            `,
            exercise: "Write a Python function calculating the output of a single neuron with inputs [0.5, 1.5], weights [0.4, -0.2], bias 0.1, and a ReLU activation."
          },
          {
            id: "ml-l-4-2",
            title: "PyTorch Framework & Forward Passes",
            time: "55 min",
            summary: "PyTorch tensors, neural network classes, linear layers, and executing forward passes.",
            content: `
### PyTorch Framework & Forward Passes

PyTorch is a popular open-source deep learning framework. It uses **Tensors** (multi-dimensional arrays) that support GPU acceleration and automatic differentiation.

#### Defining a PyTorch Network:
We inherit from \`nn.Module\` and declare network layers in \`__init__\`. The \`forward()\` method defines the execution flow of the forward pass.

#### PyTorch Code Example:
\`\`\`python
import torch
import torch.nn as nn

# Define simple network
class Classifier(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super(Classifier, self).__init__()
        self.linear1 = nn.Linear(input_size, hidden_size)
        self.relu = nn.ReLU()
        self.linear2 = nn.Linear(hidden_size, output_size)
        
    def forward(self, x):
        out = self.linear1(x)
        out = self.relu(out)
        out = self.linear2(out)
        return out

# Initialize network: 4 inputs, 2 outputs
model = Classifier(input_size=4, hidden_size=8, output_size=2)
dummy_x = torch.randn(1, 4)
output = model(dummy_x)
print("Model Output Tensor:", output)
\`\`\`

#### Quiz Questions:
1. **Which PyTorch class must all custom neural network modules inherit from?**
   *   a) nn.Linear
   *   b) nn.Module (Correct)
   *   c) torch.Tensor
2. **What occurs during a forward pass in a neural network?**
   *   a) Weights are updated using gradients
   *   b) Input data passes through layers to compute output predictions (Correct)
   *   c) Data is dropped

#### Interview Questions:
* **How does a PyTorch Tensor differ from a standard NumPy array?**
  *   *Answer:* Tensors support GPU acceleration for fast matrix math and track operations to compute gradients automatically using autograd.
* **Explain the purpose of the super().__init__() call in a PyTorch module.**
  *   *Answer:* It initializes the parent class (\`nn.Module\`), registering the network's layers and parameters so PyTorch can track and update them during training.

#### Summary:
PyTorch modules inherit from \`nn.Module\`, using tensors to execute forward passes and track gradients.
            `,
            exercise: "Build a PyTorch network with 2 hidden layers (sizes 16 and 8) and a single output, and run a forward pass on a random tensor."
          },
          {
            id: "ml-l-4-3",
            title: "Backpropagation & Optimization",
            time: "55 min",
            summary: "Loss calculations, Chain Rule derivatives, backpropagation, and SGD vs Adam optimizers.",
            content: `
### Backpropagation & Optimization

Training a neural network involves finding the weights that minimize the loss function.

#### 1. Backpropagation:
Calculates the gradient of the loss function relative to each weight:
* Employs the mathematical **Chain Rule** to compute derivatives backward from the output layer to the input layer.

#### 2. Optimization (Adam / SGD):
Updates model weights in the direction that minimizes loss.
* **Stochastic Gradient Descent (SGD):** Updates weights using a fixed learning rate:
  $$w = w - \eta \cdot \text{gradient}$$
* **Adam (Adaptive Moment Estimation):** Computes adaptive learning rates for each parameter, accelerating convergence.

#### Training Loop Pipeline:
\`\`\`python
# Concept pipeline:
optimizer.zero_grad()   # Clear old gradients
outputs = model(inputs)  # 1. Forward Pass
loss = criterion(outputs, targets) # 2. Loss Calculation
loss.backward()         # 3. Backpropagation (Compute gradients)
optimizer.step()        # 4. Optimizer Step (Update weights)
\`\`\`

#### Quiz Questions:
1. **What mathematical rule calculates gradients layer-by-layer during backpropagation?**
   *   a) Bayes Theorem
   *   b) Chain Rule (Correct)
   *   c) OLS formula
2. **Why do we invoke optimizer.zero_grad() at the start of each training loop step?**
   *   a) To reset network weights to zero
   *   b) To clear accumulated gradients from the previous step, preventing incorrect weight updates (Correct)
   *   c) To delete logs

#### Interview Questions:
* **Why does the Adam optimizer generally converge faster than standard SGD?**
  *   *Answer:* SGD uses a single, fixed learning rate for all parameters. Adam tracks the first and second moments of the gradients, adapting the learning rate for each parameter individually and accelerating convergence.
* **What is the learning rate, and what happens if it is set too high or too low?**
  *   *Answer:* The learning rate scales optimizer updates. If set too high, optimization can overshoot the minimum and diverge. If set too low, training will be extremely slow, getting trapped in local minima.

#### Summary:
Backpropagation calculates loss gradients using the Chain Rule. Optimizers (like Adam or SGD) update weights to minimize loss.
            `,
            exercise: "Write a conceptual training loop in PyTorch that runs 5 epochs, printing the loss on each step."
          },
          {
            id: "ml-l-4-4",
            title: "Natural Language Processing: Text Vectorization",
            time: "50 min",
            summary: "Text preprocessing, tokenization, stopword removal, bag-of-words, TF-IDF weights, and word embeddings.",
            content: `
### NLP & Text Vectorization

NLP models process and analyze unstructured text data by converting text strings into numeric vectors.

#### 1. Preprocessing Text:
* **Tokenization:** Splits sentences into words.
* **Stopword Removal:** Deletes common words with low informational value (e.g. 'the', 'is').
* **Lemmatization:** Reduces words to their dictionary root form (e.g. 'running' -> 'run').

#### 2. Vectorization Models:
* **CountVectorizer (Bag-of-Words):** Counts word frequencies in documents, ignoring grammar and word order.
* **TF-IDF:** Weights words based on uniqueness across documents, reducing the weight of highly frequent words.
* **Word Embeddings (Word2Vec):** Maps words to dense vectors in a continuous space where semantically similar words are close to each other.

#### Quiz Questions:
1. **Which vectorization model weights words based on their frequency in a document and their uniqueness across all documents?**
   *   a) CountVectorizer
   *   b) TF-IDF (Correct)
   *   c) One-Hot Encoder
2. **What does Word2Vec accomplish?**
   *   a) Word translation
   *   b) Mapping words to dense vectors in a continuous space based on semantic similarity (Correct)
   *   c) Text summarization

#### Interview Questions:
* **What is the limitation of Bag-of-Words and TF-IDF regarding word context?**
  *   *Answer:* Both models are bag-of-words models that ignore word order and grammatical structure. For example, "not bad" and "bad, not" yield similar vector representations despite having different meanings.
* **How do word embeddings capture semantic relationships?**
  *   *Answer:* By training a shallow neural network to predict a word based on its context. Words that appear in similar contexts (e.g. 'king' and 'queen') map to close coordinates in the vector space, capturing semantic relationships.

#### Summary:
NLP preprocesses text via tokenization and lemmatization. Convert text to vectors using TF-IDF or dense word embeddings (Word2Vec).
            `,
            exercise: "Build a TF-IDF vectorizer, extract vocabulary features from three sentences, and print the resulting matrix."
          },
          {
            id: "ml-l-4-5",
            title: "Deploying Models with FastAPI & AI Ethics",
            time: "55 min",
            summary: "Model serialization (joblib), wrapping models in FastAPI endpoints, predictions, and algorithmic bias.",
            content: `
### Deploying ML Models & AI Ethics

Deploying models to production requires saving model weights and exposing them via REST APIs. At the same time, we must ensure our predictions are fair and unbiased.

#### 1. Model Serialization (Saving):
We serialize the trained model to disk as a \`.joblib\` or \`.pkl\` file to load it in production without retraining.
\`\`\`python
import joblib
joblib.dump(model, "classifier.joblib")
\`\`\`

#### 2. Creating API Endpoints (FastAPI):
We wrap our serialized model in a lightweight FastAPI application, allowing software systems to request predictions via HTTP POST requests.

#### 3. AI Ethics & Algorithmic Bias:
* **Algorithmic Bias:** Models learn and amplify biases present in historical training datasets.
* **Mitigations:** Regularly audit training data demographics, check feature importances, and avoid using protected characteristics (race, gender, age) as predictive inputs.

#### Quiz Questions:
1. **Which Python library is commonly used to serialize trained machine learning models to disk?**
   *   a) Matplotlib
   *   b) Joblib (Correct)
   *   c) PyTorch
2. **How can algorithmic bias be introduced into a machine learning model?**
   *   a) Compiler syntax bugs
   *   b) Training models on historical datasets that contain systemic prejudices (Correct)
   *   c) Unstable cloud servers

#### Interview Questions:
* **How would you deploy a machine learning model to serve real-time predictions?**
  *   *Answer:* I would serialize the model using \`joblib\`. Then, I would create a REST API endpoint using FastAPI that loads the model into memory. Finally, I would containerize the application using Docker and deploy it to a cloud service (like AWS ECS).
* **Why can removing protected attributes (like gender or race) fail to eliminate algorithmic bias?**
  *   *Answer:* Other features can act as proxies for the protected attributes. For example, zip codes can correlate with race, and search histories can correlate with gender. Models can reconstruct the excluded demographic signal from these proxy variables, preserving bias.

#### Summary:
Deploy models by serializing them and wrapping them in FastAPI endpoints. Audit systems constantly to detect and mitigate data bias.
            `,
            exercise: "Create a complete FastAPI mock endpoint that accepts user variables, loads a mock array, and returns a JSON prediction."
          }
        ]
      }
    ]
  }
];

export const resourcesList = [
  {
    category: "Machine Learning references",
    items: [
      { name: "Scikit-Learn User Guide", desc: "Tutorials on building and tuning ML models.", link: "https://scikit-learn.org/stable/user_guide.html" },
      { name: "PyTorch Official Documentation", desc: "API reference guides for tensors, linear layers, and autograd.", link: "https://pytorch.org/docs" },
      { name: "FastAPI Reference Manual", desc: "How to declare API paths, request bodies, and run servers.", link: "https://fastapi.tiangolo.com" }
    ]
  }
];

export const glossary = [
  { term: "Eigenvector", def: "A vector that changes only by a scalar factor when a linear transformation is applied." },
  { term: "Sound Null Safety", def: "Dart compile guarantee preventing variable runtime null pointer crashes unless marked nullable." },
  { term: "Ridge Regression", def: "A regression model adding an L2 squared-weight penalty to prevent overfitting." },
  { term: "Gini Impurity", def: "A measure of node purity in decision trees, reaching 0 when all samples belong to one class." },
  { term: "Bagging", def: "Bootstrap Aggregating - training independent parallel estimators on random data subsets to reduce variance." },
  { term: "Boosting", def: "Sequential ensemble training where each new model corrects the errors of its predecessors." },
  { term: "Support Vector", def: "A data point closest to the SVM decision boundary, dictating the hyperplane's position." },
  { term: "ReLU", def: "Rectified Linear Unit - a popular activation function defined as f(x) = max(0, x)." },
  { term: "Backpropagation", def: "A method that calculates loss gradients relative to weights using the Chain Rule." },
  { term: "Algorithmic Bias", def: "When a model learns and amplifies historical prejudices present in training datasets." }
];
