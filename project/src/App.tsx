import React, { useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Brain, ArrowRight, Loader2 } from 'lucide-react';

interface PredictionData {
  x: number;
  prediction: number;
}

function App() {
  const [inputValue, setInputValue] = useState<string>('');
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Convert input to number and create test data
      const value = parseFloat(inputValue);
      if (isNaN(value)) {
        throw new Error('Please enter a valid number');
      }

      const response = await axios.post('http://localhost:5000/predict', {
        X_test: [value]
      });

      const newPrediction: PredictionData = {
        x: value,
        prediction: response.data.predictions[0]
      };

      setPredictions(prev => [...prev, newPrediction].sort((a, b) => a.x - b.x));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-8">
          <Brain className="w-8 h-8 mr-3 text-blue-400" />
          <h1 className="text-3xl font-bold">Linear Regression Predictor</h1>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl mb-8">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1">
                <label htmlFor="input" className="block text-sm font-medium mb-2">
                  Enter a number (0-10):
                </label>
                <input
                  id="input"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  placeholder="Enter a value..."
                />
              </div>
              <button
                onClick={handlePredict}
                disabled={loading}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-md flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <ArrowRight className="w-5 h-5 mr-2" />
                )}
                Predict
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-md text-red-300">
                {error}
              </div>
            )}
          </div>

          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Prediction Results</h2>
            {predictions.length > 0 ? (
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={predictions} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="x" 
                      label={{ value: 'Input Value', position: 'bottom', fill: '#9CA3AF' }}
                      stroke="#9CA3AF"
                    />
                    <YAxis 
                      label={{ value: 'Prediction', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
                      stroke="#9CA3AF"
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                      itemStyle={{ color: '#9CA3AF' }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="prediction"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={{ fill: '#3B82F6' }}
                      name="Predicted Value"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                No predictions yet. Enter a value to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;