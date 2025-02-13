import React, { useState, useEffect } from 'react';
import { Plane, Sun, Droplets, BadgeDollarSign, Send, Loader2, Sprout, Wind, ThermometerSun, History } from 'lucide-react';
import { getFarmingAdvice } from './lib/gemini';
import ReactMarkdown from 'react-markdown';

function App() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Array<{ query: string; response: string }>>(
    JSON.parse(localStorage.getItem('queryHistory') || '[]')
  );

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

  const categories = [
    { icon: <Sprout className="text-green-500" />, title: "Crop Planning", description: "Seasonal crop selection and rotation strategies" },
    { icon: <Sun className="text-yellow-500" />, title: "Growth Management", description: "Optimize your crop's growth cycle" },
    { icon: <Droplets className="text-blue-500" />, title: "Irrigation Tips", description: "Smart water management practices" },
    { icon: <Wind className="text-gray-500" />, title: "Pest Control", description: "Natural and chemical pest management" },
    { icon: <ThermometerSun className="text-orange-500" />, title: "Weather Insights", description: "Climate-smart farming decisions" },
    { icon: <BadgeDollarSign className="text-green-500" />, title: "Market Updates", description: "Current prices and market trends" }
  ];

  const suggestions = [
    "What crops are best suited for the current season?",
    "How to manage water during drought conditions?",
    "Natural methods to control common crop pests",
    "Best practices for organic fertilization",
    "When is the optimal time to harvest?"
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
                    className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 flex items-center gap-2 text-lg font-medium"
                  >
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <Send className="w-6 h-6" />
                    )}
                    Ask
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setQuery(suggestion)}
                      className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full hover:bg-green-100"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </form>

            {response && (
              <div className="bg-gray-50 rounded-lg p-6">
                   <h3 className="font-semibold text-xl mb-4">Expert Advice:</h3>
                   <ReactMarkdown>{response}</ReactMarkdown>
               </div>
              )}

            {history.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center gap-2 mb-4">
                  <History className="text-gray-500" />
                  <h3 className="text-xl font-semibold">Recent Questions</h3>
                </div>
                <div className="space-y-4">
                  {history.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100"
                         onClick={() => {
                           setQuery(item.query);
                           setResponse(item.response);
                         }}>
                      <p className="font-medium text-green-700">{item.query}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;