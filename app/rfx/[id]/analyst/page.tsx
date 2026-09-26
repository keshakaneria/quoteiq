'use client';

import { useState, useRef, useEffect } from 'react';
import AppShell from '@/components/layout/AppShell';
import { runAnalyst, SUGGESTED_QUESTIONS, type AnalystResponse } from '@/lib/calculations/analyst';
import { Send, Zap, Bot, User, CheckCircle, Info, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'analyst';
  content: string;
  response?: AnalystResponse;
}

export default function AnalystPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: 'msg-0',
    role: 'analyst',
    content: "Hi! I'm your QuoteIQ Analyst. I've processed the 5 vendor responses for the Corrugated Packaging RFx. You can ask me to calculate split awards, find the lowest total cost, or identify exceptions. What would you like to know?",
  }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleAsk = async (question: string) => {
    if (!question.trim()) return;
    
    // Add user message
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: question };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate network delay for effect
    setTimeout(() => {
      const response = runAnalyst(question);
      const analystMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'analyst',
        content: response.answer,
        response,
      };
      setMessages(prev => [...prev, analystMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk(input);
    }
  };

  return (
    <AppShell>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ padding: '24px 36px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(245,158,11,0.1)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={16} />
            </div>
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>AI Analyst</h1>
              <p style={{ fontSize: 12, color: 'var(--muted)', margin: '2px 0 0' }}>Deterministic querying across 150 extracted data points</p>
            </div>
          </div>
        </div>

        {/* Suggested questions (sticky below header) */}
        <div style={{ padding: '12px 36px', background: 'var(--surface-2)', borderBottom: '1px solid var(--border)', display: 'flex', gap: 8, overflowX: 'auto', flexShrink: 0 }}>
          {SUGGESTED_QUESTIONS.map((q, i) => (
            <button
              key={i}
              className="btn btn-ghost"
              style={{ fontSize: 11, padding: '6px 12px', whiteSpace: 'nowrap', borderRadius: 999, background: 'var(--surface)' }}
              onClick={() => handleAsk(q)}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 36px' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{ display: 'flex', gap: 12, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: msg.role === 'user' ? 'var(--indigo)' : 'var(--surface-2)', border: msg.role === 'analyst' ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'white' }}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} color="var(--accent)" />}
                </div>
                
                <div style={{ flex: 1, maxWidth: '85%' }}>
                  <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'} style={{ fontSize: 14, lineHeight: 1.5 }}>
                    {msg.content.split('\n').map((line, i) => {
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return <div key={i} style={{ fontWeight: 600, marginBottom: 8 }}>{line.replace(/\*\*/g, '')}</div>;
                      }
                      if (line.includes('**')) {
                         const parts = line.split('**');
                         return <div key={i} style={{ marginBottom: 8 }}>
                           {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
                         </div>;
                      }
                      return <div key={i} style={{ marginBottom: 4 }}>{line}</div>;
                    })}
                  </div>

                  {/* Rich response payload */}
                  {msg.response && msg.response.is_sufficient && (
                    <div style={{ marginTop: 12, marginLeft: 8 }}>
                      <ExpandableSection title="Calculation Steps" icon={<BarChart3 size={12} />}>
                        <ol style={{ margin: 0, paddingLeft: 20, fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
                          {msg.response.calculation.map((c, i) => <li key={i}>{c}</li>)}
                        </ol>
                      </ExpandableSection>
                      
                      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                        <div style={{ flex: 1 }}>
                          <ExpandableSection title="Assumptions" icon={<Info size={12} />}>
                            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
                              {msg.response.assumptions.map((a, i) => <li key={i}>{a}</li>)}
                            </ul>
                          </ExpandableSection>
                        </div>
                        <div style={{ flex: 1 }}>
                          <ExpandableSection title="Exceptions Noted" icon={<AlertTriangle size={12} color="#f59e0b" />}>
                            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
                              {msg.response.exceptions_noted.map((e, i) => <li key={i}>{e}</li>)}
                            </ul>
                          </ExpandableSection>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--surface-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bot size={14} color="var(--accent)" />
                </div>
                <div className="chat-bubble-ai" style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center', height: 14 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--muted)', animation: 'pulse 1.5s infinite' }} />
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--muted)', animation: 'pulse 1.5s infinite', animationDelay: '0.2s' }} />
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--muted)', animation: 'pulse 1.5s infinite', animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input area */}
        <div style={{ padding: '16px 36px 24px', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative' }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about the quotes, vendors, or pricing scenarios..."
              style={{
                width: '100%',
                height: 60,
                resize: 'none',
                padding: '16px 50px 16px 16px',
                borderRadius: 12,
                fontSize: 14,
                lineHeight: 1.4,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                border: '1px solid var(--border-light)'
              }}
            />
            <button
              onClick={() => handleAsk(input)}
              disabled={!input.trim() || isTyping}
              style={{
                position: 'absolute',
                right: 12,
                bottom: 12,
                width: 36,
                height: 36,
                borderRadius: 8,
                background: input.trim() && !isTyping ? 'var(--accent)' : 'var(--surface-2)',
                color: input.trim() && !isTyping ? '#000' : 'var(--muted)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: input.trim() && !isTyping ? 'pointer' : 'default',
                transition: 'all 0.15s'
              }}
            >
              <Send size={16} />
            </button>
          </div>
          <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--muted)', marginTop: 8 }}>
            Answers are deterministically calculated using application logic, not hallucinated by an LLM.
          </div>
        </div>
      </div>
    </AppShell>
  );
}

// Helper component for Analyst
import { type ReactNode } from 'react';
import { BarChart3 } from 'lucide-react';

function ExpandableSection({ title, icon, children }: { title: string, icon: ReactNode, children: ReactNode }) {
  const [open, setOpen] = useState(false);
  
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', background: 'var(--surface)' }}>
      <button 
        onClick={() => setOpen(!open)}
        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: 'var(--foreground)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {icon} {title}
        </div>
        {open ? <ChevronUp size={14} color="var(--muted)" /> : <ChevronDown size={14} color="var(--muted)" />}
      </button>
      {open && (
        <div style={{ padding: '12px', borderTop: '1px solid var(--border)' }}>
          {children}
        </div>
      )}
    </div>
  );
}
