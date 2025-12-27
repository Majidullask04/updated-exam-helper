import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Eraser, ImagePlus, X, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage } from '../types';
import { chatWithTutor } from '../services/geminiService';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hello! I'm your Examaid AI Tutor. What subject or topic are you studying today? I can help you understand concepts, solve problems, or just chat about your studies.",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachment, setAttachment] = useState<{ mimeType: string, data: string } | undefined>(undefined);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // remove data:image/xyz;base64, prefix
        const base64Data = base64String.split(',')[1];
        setAttachment({ mimeType: file.type, data: base64Data });
      };
      reader.readAsDataURL(file);
    }
    // Reset input so same file can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const clearAttachment = () => {
    setAttachment(undefined);
  };

  const handleSend = async () => {
    if ((!input.trim() && !attachment) || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input.trim(),
      attachment: attachment,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setAttachment(undefined);
    setIsLoading(true);

    try {
      const { text, groundingMetadata } = await chatWithTutor(messages, userMessage.text, userMessage.attachment);

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: text || "I'm sorry, I couldn't generate a response. Please try again.",
        timestamp: Date.now(),
        groundingMetadata: groundingMetadata
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Sorry, I encountered an error connecting to the AI. Please check your connection or API key.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
     setMessages([
        {
          id: 'welcome',
          role: 'model',
          text: "Chat cleared. What shall we study next?",
          timestamp: Date.now()
        }
      ]);
      setAttachment(undefined);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-600" />
            AI Study Tutor
          </h2>
          <p className="text-xs text-slate-500">Powered by Gemini 3 Flash & Google Search</p>
        </div>
        <button 
            onClick={clearChat}
            className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="Clear Chat"
        >
            <Eraser className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[95%] md:max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-2`}>
              <div className={`
                flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'}
              `}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              
              <div className={`
                p-3 rounded-2xl shadow-sm overflow-hidden
                ${msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'}
              `}>
                {msg.attachment && (
                  <div className="mb-3 rounded-lg overflow-hidden border border-white/20">
                    <img 
                      src={`data:${msg.attachment.mimeType};base64,${msg.attachment.data}`} 
                      alt="User attachment" 
                      className="max-w-full h-auto max-h-60 object-contain"
                    />
                  </div>
                )}
                
                <div className={`markdown-body text-sm leading-relaxed ${msg.role === 'user' ? 'text-white' : 'text-slate-800'}`}>
                  {msg.role === 'model' ? (
                     <ReactMarkdown remarkPlugins={[remarkGfm]}>
                       {msg.text}
                     </ReactMarkdown>
                  ) : (
                    msg.text
                  )}
                </div>

                {/* Grounding Sources */}
                {msg.groundingMetadata?.groundingChunks && msg.groundingMetadata.groundingChunks.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
                      <ExternalLink size={10} /> Sources:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {msg.groundingMetadata.groundingChunks.map((chunk, idx) => {
                        if (chunk.web?.uri && chunk.web?.title) {
                          return (
                            <a 
                              key={idx} 
                              href={chunk.web.uri} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs bg-slate-100 text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded border border-slate-200 truncate max-w-[200px] block"
                            >
                              {chunk.web.title}
                            </a>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start w-full">
            <div className="flex flex-row items-start gap-2 max-w-[75%]">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                <Bot size={16} />
              </div>
              <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm flex items-center gap-2">
                 <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                 <span className="text-sm text-slate-500">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        
        {/* Attachment Preview */}
        {attachment && (
          <div className="mb-3 flex items-start">
            <div className="relative group">
              <img 
                src={`data:${attachment.mimeType};base64,${attachment.data}`} 
                alt="Preview" 
                className="h-20 w-auto rounded-lg border border-slate-200 shadow-sm"
              />
              <button 
                onClick={clearAttachment}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors border border-slate-200"
            title="Attach Image"
          >
            <ImagePlus size={20} />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={attachment ? "Ask a question about this image..." : "Ask a question or attach an image..."}
            disabled={isLoading}
            className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={(!input.trim() && !attachment) || isLoading}
            className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-200"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
