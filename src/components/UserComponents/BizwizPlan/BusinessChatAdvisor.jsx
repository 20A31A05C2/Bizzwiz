import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { 
  IoChatbubbleEllipsesOutline, 
  IoSendOutline,
  IoArrowBackOutline,
  IoWalletOutline
} from 'react-icons/io5';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next'; // Import translation hook

import SideNavbar from '../userlayout/sidebar';
import ApiService from '../../../Apiservice';
import Background from "../../../assets/background.png";
import LoadingPage from '../userlayout/loader';
import ConversationHistory from './ConversationHistory';

// Shared Components - Memoized for better performance
const LoadingSpinner = memo(({ size = 'default', className = '' }) => (
  <div className={`border-2 border-t-transparent border-cyan-500 rounded-full animate-spin ${
    size === 'small' ? 'w-4 h-4 sm:w-5 sm:h-5' : 'w-7 h-7 sm:w-8 sm:h-8'
  } ${className}`}></div>
));

const TypingIndicator = memo(() => (
  <div className="flex space-x-2">
    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full animate-bounce-slow"></div>
    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full animate-bounce-medium"></div>
    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full animate-bounce-fast"></div>
  </div>
));

// Optimized message bubble with better text alignment
const MessageBubble = memo(({ message, role, timestamp }) => {
  const { t } = useTranslation();
  
  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
      <div 
        className={`max-w-[85%] sm:max-w-[75%] px-3 sm:px-4 py-2 sm:py-3 rounded-2xl shadow-md ${
          role === 'user' 
            ? 'bg-gradient-to-r from-purple-600 to-indigo-500 text-white animate-slide-left hover:shadow-purple-500/20 hover:shadow-md transition-all' 
            : 'bg-gray-800 text-white animate-slide-right hover:shadow-cyan-500/20 hover:shadow-md transition-all'
        }`}
      >
        <div className="text-xs sm:text-sm md:text-base break-words whitespace-pre-wrap">{message}</div>
        <div className="text-[10px] sm:text-xs opacity-60 mt-1 text-right">
          {new Date(timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </div>
      </div>
    </div>
  );
});

// Active Chat Component - Simplified and optimized
const ActiveChat = memo(({ 
  conversations, 
  isTyping, 
  message, 
  loading, 
  messagesEndRef, 
  setMessage, 
  handleKeyPress, 
  handleSendMessage, 
  chatHistory, 
  setShowHistory,
  userCredits,
  chatCreditCost
}) => {
  const { t } = useTranslation();
  
  const insufficientCredits = userCredits !== null && 
                             chatCreditCost !== null && 
                             userCredits < chatCreditCost;
  
  return (
    <>
      {/* Chat container with fixed height and optimized scrolling */}
      <div 
        className="flex-grow overflow-y-auto hide-scrollbar pb-4 pr-2 rounded-lg border border-gray-800"
        style={{ maxHeight: 'calc(100vh - 140px)' }}
      >
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-6 sm:py-10 animate-fade-in-up">
            <div className="p-3 sm:p-4 bg-purple-600/20 rounded-full mb-4 sm:mb-6 animate-float-bounce">
              <IoChatbubbleEllipsesOutline size={32} className="sm:hidden text-purple-300" />
              <IoChatbubbleEllipsesOutline size={48} className="hidden sm:block text-purple-300" />
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3 animate-shimmer">
              {t('businessChat.title', 'BizzPlan AI')}
            </h3>
            <p className="text-gray-300 max-w-md px-4 text-xs sm:text-sm">
              {t('businessChat.welcome', 'Ask me questions about marketing, branding, business strategy, and growth. I\'m here to help you succeed!')}
            </p>
            
            {chatHistory.length > 0 && (
              <button
                onClick={() => setShowHistory(true)}
                className="mt-4 sm:mt-6 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 text-white text-xs sm:text-sm rounded-lg hover:bg-white/20 transition-all flex items-center"
              >
                <IoChatbubbleEllipsesOutline size={14} className="mr-1 sm:mr-2" />
                {t('businessChat.viewPreviousConversations', 'View Previous Conversations')}
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4 p-3 sm:p-4">
            {conversations.map((msg, index) => (
              <MessageBubble 
                key={index}
                message={msg.content}
                role={msg.role}
                timestamp={msg.timestamp}
              />
            ))}
            {isTyping && (
              <div className="flex justify-start animate-fade-in-up">
                <div className="max-w-[75%] px-3 sm:px-4 py-2 sm:py-3 rounded-2xl bg-gray-800 text-white animate-slide-right">
                  <TypingIndicator />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Input area - optimized */}
      <div className="mt-3 sm:mt-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="bg-white bg-opacity-10 rounded-full flex items-center p-1 pl-3 sm:pl-4 md:pl-6 border border-gray-700 focus-within:border-purple-500/50 hover:shadow-md focus-within:shadow-purple-500/20">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('businessChat.inputPlaceholder', 'Ask about business strategy, marketing, or growth...')}
            className="flex-grow bg-transparent text-white outline-none text-xs sm:text-sm md:text-base py-1.5 sm:py-2"
            disabled={loading || isTyping || insufficientCredits}
            aria-label={t('businessChat.messageInput', 'Message input')}
          />
          <button
            onClick={handleSendMessage}
            disabled={loading || !message.trim() || isTyping || insufficientCredits}
            className={`${
              loading || !message.trim() || isTyping || insufficientCredits
                ? 'bg-gray-700 text-gray-400' 
                : 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:shadow-md hover:shadow-purple-500/20'
            } px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium transition-all ml-2 flex items-center justify-center min-w-[50px] sm:min-w-[60px]`}
            aria-label={t('businessChat.sendMessage', 'Send message')}
          >
            {loading ? (
              <LoadingSpinner size="small" />
            ) : (
              <>
                <span className="hidden sm:inline text-xs sm:text-sm mr-1">{t('businessChat.send', 'Send')}</span>
                <IoSendOutline size={14} className="sm:hidden" />
                <IoSendOutline size={16} className="hidden sm:block" />
              </>
            )}
          </button>
        </div>
        {insufficientCredits && (
          <div className="mt-2 text-red-400 text-xs sm:text-sm text-center animate-fade-in-up">
            {t('businessChat.insufficientCredits', 'Insufficient credits. You need ${{cost}} to send a message.', { cost: chatCreditCost })}
          </div>
        )}
      </div>
    </>
  );
});

// Main component - Optimized for performance
const BusinessChatAdvisor = () => {
  const { t } = useTranslation();
  
  // State variables with optimized defaults
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  
  // Credit management state
  const [userCredits, setUserCredits] = useState(null);
  const [chatCreditCost, setChatCreditCost] = useState(null);
  
  const messagesEndRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem("user") || '{"id":null}');
  const userId = currentUser?.id;
  
  // Enhanced date formatter
  const formatDate = useCallback((dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return t('businessChat.invalidDate', 'Invalid date');
    }
  }, [t]);

  // Optimized scroll function - smoother scrolling
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, []);

  // Optimized API calls - batched for better performance
  const fetchCreditsInfo = useCallback(async () => {
    if (!userId) return;
    
    try {
      // Use Promise.all to make parallel API calls
      const [userResponse, settingsResponse] = await Promise.all([
        ApiService("/getcredits", "GET"),
        ApiService("/api-settings", "GET")
      ]);
      
      if (userResponse.success || userResponse.status === 200) {
        setUserCredits(userResponse.credits);
      }
      
      if (settingsResponse.success || settingsResponse.status === 200) {
        const cost = settingsResponse.bizzplan_credits_cost || 
                    (settingsResponse.settings && settingsResponse.settings.bizzplan_credits_cost);
        
        if (cost !== undefined) {
          setChatCreditCost(cost);
        }
      }
    } catch (error) {
      // Silent error handling - don't show toast for background operations
      console.error("Failed to fetch credit info:", error);
    }
  }, [userId]);

  // Optimized chat history fetch
  const fetchChatHistory = useCallback(async () => {
    if (!userId) {
      setInitialLoading(false);
      return;
    }
    
    setLoadingHistory(true);
    try {
      const response = await ApiService("/chat-history", "GET");
      
      if (response.success) {
        // Process the data with optimized mapping
        const processedHistory = Array.isArray(response.data) 
          ? response.data.map(conv => {
              const firstUserMessage = conv.messages.find(msg => msg.role === 'user');
              
              return {
                id: conv.conversation_id,
                title: '',
                firstMessage: firstUserMessage ? firstUserMessage.content : '',
                lastMessageDate: conv.updated_at,
                messages: conv.messages.map(msg => ({
                  content: msg.content,
                  role: msg.role,
                  timestamp: msg.created_at
                }))
              };
            })
          : [];
        
        setChatHistory(processedHistory);
      } else {
        toast.error(t('businessChat.errors.chatHistoryFailed', 'Failed to load chat history'));
      }
    } catch (error) {
      toast.error(t('businessChat.errors.chatHistoryFailed', 'Failed to load chat history'));
    } finally {
      setLoadingHistory(false);
      setInitialLoading(false);
    }
  }, [userId, t]);

  // Load data on component mount - optimized with better error handling
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        if (userId) {
          await Promise.all([fetchChatHistory(), fetchCreditsInfo()]);
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setInitialLoading(false);
      }
    };
    
    loadInitialData();
  }, [userId, fetchChatHistory, fetchCreditsInfo]);

  // Scroll to bottom when conversations update
  useEffect(() => {
    scrollToBottom();
  }, [conversations, scrollToBottom]);

  // Optimized typing simulation - more responsive
  const simulateTyping = useCallback((text, callback) => {
    setIsTyping(true);
    
    // Calculate typing time based on message length, capped for better UX
    const typingTime = Math.min(800 + text.length * 15, 2500);
    
    const timeout = setTimeout(() => {
      setIsTyping(false);
      callback();
    }, typingTime);
    
    return () => clearTimeout(timeout);
  }, []);

  // Load conversation - optimized
  const loadConversation = useCallback((conversationId) => {
    const selectedConversation = chatHistory.find(conv => conv.id === conversationId);
    if (selectedConversation) {
      setConversations(selectedConversation.messages);
      setCurrentConversationId(conversationId);
      setShowHistory(false);
    }
  }, [chatHistory]);

  // Start new conversation - simplified
  const startNewConversation = useCallback(() => {
    setConversations([]);
    setCurrentConversationId(null);
    setShowHistory(false);
  }, []);

  // Send message - optimized with better error handling
  const handleSendMessage = useCallback(async () => {
    if (!message.trim()) return;
    
    // Credit check
    if (userCredits !== null && chatCreditCost !== null && userCredits < chatCreditCost) {
      toast.error(t('businessChat.errors.insufficientCredits', 'Insufficient credits. You need ${{cost}} to send a message.', { cost: chatCreditCost }));
      return;
    }
    
    // Prepare user message
    const userMessage = {
      content: message,
      role: 'user',
      timestamp: new Date().toISOString()
    };
    
    // Better UX: Clear input immediately
    const sentMessage = message;
    setMessage('');
    
    // Update UI immediately
    setConversations(prev => [...prev, userMessage]);
    setLoading(true);
    
    try {
      const response = await ApiService("/business-chat", "POST", {
        message: sentMessage,
        user_id: userId,
        conversation_id: currentConversationId
      });
      
      if (response.success) {
        // Update credits if returned
        if (response.credits_remaining !== undefined) {
          setUserCredits(response.credits_remaining);
        } else {
          fetchCreditsInfo();
        }
        
        // Prepare bot response
        const botResponse = {
          content: response.message,
          role: 'assistant',
          timestamp: new Date().toISOString()
        };
        
        // Set conversation ID if new
        if (!currentConversationId && response.conversation_id) {
          setCurrentConversationId(response.conversation_id);
        }
        
        // Simulate typing with better timing
        simulateTyping(response.message, () => {
          setConversations(prev => [...prev, botResponse]);
          
          // Update history for new conversations
          if (!currentConversationId && response.conversation_id) {
            fetchChatHistory();
          }
        });
      } else {
        // Handle error response
        toast.error(response.message || t('businessChat.errors.responseFailure', 'Failed to get response'));
        simulateTyping(t('businessChat.errors.processingError', "I'm sorry, I couldn't process your request at this time."), () => {
          const errorResponse = {
            content: t('businessChat.errors.processingError', "I'm sorry, I couldn't process your request at this time."),
            role: 'assistant',
            timestamp: new Date().toISOString()
          };
          setConversations(prev => [...prev, errorResponse]);
        });
      }
    } catch (error) {
      // Better error handling
      const errorMessage = t('businessChat.errors.connectionError', "I'm having trouble connecting. Please try again in a moment.");
      simulateTyping(errorMessage, () => {
        const errorResponse = {
          content: errorMessage,
          role: 'assistant',
          timestamp: new Date().toISOString()
        };
        setConversations(prev => [...prev, errorResponse]);
      });
    } finally {
      setLoading(false);
    }
  }, [message, userId, currentConversationId, simulateTyping, fetchChatHistory, fetchCreditsInfo, userCredits, chatCreditCost, t]);

  // Handle key press - simplified
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  // Delete conversation - optimized
  const deleteConversation = useCallback(async (conversationId, e) => {
    e.stopPropagation();
    
    // Confirm deletion
    if (!window.confirm(t('businessChat.confirmDelete', 'Are you sure you want to delete this conversation?'))) {
      return;
    }
    
    try {
      const response = await ApiService("/delete-conversation", "POST", {
        conversation_id: conversationId,
        user_id: userId
      });
      
      if (response.success) {
        setChatHistory(prev => prev.filter(conv => conv.id !== conversationId));
        toast.success(t('businessChat.deleteSuccess', 'Conversation deleted'));
        
        // Reset if current conversation was deleted
        if (currentConversationId === conversationId) {
          startNewConversation();
        }
      } else {
        toast.error(response.message || t('businessChat.errors.deleteFailed', 'Failed to delete conversation'));
      }
    } catch (error) {
      toast.error(t('businessChat.errors.deleteFailed', 'Failed to delete conversation'));
    }
  }, [userId, currentConversationId, startNewConversation, t]);

  // Toggle history view - simplified
  const toggleHistory = useCallback(() => {
    setShowHistory(prev => !prev);
  }, []);

  // Show loading during initial data fetch
  if (initialLoading) {
    return <LoadingPage name={t('businessChat.loading', 'Loading BizzPlan AI...')} />;
  }

  return (
    <div className="flex min-h-screen bg-[#18001F] overflow-hidden">
      {/* Optimized background with lower opacity and reduced animation */}
      <div className="fixed inset-0 z-0 w-full h-full bg-cover bg-center opacity-90" 
           style={{ backgroundImage: `url(${Background})` }}></div>
      
      <SideNavbar />
      
      <div className="relative flex-1 w-full min-h-screen z-10 overflow-hidden">
        {/* Simplified background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-full h-full opacity-60">
            <div className="absolute top-0 right-0 w-2/3 h-2/3">
              <div className="absolute rounded-full w-96 h-96 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-20 blur-3xl"></div>
            </div>
            <div className="absolute top-1/3 left-0 w-2/3 h-2/3">
              <div className="absolute rounded-full w-96 h-96 bg-gradient-to-r from-cyan-500 to-purple-600 opacity-20 blur-3xl"></div>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="relative z-20 flex flex-col h-screen px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          <div className="flex flex-col max-w-4xl mx-auto w-full h-full">
            {/* Header with controls - fixed positioning for better text alignment */}
            <div className="flex items-center justify-between mb-4 mt-4 sm:mt-0">
              <div className="flex items-center">
                {showHistory && (
                  <button 
                    onClick={() => setShowHistory(false)}
                    className="mr-2 sm:mr-3 p-1.5 sm:p-2 rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors"
                    aria-label={t('businessChat.back', 'Back')}
                  >
                    <IoArrowBackOutline size={16} className="sm:hidden" />
                    <IoArrowBackOutline size={18} className="hidden sm:block" />
                  </button>
                )}
                <h1 className="text-base pl-16 sm:text-lg md:text-xl font-bold text-white text-center sm:text-left">
                  {showHistory ? t('businessChat.chatHistory', 'Chat History') : t('businessChat.title', 'BizzPlan AI')}
                </h1>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Optimized credit display - better alignment for mobile */}
                <div className="flex items-center px-3 py-1 sm:px-4 sm:py-2 bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg">
                  <IoWalletOutline size={16} className="text-cyan-400 mr-1 sm:mr-2" />
                  <span className="text-white text-xs sm:text-sm">
                    <span className="hidden sm:inline">{t('businessChat.credits', 'Credits')}: </span>
                    <span className="font-bold text-cyan-400">${userCredits !== null ? userCredits : '...'}</span>
                    {chatCreditCost !== null && (
                      <span className="ml-1 sm:ml-2 text-gray-400 text-xs">
                        ({t('businessChat.chat', 'Chat')}: <span className="text-cyan-300">${chatCreditCost}</span>)
                      </span>
                    )}
                  </span>
                </div>
                
                {/* History toggle button */}
                <button
                  onClick={toggleHistory}
                  className={`p-1.5 sm:p-2 rounded-full ${showHistory ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-white hover:bg-white/10'} transition-colors`}
                  title={t('businessChat.chatHistory', 'Chat History')}
                  aria-label={t('businessChat.toggleChatHistory', 'Toggle Chat History')}
                >
                  <IoChatbubbleEllipsesOutline size={16} className="sm:hidden" />
                  <IoChatbubbleEllipsesOutline size={18} className="hidden sm:block" />
                </button>
              </div>
            </div>
            
            {/* Chat history or active chat view */}
            {showHistory ? (
              <ConversationHistory 
                chatHistory={chatHistory}
                loadingHistory={loadingHistory}
                loadConversation={loadConversation}
                deleteConversation={deleteConversation}
                formatDate={formatDate}
                startNewConversation={startNewConversation}
              />
            ) : (
              <ActiveChat 
                conversations={conversations}
                isTyping={isTyping}
                message={message}
                loading={loading}
                messagesEndRef={messagesEndRef}
                setMessage={setMessage}
                handleKeyPress={handleKeyPress}
                handleSendMessage={handleSendMessage}
                chatHistory={chatHistory}
                setShowHistory={setShowHistory}
                userCredits={userCredits}
                chatCreditCost={chatCreditCost}
              />
            )}
          </div>
        </div>
      </div>
      
      {/* Optimized CSS with reduced animations for better performance */}
      <style jsx global>{`
        /* Simplified scrollbar styling */
        .hide-scrollbar::-webkit-scrollbar {
          width: 0.4rem;
          background-color: transparent;
        }
        
        .hide-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(139, 92, 246, 0.3);
          border-radius: 0.4rem;
        }
        
        .hide-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(139, 92, 246, 0.5);
        }
        
        .hide-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(139, 92, 246, 0.3) transparent;
        }
        
        /* Optimized animations with reduced complexity */
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 1.5s ease-in-out infinite;
        }
        
        .animate-bounce-medium {
          animation: bounce-slow 1.5s ease-in-out infinite;
          animation-delay: 0.2s;
        }
        
        .animate-bounce-fast {
          animation: bounce-slow 1.5s ease-in-out infinite;
          animation-delay: 0.4s;
        }
        
        /* Simplified fade and slide animations */
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
        
        @keyframes slide-right {
          0% { transform: translateX(-10px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slide-left {
          0% { transform: translateX(10px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        
        .animate-slide-right {
          animation: slide-right 0.3s ease-out forwards;
        }
        
        .animate-slide-left {
          animation: slide-left 0.3s ease-out forwards;
        }
        
        /* Text shimmer animation - simplified */
        @keyframes shimmer {
          0% { background-position: -100% 0; }
          100% { background-position: 100% 0; }
        }
        
        .animate-shimmer {
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0.2) 0%,
            rgba(139,92,246,0.6) 50%,
            rgba(255,255,255,0.2) 100%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: shimmer 3s infinite;
        }
      `}</style>
    </div>
  );
};

export default BusinessChatAdvisor;