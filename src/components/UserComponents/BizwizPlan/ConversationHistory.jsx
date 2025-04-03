import React from 'react';
import { 
  IoChatbubbleEllipsesOutline, 
  IoTimeOutline,
  IoTrashOutline
} from 'react-icons/io5';

// Loading Spinner Component
const LoadingSpinner = ({ size = 'default', className = '' }) => (
  <div className={`border-2 border-t-transparent border-cyan-500 rounded-full animate-spin ${
    size === 'small' ? 'w-4 h-4 sm:w-5 sm:h-5' : 'w-7 h-7 sm:w-8 sm:h-8'
  } ${className}`}></div>
);

// Conversation Card Component
const ConversationCard = ({ conversation, onSelect, onDelete, formatDate }) => {
  const { id, title, firstMessage, lastMessageDate, messages } = conversation;
  
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(id, e);
  };
  
  return (
    <div
      onClick={() => onSelect(id)}
      className="p-2 sm:p-3 border border-gray-800 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-white text-sm sm:text-base truncate" title={title || ''}>
          {title || 
           (firstMessage 
             ? firstMessage.substring(0, 50) + (firstMessage.length > 50 ? '...' : '')
             : 'No Title')}
        </h3>
        <div className="flex items-center text-xs text-gray-500">
          <IoTimeOutline className="mr-1" />
          {formatDate(lastMessageDate || new Date())}
        </div>
      </div>
      
      {/* Show preview of conversation with both user and assistant messages */}
      <div className="border-t border-gray-800 pt-2 mt-1">
        {messages.slice(0, 2).map((msg, idx) => (
          <div key={idx} className="mb-1.5">
            <div className="flex items-start">
              <span className={`px-1.5 py-0.5 text-[10px] rounded-sm mr-2 ${
                msg.role === 'user' ? 'bg-purple-600/30 text-purple-300' : 'bg-cyan-600/30 text-cyan-300'
              }`}>
                {msg.role === 'user' ? 'You' : 'AI'}
              </span>
              <p className="text-gray-400 text-xs line-clamp-1 flex-1">
                {msg.content}
              </p>
            </div>
          </div>
        ))}
        
        {messages.length > 2 && (
          <p className="text-gray-500 text-xs italic mt-1">
            {messages.length - 2} more message{messages.length - 2 !== 1 ? 's' : ''}...
          </p>
        )}
      </div>
      
      <div className="flex justify-end mt-2">
        <button
          onClick={handleDelete}
          className="p-1 sm:p-1.5 rounded-full hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
          title="Delete conversation"
        >
          <IoTrashOutline size={14} className="sm:hidden" />
          <IoTrashOutline size={16} className="hidden sm:block" />
        </button>
      </div>
    </div>
  );
};

// Conversation History Component
const ConversationHistory = ({ 
  chatHistory, 
  loadingHistory, 
  loadConversation, 
  deleteConversation, 
  formatDate, 
  startNewConversation 
}) => {
  return (
    <div className="flex-grow overflow-y-auto rounded-lg border border-gray-800">
      {loadingHistory ? (
        <div className="flex flex-col items-center justify-center h-full">
          <LoadingSpinner />
          <p className="mt-3 text-white text-xs sm:text-sm">Loading conversations...</p>
        </div>
      ) : chatHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full p-4 sm:p-8 text-center">
          <IoChatbubbleEllipsesOutline size={36} className="sm:text-5xl text-gray-500 mb-4" />
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">No conversations yet</h3>
          <p className="text-gray-400 max-w-md text-xs sm:text-sm">
            Start a new conversation with the BizzPlan AI to get help with your business needs.
          </p>
          <button
            onClick={startNewConversation}
            className="mt-4 sm:mt-6 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-xs sm:text-sm rounded-lg hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
          >
            Start New Conversation
          </button>
        </div>
      ) : (
        <div className="h-full overflow-y-auto p-2 sm:p-3">
          <div className="grid gap-2">
            {chatHistory.map((conv) => (
              <ConversationCard 
                key={conv.id} 
                conversation={conv} 
                onSelect={loadConversation} 
                onDelete={deleteConversation} 
                formatDate={formatDate}
              />
            ))}
          </div>
          <div className="mt-4 flex justify-center">
            <button
              onClick={startNewConversation}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-xs sm:text-sm rounded-lg hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
            >
              Start New Conversation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationHistory;