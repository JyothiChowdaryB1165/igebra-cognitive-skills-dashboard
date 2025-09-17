# 🎓 Cognitive Skills & Student Performance Dashboard  

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-2.8-orange)](https://recharts.org/)
[![Python](https://img.shields.io/badge/Python-3.10-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Jupyter](https://img.shields.io/badge/Jupyter-Notebook-F37626?logo=jupyter&logoColor=white)](https://jupyter.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://igebra-cognitive-skills-dashboard-u.vercel.app/)
[![Author](https://img.shields.io/badge/Made%20with%20❤️%20by-Jyothi%20Chowdary-red)](https://github.com/JyothiChowdaryB1165)

An interactive web application and machine learning project that analyzes student cognitive skills, predicts performance, and identifies learning personas using clustering.  

🌐 **Live Demo:** https://igebra-cognitive-skills-dashboard-u.vercel.app/  
📂 **GitHub Repo:** https://github.com/JyothiChowdaryB1165/igebra-cognitive-skills-dashboard  

---

## ✨ Key Features  

### 🧠 Cognitive & ML Analysis  
- **Synthetic Dataset**: 500+ student records with realistic correlations.  
- **Prediction Models**: Random Forest Regressor (better accuracy than Linear Regression).  
- **Clustering**: K-means algorithm groups students into 4 learning personas.  
- **Feature Importance**: Comprehension & retention are strongest predictors of performance.  

### 📊 Interactive Dashboard (Next.js + Tailwind + Recharts)  
- **Overview Stats**: Average scores, skills, and performance.  
- **Charts**:  
  - Bar → Skill vs. Score  
  - Scatter → Attention vs. Performance  
  - Radar → Student cognitive profile  
- **Student Table**: Searchable & sortable records.  
- **Insights Section**: Key findings and AI-driven observations.  

### 📈 Learning Personas  
- 🌟 **High Achievers**: Excellent across all metrics.  
- ⚖️ **Average Performers**: Balanced profile with improvement potential.  
- 📚 **Focused Specialists**: Strong in specific skills but weaker in others.  
- 🆘 **Struggling Learners**: Need targeted support.  

---

## 🚀 Quick Start  

### 1. Clone & Install  
```bash
git clone https://github.com/JyothiChowdaryB1165/igebra-cognitive-skills-dashboard.git
cd igebra-cognitive-skills-dashboard
npm install
```

### 2. Run Dashboard  
```bash
npm run dev
```
Visit → `http://localhost:3000`  

### 3. Data Analysis (Python ML)  
```bash
# Generate synthetic dataset
python scripts/generate_dataset.py  

# Run Jupyter notebook
jupyter notebook notebooks/analysis.ipynb
```

### 4. Make Predictions  
```bash
python src/predict.py examples/sample_input.json
```

---

## 📁 Project Structure  

```
igebra-cognitive-skills-dashboard/
├── app/              # Next.js routes (dashboard pages)
├── components/       # Reusable UI components
├── examples/         # Example inputs for ML prediction
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── notebooks/        # Jupyter notebooks (analysis & ML)
├── public/           # Static assets
├── scripts/          # Dataset generation & testing
├── src/              # Prediction scripts / API logic
├── styles/           # Tailwind & global CSS
├── package.json      # Dependencies
└── README.md         # Project documentation
```

---

## 📊 Model Performance  

- **Algorithm**: Random Forest Regressor  
- **Metrics**: MAE, RMSE, R² with residual analysis  
- **Top Predictors**: Comprehension, Retention  
- **Clustering**: Distinct personas validated with silhouette score  

---

## 🔎 Insights & Findings  

- Comprehension & Retention most strongly drive academic outcomes.  
- Engagement Time helps but is less impactful than cognitive skills.  
- 4 distinct **learning personas** discovered, useful for targeted interventions.  
- Random Forest outperforms Linear Regression with higher accuracy and generalization.  

---

## 🛠️ Technology Stack  

- **Frontend**: Next.js 15, React 18, TypeScript  
- **Styling**: Tailwind CSS, shadcn/ui  
- **Charts**: Recharts  
- **Machine Learning**: Python (scikit-learn, pandas, numpy, matplotlib, seaborn)  
- **Deployment**: Vercel  

---

## 👨‍💻 Author  

**Jyothi Chowdary**  
- GitHub: https://github.com/JyothiChowdaryB1165  
- Project: Cognitive Skills & Student Performance Dashboard  

---

## 🙏 Acknowledgments  

- **Next.js** team for the framework  
- **Recharts** for visualization components  
- **Tailwind CSS** + **shadcn/ui** for styling  
- **scikit-learn** for machine learning models  
- The **open-source community** for inspiration  
