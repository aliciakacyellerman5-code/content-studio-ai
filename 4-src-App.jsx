import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Copy, Check, MessageCircle, X, Send, Zap } from 'lucide-react';

export default function ContentStudio() {
  const [content, setContent] = useState('');
  const [tone, setTone] = useState('professional');
  const [contentType, setContentType] = useState('blog');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const [credits, setCredits] = useState(1000);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', text: '👋 Hi! I\'m here to help. Ask me about pricing, features, setup, or anything else!' }
  ]);
  const [userInput, setUserInput] = useState('');
  const chatEndRef = useRef(null);

  const tones = ['professional', 'casual', 'persuasive', 'academic', 'humorous', 'inspirational'];
  const contentTypes = ['blog', 'social', 'email', 'ad', 'product', 'landing-page'];

  // FAQ Database
  const faqDatabase = {
    'price': {
      keywords: ['price', 'cost', 'how much', 'pricing', 'pay', '$'],
      response: '💰 ContentStudio AI is $97 for lifetime access. Includes full source code, setup guide, and commercial rights. 30-day money-back guarantee!'
    },
    'deploy': {
      keywords: ['deploy', 'install', 'setup', 'launch', 'how do i', 'get started'],
      response: '🚀 Super easy! Deploy to Vercel (5 min), self-host, or customize. Full instructions included. No coding required!'
    },
    'customize': {
      keywords: ['customize', 'change', 'white label', 'brand', 'color', 'modify'],
      response: '🎨 Customize everything! Colors, fonts, content types, tones. White-label ready for agencies. Full customization guide included.'
    },
    'api': {
      keywords: ['api', 'key', 'gemini', 'google', 'anthropic', 'openai'],
      response: '🔑 Uses FREE Google Gemini API (no credit card needed). Get your key from aistudio.google.com. Costs ~$0.01-0.05 per generation.'
    },
    'refund': {
      keywords: ['refund', 'guarantee', 'money back', 'satisfaction', 'return'],
      response: '✅ 30-day money-back guarantee! Not satisfied? Get 100% refund, no questions asked.'
    },
    'features': {
      keywords: ['features', 'what can', 'capabilities', 'does it', 'create'],
      response: '⚡ Creates: blog posts, social media, emails, ad copy, product descriptions, landing pages. 6 content types × 6 tones = unlimited possibilities!'
    },
    'saas': {
      keywords: ['saas', 'subscription', 'monthly', 'resell', 'white label', 'monetize'],
      response: '💼 Perfect for SaaS! Charge customers $29-99/month. White-label included. Full monetization guide provided.'
    },
    'support': {
      keywords: ['support', 'help', 'contact', 'question', 'issue', 'problem'],
      response: '🆘 Email support included. Check the detailed guides in your package. We\'re here to help!'
    }
  };

  const findAnswer = (userMessage) => {
    const lowercaseMessage = userMessage.toLowerCase();
    for (const [key, faqItem] of Object.entries(faqDatabase)) {
      if (faqItem.keywords.some(keyword => lowercaseMessage.includes(keyword))) {
        return faqItem.response;
      }
    }
    return '😊 Great question! For detailed answers, check the guides included with your purchase or email us!';
  };

  const handleChatSubmit = () => {
    if (!userInput.trim()) return;
    setChatMessages(prev => [...prev, { type: 'user', text: userInput }]);
    setTimeout(() => {
      const answer = findAnswer(userInput);
      setChatMessages(prev => [...prev, { type: 'bot', text: answer }]);
    }, 300);
    setUserInput('');
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const callGeminiAPI = async (prompt) => {
    try {
      const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
      if (!apiKey) {
        return "❌ Error: API key not configured. Add REACT_APP_GOOGLE_API_KEY to your environment variables.";
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 1500, temperature: 0.7 }
          })
        }
      );

      if (!response.ok) {
        return "❌ API Error: Check your API key or rate limits.";
      }

      const data = await response.json();
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      }
      return "❌ No content generated. Try again.";
    } catch (error) {
      return "❌ Error: " + error.message;
    }
  };

  const generateContent = async () => {
    if (!content.trim()) {
      alert('Please enter a content brief!');
      return;
    }

    setIsGenerating(true);
    const prompt = `Create a ${contentType} in a ${tone} tone based on this brief: "${content}". Make it professional, engaging, and optimized.`;
    const result = await callGeminiAPI(prompt);
    setGeneratedContent(result);
    
    const wordCount = result.split(/\s+/).length;
    setHistory([
      ...history,
      {
        input: content,
        output: result,
        type: contentType,
        tone: tone,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
    
    setCredits(Math.max(0, credits - 10));
    setIsGenerating(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #000000 100%)',
      color: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '1.5rem'
    }}>
      {/* Decorative blobs */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(147, 51, 234, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '3rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid rgba(71, 85, 105, 0.3)'
        }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0, marginBottom: '0.25rem' }}>
              ✨ ContentStudio AI
            </h1>
            <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.95rem' }}>
              Generate Professional Content in Seconds
            </p>
          </div>
          <div style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.95rem'
            }}>
              ⚡ {credits} Credits
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          {/* Left Column - Input */}
          <div>
            <div style={{
              background: 'rgba(30, 41, 59, 0.5)',
              border: '1px solid rgba(71, 85, 105, 0.5)',
              borderRadius: '12px',
              padding: '2rem',
              backdropFilter: 'blur(8px)'
            }}>
              <label style={{
                display: 'block',
                fontSize: '1rem',
                fontWeight: '600',
                marginBottom: '0.75rem',
                color: '#cbd5e1'
              }}>
                What do you want to create?
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your content brief here... Be specific for best results!"
                style={{
                  width: '100%',
                  height: '150px',
                  padding: '1rem',
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid rgb(51, 65, 85)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  resize: 'none',
                  outline: 'none',
                  marginBottom: '1.5rem'
                }}
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                    color: '#cbd5e1'
                  }}>
                    Content Type
                  </label>
                  <select
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(15, 23, 42, 0.5)',
                      border: '1px solid rgb(51, 65, 85)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      outline: 'none'
                    }}
                  >
                    {contentTypes.map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                    color: '#cbd5e1'
                  }}>
                    Tone
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(15, 23, 42, 0.5)',
                      border: '1px solid rgb(51, 65, 85)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      outline: 'none'
                    }}
                  >
                    {tones.map(t => (
                      <option key={t} value={t}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={generateContent}
                disabled={!content.trim() || isGenerating}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: isGenerating || !content.trim()
                    ? 'rgba(59, 130, 246, 0.5)'
                    : 'linear-gradient(90deg, #2563eb, #3b82f6)',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '600',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: !content.trim() || isGenerating ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                {isGenerating ? (
                  <>
                    <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Generate Content
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column - Output & History */}
          <div>
            {generatedContent && (
              <div style={{
                background: 'rgba(30, 41, 59, 0.5)',
                border: '1px solid rgba(71, 85, 105, 0.5)',
                borderRadius: '12px',
                padding: '2rem',
                backdropFilter: 'blur(8px)',
                marginBottom: '2rem'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>
                    Generated Content
                  </h3>
                  <button
                    onClick={copyToClipboard}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: copied ? '#10b981' : '#94a3b8',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'color 0.2s'
                    }}
                  >
                    {copied ? (
                      <>
                        <Check size={16} /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={16} /> Copy
                      </>
                    )}
                  </button>
                </div>
                <div style={{
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid rgb(51, 65, 85)',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                  color: '#e2e8f0',
                  fontSize: '0.95rem'
                }}>
                  {generatedContent}
                </div>
              </div>
            )}

            {/* History */}
            {history.length > 0 && (
              <div style={{
                background: 'rgba(30, 41, 59, 0.5)',
                border: '1px solid rgba(71, 85, 105, 0.5)',
                borderRadius: '12px',
                padding: '1.5rem',
                backdropFilter: 'blur(8px)'
              }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '600' }}>
                  📋 Recent Generations ({history.length})
                </h3>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {history.slice().reverse().map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '1rem',
                        background: 'rgba(15, 23, 42, 0.3)',
                        borderRadius: '6px',
                        marginBottom: '0.75rem',
                        borderLeft: '3px solid #3b82f6'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{
                          background: 'rgba(59, 130, 246, 0.2)',
                          color: '#93c5fd',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '99px',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          {item.type}
                        </span>
                        <span style={{
                          background: 'rgba(168, 85, 247, 0.2)',
                          color: '#d8b4fe',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '99px',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          {item.tone}
                        </span>
                        <span style={{
                          color: '#94a3b8',
                          fontSize: '0.75rem',
                          marginLeft: 'auto'
                        }}>
                          {item.timestamp}
                        </span>
                      </div>
                      <p style={{
                        margin: 0,
                        fontSize: '0.85rem',
                        color: '#cbd5e1',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {item.input}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Bot */}
      {chatOpen ? (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '380px',
          maxHeight: '500px',
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          border: '1px solid rgba(71, 85, 105, 0.5)',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 50,
          backdropFilter: 'blur(8px)'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
            padding: '1rem',
            borderRadius: '16px 16px 0 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <MessageCircle size={20} />
              <h3 style={{ margin: 0, fontWeight: '600', fontSize: '0.95rem' }}>
                ContentStudio Help
              </h3>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: 'white',
                borderRadius: '6px',
                padding: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  maxWidth: '85%',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  background: msg.type === 'user' ? '#3b82f6' : '#475569',
                  color: 'white',
                  fontSize: '0.9rem',
                  lineHeight: '1.4',
                  wordWrap: 'break-word'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div style={{
            borderTop: '1px solid rgba(71, 85, 105, 0.5)',
            padding: '1rem',
            display: 'flex',
            gap: '0.75rem'
          }}>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
              placeholder="Ask a question..."
              style={{
                flex: 1,
                background: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgb(51, 65, 85)',
                borderRadius: '6px',
                padding: '0.75rem',
                color: 'white',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
            <button
              onClick={handleChatSubmit}
              style={{
                background: '#3b82f6',
                border: 'none',
                color: 'white',
                padding: '0.75rem',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setChatOpen(true)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
            color: 'white',
            padding: '1rem',
            borderRadius: '50%',
            border: 'none',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '60px',
            height: '60px',
            zIndex: 50,
            transition: 'transform 0.2s',
            fontSize: '1.5rem'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          <MessageCircle size={28} />
        </button>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        textarea::-webkit-scrollbar,
        div::-webkit-scrollbar {
          width: 6px;
        }
        textarea::-webkit-scrollbar-track,
        div::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 3px;
        }
        textarea::-webkit-scrollbar-thumb,
        div::-webkit-scrollbar-thumb {
          background: rgba(71, 85, 105, 0.5);
          border-radius: 3px;
        }
        textarea::-webkit-scrollbar-thumb:hover,
        div::-webkit-scrollbar-thumb:hover {
          background: rgba(71, 85, 105, 0.7);
        }
      `}</style>
    </div>
  );
}
