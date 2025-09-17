import pandas as pd
import numpy as np
import os
from datetime import datetime

# Set random seed for reproducibility
np.random.seed(42)

def generate_student_dataset(n_students=500):
    """Generate synthetic student dataset with realistic correlations"""
    
    # Generate student IDs and names
    student_ids = [f"STU{str(i).zfill(4)}" for i in range(1, n_students + 1)]
    
    # Generate names (simple combination of first and last names)
    first_names = ["Alex", "Jordan", "Taylor", "Casey", "Morgan", "Riley", "Avery", "Quinn", 
                   "Blake", "Cameron", "Drew", "Emery", "Finley", "Harper", "Hayden", "Jamie",
                   "Kendall", "Logan", "Parker", "Peyton", "Reese", "Sage", "Skylar", "Tatum"]
    last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
                  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
                  "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White"]
    
    names = [f"{np.random.choice(first_names)} {np.random.choice(last_names)}" for _ in range(n_students)]
    
    # Generate classes (A, B, C with different performance distributions)
    classes = np.random.choice(['A', 'B', 'C'], n_students, p=[0.3, 0.4, 0.3])
    
    # Generate correlated cognitive skills
    # Base cognitive skills with some correlation structure
    base_ability = np.random.normal(50, 15, n_students)
    base_ability = np.clip(base_ability, 10, 90)
    
    # Generate individual skills with correlations
    comprehension = base_ability + np.random.normal(0, 8, n_students)
    attention = base_ability + np.random.normal(0, 10, n_students)
    focus = 0.7 * attention + np.random.normal(0, 8, n_students)
    retention = 0.6 * comprehension + 0.4 * focus + np.random.normal(0, 6, n_students)
    
    # Clip all skills to 0-100 range
    comprehension = np.clip(comprehension, 0, 100)
    attention = np.clip(attention, 0, 100)
    focus = np.clip(focus, 0, 100)
    retention = np.clip(retention, 0, 100)
    
    # Generate assessment scores based on cognitive skills with class effects
    class_effects = {'A': 5, 'B': 0, 'C': -3}
    class_bonus = [class_effects[c] for c in classes]
    
    assessment_score = (0.3 * comprehension + 0.25 * attention + 
                       0.25 * focus + 0.2 * retention + 
                       np.array(class_bonus) + np.random.normal(0, 5, n_students))
    assessment_score = np.clip(assessment_score, 0, 100)
    
    # Generate engagement time (correlated with performance but with noise)
    engagement_time = (assessment_score * 2 + np.random.normal(0, 20, n_students))
    engagement_time = np.clip(engagement_time, 30, 300)  # 30 minutes to 5 hours per week
    
    # Create DataFrame
    df = pd.DataFrame({
        'student_id': student_ids,
        'name': names,
        'class': classes,
        'comprehension': np.round(comprehension, 1),
        'attention': np.round(attention, 1),
        'focus': np.round(focus, 1),
        'retention': np.round(retention, 1),
        'assessment_score': np.round(assessment_score, 1),
        'engagement_time': np.round(engagement_time, 0).astype(int)
    })
    
    return df

def main():
    """Generate and save the student dataset"""
    print("Generating synthetic student dataset...")
    
    # Create data directory if it doesn't exist
    os.makedirs('data', exist_ok=True)
    
    # Generate dataset
    df = generate_student_dataset(500)
    
    # Save to CSV
    df.to_csv('data/students.csv', index=False)
    
    print(f"Dataset generated successfully!")
    print(f"Shape: {df.shape}")
    print(f"Saved to: data/students.csv")
    print("\nFirst 5 rows:")
    print(df.head())
    print("\nDataset summary:")
    print(df.describe())

if __name__ == "__main__":
    main()
