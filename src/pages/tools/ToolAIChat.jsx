import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Bot, Send } from 'lucide-react';
import { callLMStudio } from '../../config/lmStudio';
import { NeoMarkdown } from '../../components/ui/NeoMarkdown';
import { Magnetic } from '../../components/ui/Magnetic';

export const ToolAIChat = ({ isAr, setPage, userContext, onCheckPoints, onDeductPoints }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { 
    endRef.current?.scrollIntoView({ behavior: 'smooth' }); 
  }, [messages]);

  const handleSend = async () => {
    if(!input.trim()) return;

    if (onCheckPoints && !onCheckPoints(10)) {
      return;
    }

    const userMsg = { role: 'user', content: input };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    const langInst = isAr 
      ? 'MUST WRITE ENTIRELY IN ARABIC. DO NOT USE ENGLISH.' 
      : 'MUST WRITE ENTIRELY IN ENGLISH. DO NOT USE ARABIC.';
    const systemPrompt = `You are a creative career counselor at Masari. Provide specific, helpful career guidance. Use Markdown. ${langInst}`;
    
    const conversationContext = messages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');
    const userPrompt = `Previous conversation:\n${conversationContext}\n\nUser: ${input}\n\nProvide a helpful response.`;
    const fallback = isAr ? "شكراً لسؤالك. كمستشار مهني في مساري، أنصحك بالتركيز على تطوير مهاراتك الأساسية وبناء شبكة علاقات مهنية قوية." : "Thanks for your question. As a Masari career counselor, I recommend focusing on developing your core skills and building a strong professional network.";

    try {
      const response = await callLMStudio(systemPrompt, userPrompt, fallback);
      
      const isFallback = response === fallback;
      if (!isFallback && onDeductPoints) {
        onDeductPoints(10);
      }
      
      setMessages(p => [...p, { role: 'assistant', content: response }]);
    } catch (e) {
      console.error(e);
      setMessages(p => [...p, { role: 'assistant', content: fallback }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 px-6 pb-12 flex flex-col items-center">
      <div className="w-full max-w-[1000px] bg-theme-secondary rounded-[3rem] border-4 border-theme shadow-brutal-lg flex flex-col h-[75vh] overflow-hidden relative">
        <div className="bg-[var(--accent-mint)] border-b-4 border-theme p-6 md:p-8 flex items-center justify-between z-10 text-black">
          <div className="flex items-center gap-6">
            <Magnetic strength={0.2}>
              <button onClick={() => setPage(`dashboard_${userContext}`)} className="clickable-card w-14 h-14 bg-white border-4 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0_#000]">
                {isAr ? <ArrowRight className="w-6 h-6"/> : <ArrowLeft className="w-6 h-6"/>}
              </button>
            </Magnetic>
            <div>
              <h2 className="text-2xl md:text-3xl font-display-en font-bold">
                {isAr ? 'المستشار المهني بالذكاء الاصطناعي' : 'AI Career Counselor'}
              </h2>
            </div>
          </div>
          <Bot className="w-12 h-12 opacity-80" />
        </div>

        <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-theme-primary relative text-black">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
              <h3 className="text-4xl mb-4 font-display-en font-black">
                {isAr ? 'كيف يمكنني توجيهك؟' : 'How can I guide you?'}
              </h3>
            </div>
          )}
          
          {messages.map((m, i) => (
            <div key={i} className={`mb-8 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-6 rounded-3xl border-4 border-theme max-w-[85%] font-medium text-lg leading-relaxed shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                m.role === 'user' ? 'bg-[var(--accent-peach)] text-black' : 'bg-theme-secondary'
              }`}>
                {m.role === 'user' ? m.content : <NeoMarkdown text={m.content} />}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start mb-8">
              <div className="p-6 bg-theme-secondary border-4 border-theme rounded-3xl flex gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="w-4 h-4 bg-theme-primary rounded-full animate-bounce"></div>
                <div className="w-4 h-4 bg-[var(--accent-lilac)] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-4 h-4 bg-[var(--accent-coral)] rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="p-6 bg-theme-secondary border-t-4 border-theme z-10">
          <div className="flex gap-4">
            <input 
              type="text" value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder={isAr ? 'اسأل سؤالك المهني...' : 'Ask your career question...'}
              className="clickable-card flex-1 bg-theme-primary text-theme-primary border-4 border-theme rounded-full px-8 py-5 text-xl font-bold outline-none focus:bg-theme-secondary transition-colors"
            />
            <Magnetic strength={0.3}>
              <button 
                onClick={handleSend} disabled={loading}
                className="clickable-card bg-theme-primary text-theme-primary w-20 h-20 rounded-full flex items-center justify-center hover:bg-[var(--accent-lilac)] hover:text-black border-4 border-theme shadow-[4px_4px_0_rgba(0,0,0,1)] transition-colors shrink-0"
              >
                <Send className="w-8 h-8" />
              </button>
            </Magnetic>
          </div>
        </div>

      </div>
    </div>
  );
};
