from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from sklearn.linear_model import LinearRegression

app = Flask(__name__)
CORS(app)

# Generate sample training data
np.random.seed(42)
X_sample = np.random.rand(100, 1) * 10
y_sample = 2.5 * X_sample.flatten() + np.random.randn(100) * 2

# Train initial model
model = LinearRegression()
model.fit(X_sample, y_sample)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        if not data or 'X_test' not in data:
            return jsonify({
                'error': 'Missing required field: X_test'
            }), 400
            
        X_test = np.array(data['X_test']).reshape(-1, 1)
        
        if np.any(X_test < 0) or np.any(X_test > 10):
            return jsonify({
                'error': 'Input values must be between 0 and 10'
            }), 400
            
        predictions = model.predict(X_test).tolist()
        
        return jsonify({
            'predictions': predictions,
            'model_info': {
                'coefficient': float(model.coef_[0]),
                'intercept': float(model.intercept_)
            }
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model_info': {
            'coefficient': float(model.coef_[0]),
            'intercept': float(model.intercept_)
        }
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)