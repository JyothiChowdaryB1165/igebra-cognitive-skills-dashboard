#!/usr/bin/env python3
"""
Test script for the student performance prediction system.
"""

import sys
import os
import json
from pathlib import Path

# Add src directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

from predict import StudentPerformancePredictor

def test_single_prediction():
    """Test single student prediction."""
    print("Testing Single Student Prediction")
    print("=" * 40)
    
    # Sample student data
    student_data = {
        "comprehension": 75.5,
        "attention": 82.0,
        "focus": 78.3,
        "retention": 80.1,
        "engagement_time": 150
    }
    
    try:
        predictor = StudentPerformancePredictor()
        result = predictor.predict(student_data)
        
        if result:
            print("✅ Prediction successful!")
            print(f"Predicted Assessment Score: {result['predicted_assessment_score']}")
            print(f"Confidence: {result['confidence']}%")
            print(f"Model Type: {result['model_info']['model_type']}")
        else:
            print("❌ Prediction failed!")
            
    except Exception as e:
        print(f"❌ Error: {e}")

def test_batch_prediction():
    """Test batch prediction."""
    print("\nTesting Batch Prediction")
    print("=" * 40)
    
    # Sample batch data
    batch_data = [
        {
            "student_id": "TEST001",
            "comprehension": 85.2,
            "attention": 78.5,
            "focus": 82.1,
            "retention": 79.8,
            "engagement_time": 180
        },
        {
            "student_id": "TEST002",
            "comprehension": 65.3,
            "attention": 70.2,
            "focus": 68.7,
            "retention": 72.1,
            "engagement_time": 120
        }
    ]
    
    try:
        predictor = StudentPerformancePredictor()
        results = predictor.predict_batch(batch_data)
        
        print(f"✅ Batch prediction successful! Processed {len(results)} students")
        for i, result in enumerate(results):
            print(f"Student {i+1}: Score = {result['predicted_assessment_score']}, Confidence = {result['confidence']}%")
            
    except Exception as e:
        print(f"❌ Error: {e}")

def test_feature_importance():
    """Test feature importance extraction."""
    print("\nTesting Feature Importance")
    print("=" * 40)
    
    try:
        predictor = StudentPerformancePredictor()
        importance = predictor.get_feature_importance()
        
        if importance:
            print("✅ Feature importance extracted!")
            print("Top features:")
            for feature, imp in sorted(importance.items(), key=lambda x: x[1], reverse=True):
                print(f"  {feature}: {imp:.4f}")
        else:
            print("⚠️  Feature importance not available for this model type")
            
    except Exception as e:
        print(f"❌ Error: {e}")

def test_input_validation():
    """Test input validation."""
    print("\nTesting Input Validation")
    print("=" * 40)
    
    # Test cases
    test_cases = [
        {
            "name": "Valid input",
            "data": {
                "comprehension": 75.0,
                "attention": 80.0,
                "focus": 78.0,
                "retention": 82.0,
                "engagement_time": 150
            },
            "should_pass": True
        },
        {
            "name": "Missing feature",
            "data": {
                "comprehension": 75.0,
                "attention": 80.0,
                "focus": 78.0,
                # Missing retention and engagement_time
            },
            "should_pass": False
        },
        {
            "name": "Invalid data type",
            "data": {
                "comprehension": "seventy-five",
                "attention": 80.0,
                "focus": 78.0,
                "retention": 82.0,
                "engagement_time": 150
            },
            "should_pass": False
        }
    ]
    
    try:
        predictor = StudentPerformancePredictor()
        
        for test_case in test_cases:
            print(f"\nTesting: {test_case['name']}")
            is_valid = predictor.validate_input(test_case['data'])
            
            if is_valid == test_case['should_pass']:
                print("✅ Validation test passed")
            else:
                print("❌ Validation test failed")
                
    except Exception as e:
        print(f"❌ Error: {e}")

def main():
    """Run all tests."""
    print("Student Performance Prediction System - Test Suite")
    print("=" * 60)
    
    # Check if model exists
    model_path = Path("models/final_model.pkl")
    if not model_path.exists():
        print("❌ Model file not found! Please run the Jupyter notebook first to train the model.")
        print(f"Expected path: {model_path.absolute()}")
        return
    
    # Run tests
    test_single_prediction()
    test_batch_prediction()
    test_feature_importance()
    test_input_validation()
    
    print("\n" + "=" * 60)
    print("Test suite completed!")

if __name__ == "__main__":
    main()
