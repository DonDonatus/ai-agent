'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Menu, Settings, MessageSquare, X, ThumbsUp, ThumbsDown ,Building2 } from 'lucide-react';

// Type definitions
type Theme = 'light' | 'dark' | 'very-dark';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

interface Conversation {
  id: string;
  title: string;
  time: string;
  messages: Message[];
}

interface ChatMessageProps {
  message: Message;
  theme: Theme;
  onFeedback?: (message: Message, feedback: 'helpful' | 'not-helpful') => void;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  onNewConversation: () => void;
  onSelectConversation: (id: string) => void;
  currentConversationId: string | null;
  onShowSettings: () => void;
  theme: Theme;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

interface QuestionSuggestionsProps {
  onSelectQuestion: (question: string) => void;
  conversations: Conversation[];
  theme: Theme;
}

interface ThemeClasses {
  bg: string;
  bgSecondary: string;
  bgTertiary: string;
  border: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  hover: string;
  hoverSecondary: string;
}

// Theme utilities
const getThemeClasses = (theme: Theme): ThemeClasses => {
  switch (theme) {
    case 'very-dark':
      return {
        bg: 'bg-black',
        bgSecondary: 'bg-gray-950',
        bgTertiary: 'bg-gray-900',
        border: 'border-gray-800',
        text: 'text-gray-100',
        textSecondary: 'text-gray-300',
        textMuted: 'text-gray-500',
        hover: 'hover:bg-gray-900',
        hoverSecondary: 'hover:bg-gray-800'
      };
    case 'dark':
      return {
        bg: 'bg-gray-900',
        bgSecondary: 'bg-gray-800',
        bgTertiary: 'bg-gray-700',
        border: 'border-gray-700',
        text: 'text-white',
        textSecondary: 'text-gray-200',
        textMuted: 'text-gray-400',
        hover: 'hover:bg-gray-800',
        hoverSecondary: 'hover:bg-gray-700'
      };
    default:
      return {
        bg: 'bg-gray-50',
        bgSecondary: 'bg-white',
        bgTertiary: 'bg-gray-100',
        border: 'border-gray-200',
        text: 'text-gray-900',
        textSecondary: 'text-gray-700',
        textMuted: 'text-gray-500',
        hover: 'hover:bg-gray-50',
        hoverSecondary: 'hover:bg-gray-100'
      };
  }
};

const SafeImage = ({ src, alt, fallback: Fallback, className }: { src: string; alt: string; fallback: React.ReactNode; className?: string }) => {
  const [error, setError] = useState(false);


  if (error) {
    return <>{Fallback}</>;
  }


  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
};




// Question Suggestions Component
function QuestionSuggestions({ onSelectQuestion, conversations, theme }: QuestionSuggestionsProps) {
  const themeClasses = getThemeClasses(theme);
  
  const getPopularQuestions = () => {
    const allUserMessages = conversations.flatMap(conv => 
      conv.messages.filter(msg => msg.role === 'user')
    );
    
    if (allUserMessages.length > 0) {
      const recentQuestions = allUserMessages
        .slice(-6)
        .map(msg => msg.content)
        .filter(content => content.length > 10);
      
      if (recentQuestions.length >= 3) {
        return recentQuestions.slice(0, 3);
      }
    }
    
    return [
      "What are VB Capital's current investment focus areas?",
      "Can you analyze a startup's investment potential?",
      "What portfolio companies are in the AI sector?"
    ];
  };

  const suggestions = getPopularQuestions();

  return (
    <div className="mb-4">
      <h3 className={`text-sm font-medium mb-3 ${themeClasses.textMuted}`}>
        {conversations.length > 0 ? 'Recent Questions' : 'Popular Questions'}
      </h3>
      <div className="grid grid-cols-1 gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSelectQuestion(suggestion)}
            className={`text-left p-3 border rounded-lg transition-all duration-200 text-sm ${themeClasses.bgSecondary} ${themeClasses.border} hover:bg-emerald-900 hover:border-emerald-600 ${themeClasses.textSecondary} hover:text-emerald-300`}
          >
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
              {suggestion}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Settings Modal Component
function SettingsModal({ isOpen, onClose, theme, onThemeChange }: SettingsModalProps) {
  const themeClasses = getThemeClasses(theme);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className={`rounded-2xl max-w-md w-full p-6 shadow-2xl border ${themeClasses.bgSecondary} ${themeClasses.border} ${themeClasses.text}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${themeClasses.hoverSecondary}`}
          >
            <X className={`w-5 h-5 ${themeClasses.textMuted}`} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${themeClasses.textSecondary}`}>
              Theme
            </label>
            <select 
              value={theme}
              onChange={(e) => onThemeChange(e.target.value as Theme)}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${themeClasses.bgTertiary} ${themeClasses.border} ${themeClasses.text}`}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="very-dark">Very Dark</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${themeClasses.textSecondary}`}>
              Auto-save conversations
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked disabled />
              <div className="w-11 h-6 bg-emerald-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all opacity-75"></div>
            </label>
          </div>
        </div>
        
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${themeClasses.bgTertiary} ${themeClasses.textSecondary} ${themeClasses.hoverSecondary}`}
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ChatMessage Component
function ChatMessage({ message, theme, onFeedback }: ChatMessageProps) {
  const themeClasses = getThemeClasses(theme);
  const isAssistant = message.role === 'assistant';
  
  return (
    <div className={`flex gap-4 mb-6 ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      {isAssistant && (
        <div className="">
          <div className="">
         <SafeImage
            src="vb.png"
            alt="VB"
            className="w-9 h-7 rounded-full"
            fallback={<Building2 className="w-5 h-5 text-white" />}
          />
          </div>
        </div>
      )}
      
      <div className={`max-w-[80%] ${
        isAssistant 
          ? `${themeClasses.bgSecondary} ${themeClasses.border}`
          : 'bg-gradient-to-r from-emerald-500 to-emerald-600 border-emerald-500'
      } rounded-2xl px-4 py-3 shadow-sm border`}>
        <div className={`text-sm ${
          isAssistant 
            ? themeClasses.textSecondary
            : 'text-white'
        }`}>
          {message.content}
        </div>
        {message.timestamp && (
          <div className={`text-xs mt-2 ${
            isAssistant 
              ? themeClasses.textMuted
              : 'text-emerald-100'
          }`}>
            {message.timestamp}
          </div>
        )}
        {isAssistant && onFeedback && (
          <div className="flex gap-2 mt-2">
            <button 
              onClick={() => onFeedback(message, 'helpful')}
              className={`p-1 rounded ${themeClasses.hoverSecondary}`}
              aria-label="Helpful"
            >
              <ThumbsUp className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onFeedback(message, 'not-helpful')}
              className={`p-1 rounded ${themeClasses.hoverSecondary}`}
              aria-label="Not helpful"
            >
              <ThumbsDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      
      {!isAssistant && (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center flex-shrink-0 shadow-lg">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
}

// Typing Indicator Component
function TypingIndicator({ theme }: { theme: Theme }) {
  const themeClasses = getThemeClasses(theme);
  
  return (
    <div className="flex gap-4 mb-6">
      <div className="">
         <SafeImage
            src="vb.png"
            alt="VB"
            className="w-9 h-7 rounded-full"
            fallback={<Building2 className="w-5 h-5 text-white" />}
          />
      </div>
      <div className={`rounded-2xl px-4 py-3 shadow-sm border ${themeClasses.bgSecondary} ${themeClasses.border}`}>
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}

// Sidebar Component
function Sidebar({ isOpen, onClose, conversations, onNewConversation, onSelectConversation, currentConversationId, onShowSettings, theme }: SidebarProps) {
  const themeClasses = getThemeClasses(theme);
  
  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-80 shadow-xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} border-r ${themeClasses.bgSecondary} ${themeClasses.border}`}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className={`p-6 border-b ${themeClasses.border}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <SafeImage
                  src="vb.png"
                  alt="VB"
                  className="w-9 h-7 rounded-full"
                  fallback={<Building2 className="w-5 h-5 text-white" />}
                />
              <div>
                <h2 className={`font-semibold ${themeClasses.text}`}>
                  VB Capital AI
                </h2>
                <p className={`text-xs ${themeClasses.textMuted}`}>
                  Virtual Assistant
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${themeClasses.hoverSecondary}`}
            >
              <X className={`w-5 h-5 ${themeClasses.textMuted}`} />
            </button>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button 
            onClick={onNewConversation}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <MessageSquare className="w-4 h-4" />
            New Conversation
          </button>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto px-4">
          {conversations.length > 0 && (
            <>
              <h3 className={`text-sm font-medium mb-3 ${themeClasses.textMuted}`}>
                Recent Conversations
              </h3>
              <div className="space-y-2">
                {conversations.map((conv) => (
                  <div 
                    key={conv.id} 
                    onClick={() => onSelectConversation(conv.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      currentConversationId === conv.id 
                        ? 'bg-emerald-900 border border-emerald-600'
                        : themeClasses.hover
                    }`}
                  >
                    <div className={`font-medium text-sm truncate ${themeClasses.textSecondary}`}>
                      {conv.title}
                    </div>
                    <div className={`text-xs mt-1 ${themeClasses.textMuted}`}>
                      {conv.time}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Settings */}
        <div className={`p-4 border-t ${themeClasses.border}`}>
          <button 
            onClick={onShowSettings}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${themeClasses.textMuted} ${themeClasses.hoverSecondary}`}
          >
            <Settings className="w-4 h-4" />
            <span className="text-sm">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Chat Interface
export default function ChatPage() {
  const [theme, setTheme] = useState<Theme>('light');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant', 
    content: 'Hello! I\'m your VB Capital AI Assistant. I can help with investment analysis, portfolio insights, and market trends. How can I assist you today?',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const themeClasses = getThemeClasses(theme);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, isLoading]);

  const generateConversationTitle = (userMessage: string): string => {
    const words = userMessage.split(' ').slice(0, 4).join(' ');
    return words.length > 30 ? words.substring(0, 30) + '...' : words;
  };

  const createNewConversation = (): void => {
    setCurrentConversationId(null);
    setMessages([{
      role: 'assistant', 
      content: 'Hello! I\'m your VB Capital AI Assistant. I can help with investment analysis, portfolio insights, and market trends. How can I assist you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setSidebarOpen(false);
  };

  const selectConversation = (id: string): void => {
    const conversation = conversations.find(conv => conv.id === id);
    if (conversation) {
      setCurrentConversationId(id);
      setMessages(conversation.messages);
      setSidebarOpen(false);
    }
  };

  const updateConversationMessages = (id: string, newMessages: Message[]): void => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === id 
          ? { ...conv, messages: newMessages, time: 'Just now' }
          : conv
      )
    );
  };

  const sendFeedback = (message: Message, feedback: 'helpful' | 'not-helpful'): void => {
    // In a real app, you would send this to your backend for analytics
    console.log(`Feedback: ${feedback} for message:`, message);
  };

  const sendMessage = async (messageText?: string): Promise<void> => {
    const messageToSend = messageText || input;
    if (!messageToSend.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: messageToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      const aiResponse: Message = {
        role: 'assistant',
        content: data.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const finalMessages = [...newMessages, aiResponse];
      setMessages(finalMessages);
      
      if (currentConversationId !== null) {
        updateConversationMessages(currentConversationId, finalMessages);
      } else {
        const newConvId = crypto.randomUUID();
        const newConversation: Conversation = {
          id: newConvId,
          title: generateConversationTitle(messageToSend),
          time: 'Just now',
          messages: finalMessages
        };
        setConversations(prev => [newConversation, ...prev.slice(0, 9)]);
        setCurrentConversationId(newConvId);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorResponse: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...newMessages, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionSelect = (question: string): void => {
    sendMessage(question);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setInput(e.target.value);
  };

  const handleThemeChange = (newTheme: Theme): void => {
    setTheme(newTheme);
  };

  return (
    <div className={`h-screen flex ${themeClasses.bg}`}>
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        conversations={conversations}
        onNewConversation={createNewConversation}
        onSelectConversation={selectConversation}
        currentConversationId={currentConversationId}
        onShowSettings={() => setShowSettings(true)}
        theme={theme}
      />
      
      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)}
        theme={theme}
        onThemeChange={handleThemeChange}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className={`border-b px-6 py-4 flex items-center justify-between shadow-sm ${themeClasses.bgSecondary} ${themeClasses.border}`}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className={`p-2 rounded-lg transition-colors ${themeClasses.hoverSecondary}`}
              type="button"
            >
              <Menu className={`w-5 h-5 ${themeClasses.textMuted}`} />
            </button>
            <div className="flex items-center gap-3">
               <SafeImage
                  src="vb.png"
                  alt="VB"
                  className="w-9 h-7 rounded-full"
                  fallback={<Building2 className="w-5 h-5 text-white" />}
                />
              <div>
                <h1 className={`font-semibold ${themeClasses.text}`}>
                  VB Capital Assistant
                </h1>
                <div className="text-sm text-green-600 flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Online
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-0">
          <div className="max-w-4xl mx-auto">
            {messages.map((msg, i) => (
              <ChatMessage 
                key={i}
                message={msg}
                theme={theme}
                onFeedback={msg.role === 'assistant' ? sendFeedback : undefined}
              />
            ))}
            {isLoading && <TypingIndicator theme={theme} />}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className={`border-t px-6 py-4 ${themeClasses.bgSecondary} ${themeClasses.border}`}>
          <div className="max-w-4xl mx-auto">
            {/* Question Suggestions */}
            {messages.length <= 1 && (
              <QuestionSuggestions 
                onSelectQuestion={handleQuestionSelect} 
                conversations={conversations}
                theme={theme}
              />
            )}
            
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  className={`w-full p-4 pr-12 border rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors ${themeClasses.bgTertiary} ${themeClasses.border} ${themeClasses.text} placeholder-gray-500 ${themeClasses.hover}`}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message... (Press Enter to send)"
                  rows={1}
                  style={{ minHeight: '56px', maxHeight: '120px' }}
                  disabled={isLoading}
                  autoFocus
                />
              </div>
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 text-white p-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center"
                type="button"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className={`text-xs mt-2 text-center ${themeClasses.textMuted}`}>
              VB Capital AI can make mistakes. Please verify important investment information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}