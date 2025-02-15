import React, { useState, useEffect } from 'react';
import { Plane, Sun, Droplets, BadgeDollarSign, Send, Loader2, Sprout, Wind, ThermometerSun, History, Image } from 'lucide-react';
import { getFarmingAdvice, analyzePlant } from './lib/gemini';
import ReactMarkdown from 'react-markdown';

function App() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Array<{ query: string; response: string }>>(JSON.parse(localStorage.getItem('queryHistory') || '[]'));
  
  // 🌱 Plant Disease Identification State
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [diseaseResults, setDiseaseResults] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    localStorage.setItem('queryHistory', JSON.stringify(history));
  }, [history]);

  // 💡 Handle AI Farming Advice Query
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const advice = await getFarmingAdvice(query);
      setResponse(advice);
      setHistory(prev => [...prev, { query: query.trim(), response: advice }].slice(-5));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🌱 Handle Image Upload for Disease Identification
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setSelectedImage(file);
  };

  // 🔬 Analyze the Uploaded Image
  const handleAnalyzePlant = async () => {
    if (!selectedImage) return;
    
    setAnalyzing(true);
    try {
      const result = await analyzePlant(selectedImage);
      setDiseaseResults(result);
    } catch (error) {
      console.error('Error analyzing plant:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Plane className="w-12 h-12 text-green-600" />
            <h1 className="text-5xl font-bold text-green-800">FarmAdvisor</h1>
          </div>
          <p className="text-xl text-gray-600">Your AI-powered agricultural companion</p>
        </header>

        {/* 🌱 Disease Identification Section */}
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Image className="text-green-600" /> Plant Disease Identification
          </h2>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-4" />
          <button 
            onClick={handleAnalyzePlant} 
            disabled={!selectedImage || analyzing} 
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {analyzing ? <Loader2 className="animate-spin inline-block mr-2" /> : "Analyze Plant"}
          </button>

          {/* Display Disease Identification Results */}
          {diseaseResults && (
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Analysis Results:</h3>
              {diseaseResults.diseases.length > 0 ? (
                <ul className="mt-2">
                  {diseaseResults.diseases.map((disease: any, index: number) => (
                    <li key={index} className="text-red-600 font-medium">
                      - {disease.name} ({Math.round(disease.probability * 100)}% confidence)
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-green-600">No diseases detected.</p>
              )}

              {diseaseResults.healthAssessment && (
                <p className="mt-2 font-medium">🌿 Health Status: {diseaseResults.healthAssessment.status}</p>
              )}
            </div>
          )}
        </div>

        {/* 💡 AI Farming Advice Section */}
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about crops, pests, weather, or market prices..."
                className="flex-1 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                Ask
              </button>
            </div>
          </form>

          {response && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-xl mb-4">Expert Advice:</h3>
              <ReactMarkdown>{response}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* 📜 Recent Queries */}
        {history.length > 0 && (
          <div className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <History className="text-gray-500" />
              <h3 className="text-xl font-semibold">Recent Questions</h3>
            </div>
            <div className="space-y-4">
              {history.map((item, index) => (
                <div 
                  key={index} 
                  className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setQuery(item.query);
                    setResponse(item.response);
                  }}
                >
                  <p className="font-medium text-green-700">{item.query}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
