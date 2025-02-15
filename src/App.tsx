import React, { useState, useEffect } from 'react';
import { Plane, Sun, Droplets, BadgeDollarSign, Send, Loader2, Sprout, Wind, ThermometerSun, History, FileImage, Search } from 'lucide-react';
import { getFarmingAdvice } from './lib/gemini';
import { identifyPlantDisease } from './lib/plantApi';
import ReactMarkdown from 'react-markdown';

function App() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Array<{ query: string; response: string }>>(
    JSON.parse(localStorage.getItem('queryHistory') || '[]')
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [plantResult, setPlantResult] = useState<any>(null);
  const [plantLoading, setPlantLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('queryHistory', JSON.stringify(history));
  }, [history]);

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image first.");
      return;
    }

    setPlantLoading(true);
    try {
      const result = await identifyPlantDisease(selectedFile);
      setPlantResult(result);
    } catch (error) {
      console.error("Error identifying plant disease:", error);
    } finally {
      setPlantLoading(false);
    }
  };

  const categories = [
    { icon: <Sprout className="text-green-500" />, title: "Crop Planning", description: "Seasonal crop selection and rotation strategies" },
    { icon: <Sun className="text-yellow-500" />, title: "Growth Management", description: "Optimize your crop's growth cycle" },
    { icon: <Droplets className="text-blue-500" />, title: "Irrigation Tips", description: "Smart water management practices" },
    { icon: <Wind className="text-gray-500" />, title: "Pest Control", description: "Natural and chemical pest management" },
    { icon: <ThermometerSun className="text-orange-500" />, title: "Weather Insights", description: "Climate-smart farming decisions" },
    { icon: <BadgeDollarSign className="text-green-500" />, title: "Market Updates", description: "Current prices and market trends" }
  ];

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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map((category, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                {category.icon}
                <h2 className="text-xl font-semibold">{category.title}</h2>
              </div>
              <p className="text-gray-600">{category.description}</p>
            </div>
          ))}
        </div>

        {/* AI Query Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="mb-6">
              <div className="flex flex-col gap-4">
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
                    className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 focus:outline-none flex items-center gap-2 text-lg font-medium"
                  >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                    Ask
                  </button>
                </div>
              </div>
            </form>

            {response && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-xl mb-4">Expert Advice:</h3>
                <ReactMarkdown>{response}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>

        {/* Plant Disease Identification */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Plant Disease Identification</h2>
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <input type="file" accept="image/*" onChange={handleFileChange} className="border border-gray-300 rounded-lg p-2" />
                <button
                  onClick={handleImageUpload}
                  disabled={plantLoading}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2 text-lg font-medium"
                >
                  {plantLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
                  Identify
                </button>
              </div>
            </div>

            {plantResult && (
              <div className="bg-gray-50 rounded-lg p-6 mt-4">
                <h3 className="font-semibold text-xl mb-4">Diagnosis:</h3>
                <pre className="text-sm">{JSON.stringify(plantResult, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
