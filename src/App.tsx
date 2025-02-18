import React, { useEffect, useRef, useState } from 'react';
import { Bot, Send, Sparkles, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

function App() {
  const [messages, setMessages] = useState<Array<{type: 'user' | 'bot', content: string}>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [accentColor, setAccentColor] = useState('indigo');

  const colors = [
    'indigo', 'purple', 'blue', 'emerald', 'rose'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('https://4d7d-34-28-173-220.ngrok-free.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, { type: 'bot', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { type: 'bot', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-gray-900 text-white">
      {/* Header */}
      <div className="fixed top-0 w-full bg-gray-800/50 backdrop-blur-lg border-b border-gray-700 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className={`w-6 h-6 text-${accentColor}-500`} />
            <h1 className="text-xl font-bold">AI Assistant</h1>
          </div>
          <div className="flex items-center gap-2">
            {colors.map(color => (
              <button
                key={color}
                onClick={() => setAccentColor(color)}
                className={`w-6 h-6 rounded-full bg-${color}-500 hover:ring-2 ring-${color}-400 transition-all
                  ${accentColor === color ? 'ring-2 ring-offset-2 ring-offset-gray-900' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="container mx-auto px-4 pt-24 pb-32">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.type === 'bot' && (
                <div className={`w-8 h-8 rounded-lg bg-${accentColor}-500/20 flex items-center justify-center`}>
                  <Bot className={`w-5 h-5 text-${accentColor}-500`} />
                </div>
              )}
              <div
                className={`max-w-[80%] sm:max-w-[70%] px-4 py-3 rounded-2xl ${
                  message.type === 'user'
                    ? `bg-${accentColor}-500 text-white`
                    : 'bg-gray-800'
                } animate-fade-in`}
              >

                <ReactMarkdown className="text-sm sm:text-base prose prose-invert">
                  {message.content}
                </ReactMarkdown>

              </div>
              {message.type === 'user' && (
                <div className={`w-8 h-8 rounded-lg bg-${accentColor}-500 flex items-center justify-center`}>
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg bg-${accentColor}-500/20 flex items-center justify-center`}>
                <Bot className={`w-5 h-5 text-${accentColor}-500`} />
              </div>
              <div className="bg-gray-800 rounded-2xl px-4 py-3 animate-pulse">
                <div className="flex space-x-2">
                  <div className={`w-2 h-2 rounded-full bg-${accentColor}-500 animate-bounce`} style={{ animationDelay: '0ms' }} />
                  <div className={`w-2 h-2 rounded-full bg-${accentColor}-500 animate-bounce`} style={{ animationDelay: '150ms' }} />
                  <div className={`w-2 h-2 rounded-full bg-${accentColor}-500 animate-bounce`} style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800/50 backdrop-blur-lg border-t border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-gray-700 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-600"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`px-4 py-2 rounded-xl bg-${accentColor}-500 text-white flex items-center gap-2 
                disabled:opacity-50 disabled:cursor-not-allowed hover:bg-${accentColor}-600 transition-colors`}
            >
              <Send className="w-5 h-5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;