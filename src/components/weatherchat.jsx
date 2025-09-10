import React, { useState, useRef, useEffect } from 'react';
import ThemeBtn from "./themebutton";

const WeatherChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;


    const userMessage = {
      role: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);
    
    try {
      console.log('Sending request to API...');
      
      const requestBody = {
        messages: [
          {
            role: "user",
            content: currentInput
          }
        ],
        runId: "weatherAgent",
        maxRetries: 2,
        maxSteps: 5,
        temperature: 0.5,
        topP: 1,
        runtimeContext: {},
        threadId: 2,
        resourceId: "weatherAgent"
      };
      
      console.log('Request body:', JSON.stringify(requestBody, null, 2));
      
      const response = await fetch(
        'https://millions-screeching-vultur.mastra.cloud/api/agents/weatherAgent/stream',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-mastra-dev-playground': 'true'
          },
          body: JSON.stringify(requestBody)
        }
      );

      console.log(" Response received:", response);
      
      if (!response.ok) {
        throw new Error(`HTTP err or! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        console.log('Received chunk:', chunk);
        
        // Parse the streaming response format
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.trim()) {
            // Check if line starts with "0:" which contains the actual text content
            if (line.startsWith('0:')) {
              // Extract the text after "0:"
              const text = line.substring(2);
              // Remove quotes if present and unescape
              const cleanText = text.replace(/^"(.*)"$/, '$1');
              assistantResponse += cleanText;
            }
          }
        }
      }

      // Convert literal \n to actual newlines and clean up the response
      const cleanedResponse = assistantResponse
        .replace(/\\n/g, '\n')  // Convert literal \n to actual newlines
        .replace(/\\"/g, '"')   // Convert escaped quotes
        .replace(/\\\\/g, '\\') // Convert escaped backslashes
        .trim();                // Remove leading/trailing whitespace

      const assistantMessage = {
        role: 'assistant',
        content: cleanedResponse || 'I received your message but got an empty response.',
        timestamp: new Date().toLocaleTimeString()
      };
          
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Detailed error:', error);
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);

      let errorContent = 'Sorry, I encountered an error while processing your request.';

      // if (error.message.includes('Failed to fetch')) {
      //   errorContent = 'Unable to connect to the weather service. This might be due to network issues or CORS restrictions. Please check your internet connection and try again.';
      // } else if (error.message.includes('HTTP error')) {
      //   errorContent = `Server error: ${error.message}. Please try again later.`;
      // }
      
      const errorMessage = {
        role: 'assistant',
        content: errorContent,
        timestamp: new Date().toLocaleTimeString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto   dark:bg-gray-900">
      {/* Header */}
      <div className="bg-blue-600 dark:bg-blue-800 text-white p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Weather Chat Assistant</h1>
          <div className="flex items-center space-x-3">
          
            <button
              onClick={clearChat}
              className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded text-sm"
            >
              Clear Chat
            </button>
          </div>
           <p className="text-sm mr-2">Toggle Theme</p>
            <ThemeBtn />
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            <p className="text-lg">Welcome to Weather Chat!</p>
            <p>Ask me about the weather in any city.</p>
          </div>
        )}
        
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : message.isError
                  ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700'
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.role === 'user' ? 'text-blue-200' : 'text-gray-500'
              }`}>
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span className="text-gray-600 dark:text-gray-400">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

    
      <div className="border-t border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-4">
        <div className="flex space-x-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about the weather..."
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            rows="1"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeatherChat;
