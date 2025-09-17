import pickle
import json
import sys
import os
import numpy as np
from pathlib import Path

class StudentPerformancePredictor:
    """
    A class to predict student assessment scores based on cognitive skills.
    """
    
    def __init__(self, model_path='models/final_model.pkl', model_info_path='models/model_info.pkl'):
        """
        Initialize the predictor with the trained model.
        
        Args:
            model_path (str): Path to the trained model pickle file
            model_info_path (str): Path to the model info pickle file
        """
        self.model_path = model_path
        self.model_info_path = model_info_path
        self.model = None
        self.model_info = None
        self.feature_names = None
        
        self.load_model()
    
    def load_model(self):
        """Load the trained model and model information."""
        try:
            # Load the main model
            with open(self.model_path, 'rb') as f:
                self.model = pickle.load(f)
            
            # Load model info if available
            if os.path.exists(self.model_info_path):
                with open(self.model_info_path, 'rb') as f:
                    self.model_info = pickle.load(f)
                    self.feature_names = self.model_info['features']
            else:
                # Default feature names if model_info not available
                self.feature_names = ['comprehension', 'attention', 'focus', 'retention', 'engagement_time']
            
            print(f"Model loaded successfully from {self.model_path}")
            if self.model_info:
                print(f"Model type: {self.model_info['model_type']}")
                print(f"Model performance - R²: {self.model_info['performance']['r2']:.3f}")
                
        except FileNotFoundError as e:
            print(f"Error: Model file not found - {e}")
            sys.exit(1)
        except Exception as e:
            print(f"Error loading model: {e}")
            sys.exit(1)
    
    def validate_input(self, input_data):
        """
        Validate the input data format and values.
        
        Args:
            input_data (dict): Input data containing cognitive skills
            
        Returns:
            bool: True if valid, False otherwise
        """
        required_features = self.feature_names
        
        # Check if all required features are present
        missing_features = [f for f in required_features if f not in input_data]
        if missing_features:
            print(f"Error: Missing required features: {missing_features}")
            return False
        
        # Check if values are numeric and within reasonable range
        for feature in required_features:
            value = input_data[feature]
            
            # Check if numeric
            if not isinstance(value, (int, float)):
                print(f"Error: {feature} must be a number, got {type(value)}")
                return False
            
            # Check range (0-100 for skills, 30-300 for engagement_time)
            if feature == 'engagement_time':
                if not (30 <= value <= 300):
                    print(f"Warning: {feature} value {value} is outside typical range (30-300 minutes)")
            else:
                if not (0 <= value <= 100):
                    print(f"Warning: {feature} value {value} is outside typical range (0-100)")
        
        return True
    
    def predict(self, input_data):
        """
        Make a prediction for a single student.
        
        Args:
            input_data (dict): Dictionary containing cognitive skills data
            
        Returns:
            dict: Prediction results including score and confidence
        """
        if not self.validate_input(input_data):
            return None
        
        try:
            # Prepare features in the correct order
            features = [input_data[feature] for feature in self.feature_names]
            features_array = np.array(features).reshape(1, -1)
            
            # Make prediction
            predicted_score = self.model.predict(features_array)[0]
            
            # Calculate prediction confidence (for Random Forest)
            if hasattr(self.model, 'estimators_'):
                # Get predictions from all trees
                tree_predictions = [tree.predict(features_array)[0] for tree in self.model.estimators_]
                prediction_std = np.std(tree_predictions)
                confidence = max(0, 100 - (prediction_std * 10))  # Simple confidence metric
            else:
                confidence = 85  # Default confidence for other models
            
            # Ensure score is within valid range
            predicted_score = max(0, min(100, predicted_score))
            
            result = {
                'predicted_assessment_score': round(predicted_score, 2),
                'confidence': round(confidence, 1),
                'input_features': input_data,
                'model_info': {
                    'model_type': self.model_info['model_type'] if self.model_info else 'Unknown',
                    'features_used': self.feature_names
                }
            }
            
            return result
            
        except Exception as e:
            print(f"Error making prediction: {e}")
            return None
    
    def predict_batch(self, input_list):
        """
        Make predictions for multiple students.
        
        Args:
            input_list (list): List of dictionaries containing cognitive skills data
            
        Returns:
            list: List of prediction results
        """
        results = []
        for i, input_data in enumerate(input_list):
            print(f"Processing student {i+1}/{len(input_list)}")
            result = self.predict(input_data)
            if result:
                result['student_index'] = i
                results.append(result)
        
        return results
    
    def get_feature_importance(self):
        """
        Get feature importance if available.
        
        Returns:
            dict: Feature importance scores
        """
        if hasattr(self.model, 'feature_importances_'):
            importance_dict = {}
            for feature, importance in zip(self.feature_names, self.model.feature_importances_):
                importance_dict[feature] = round(importance, 4)
            return importance_dict
        else:
            return None

def main():
    """
    Main function to handle command line usage.
    """
    if len(sys.argv) < 2:
        print("Usage: python predict.py <input_json_file> [output_file]")
        print("       python predict.py '{\"comprehension\": 75, \"attention\": 80, ...}'")
        sys.exit(1)
    
    # Initialize predictor
    predictor = StudentPerformancePredictor()
    
    input_arg = sys.argv[1]
    
    try:
        # Check if input is a file path or JSON string
        if os.path.isfile(input_arg):
            # Load from file
            with open(input_arg, 'r') as f:
                input_data = json.load(f)
        else:
            # Parse as JSON string
            input_data = json.loads(input_arg)
        
        # Handle single prediction or batch prediction
        if isinstance(input_data, list):
            # Batch prediction
            results = predictor.predict_batch(input_data)
            print(f"\nBatch prediction completed for {len(results)} students")
        else:
            # Single prediction
            result = predictor.predict(input_data)
            results = [result] if result else []
        
        # Output results
        if len(sys.argv) > 2:
            # Save to output file
            output_file = sys.argv[2]
            with open(output_file, 'w') as f:
                json.dump(results, f, indent=2)
            print(f"Results saved to {output_file}")
        else:
            # Print to console
            print("\nPrediction Results:")
            print("=" * 50)
            for result in results:
                print(json.dumps(result, indent=2))
        
        # Show feature importance
        importance = predictor.get_feature_importance()
        if importance:
            print("\nFeature Importance:")
            print("-" * 30)
            for feature, imp in sorted(importance.items(), key=lambda x: x[1], reverse=True):
                print(f"{feature}: {imp:.4f}")
    
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON format - {e}")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
