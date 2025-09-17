# Cognitive Skills & Student Performance Dashboard

A comprehensive data science and web development project that analyzes student cognitive skills and predicts academic performance using machine learning.

## Project Structure

\`\`\`
cognitive-skills-dashboard/
├── data/
│   └── students.csv                 # Synthetic student dataset
├── notebooks/
│   ├── analysis.ipynb              # Complete data analysis notebook
│   └── analysis.pdf                # Exported analysis report
├── models/
│   ├── final_model.pkl             # Trained ML model
│   └── model_info.pkl              # Model metadata
├── src/
│   └── predict.py                  # ML prediction script
├── scripts/
│   ├── generate_dataset.py         # Dataset generation
│   └── test_prediction.py          # Prediction testing
├── examples/
│   ├── sample_input.json           # Single prediction example
│   └── batch_input.json            # Batch prediction example
├── dashboard/                      # Next.js dashboard (coming next)
└── README.md
\`\`\`

## Features

### 📊 Data Analysis
- **Synthetic Dataset**: 500 student records with realistic correlations
- **Statistical Analysis**: Correlation analysis, significance testing
- **Machine Learning**: Linear Regression and Random Forest models
- **Student Clustering**: K-means clustering to identify student personas

### 🤖 ML Prediction System
- **Trained Model**: Random Forest Regressor for assessment score prediction
- **Prediction API**: Python script for single and batch predictions
- **Input Validation**: Comprehensive data validation and error handling
- **Feature Importance**: Analysis of which cognitive skills matter most

### 📈 Student Personas
- **High Achievers**: Excellent across all metrics
- **Struggling Learners**: Need intensive support
- **Average Performers**: Balanced profile with improvement potential
- **Focused Specialists**: Strong in specific areas

## Quick Start

### 1. Generate Dataset
\`\`\`bash
python scripts/generate_dataset.py
\`\`\`

### 2. Run Analysis
Open and run `notebooks/analysis.ipynb` to:
- Explore the dataset
- Train ML models
- Identify student personas
- Export trained model

### 3. Make Predictions

**Single Student Prediction:**
\`\`\`bash
python src/predict.py '{"comprehension": 75, "attention": 80, "focus": 78, "retention": 82, "engagement_time": 150}'
\`\`\`

**From JSON File:**
\`\`\`bash
python src/predict.py examples/sample_input.json
\`\`\`

**Batch Prediction:**
\`\`\`bash
python src/predict.py examples/batch_input.json results.json
\`\`\`

### 4. Test the System
\`\`\`bash
python scripts/test_prediction.py
\`\`\`

## Input Format

The prediction system expects JSON input with these fields:

\`\`\`json
{
  "comprehension": 75.5,    // 0-100 scale
  "attention": 82.0,        // 0-100 scale  
  "focus": 78.3,           // 0-100 scale
  "retention": 80.1,       // 0-100 scale
  "engagement_time": 150   // minutes per week (30-300)
}
\`\`\`

## Model Performance

- **Algorithm**: Random Forest Regressor
- **Features**: Comprehension, Attention, Focus, Retention, Engagement Time
- **Metrics**: MAE, RMSE, R² score with residual analysis
- **Feature Importance**: Comprehension and retention are top predictors

## Next Steps

- [ ] Build Next.js dashboard with interactive charts
- [ ] Create API endpoints for real-time predictions
- [ ] Add submission system with GitHub Actions
- [ ] Deploy to production environment

## Requirements

- Python 3.8+
- pandas, numpy, scikit-learn, matplotlib, seaborn
- Jupyter Notebook
- Node.js 18+ (for dashboard)

## License

MIT License - Feel free to use this project for educational purposes.
