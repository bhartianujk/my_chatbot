import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, Bot, BrainCircuit, ChevronRight, CircleHelp, ExternalLink, GraduationCap, LoaderCircle, MessageCircle, RefreshCw, Send, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
import './styles.css';

const prompts = [
  { icon: GraduationCap, text: 'Tell me about Dr. Anuj’s academic background' },
  { icon: BrainCircuit, text: 'What are his main research interests?' },
  { icon: CircleHelp, text: 'Explain his research on fMRI and Alzheimer’s disease' },
  { icon: Sparkles, text: 'What are his selected publications?' }
];
const greeting = { role: 'assistant', content: 'Hello! 👋 I’m Anuj’s academic AI assistant. Ask me about his research, teaching, publications, or academic journey.' };
function App() {
  const [messages, setMessages] = useState([greeting]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const endRef = useRef(null);
  const abortRef = useRef(null);
  useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), [messages, busy]);
  useEffect(() => () => abortRef.current?.abort(), []);
  async function send(text = draft) {
    const question = text.trim();
    if (!question || busy) return;
    const next = [...messages, { role: 'user', content: question }];
    setMessages(next); setDraft(''); setError(''); setBusy(true);
    const controller = new AbortController(); abortRef.current = controller;
    try {
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: next.filter(m => m !== greeting).slice(-12) }), signal: controller.signal });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Unable to connect to the assistant.');
      setMessages(current => [...current, { role: 'assistant', content: data.reply }]);
    } catch (e) { if (e.name !== 'AbortError') setError(e.message || 'Something went wrong.'); }
    finally { setBusy(false); abortRef.current = null; }
  }
  function reset() { abortRef.current?.abort(); setMessages([greeting]); setDraft(''); setError(''); setBusy(false); }
  return <div className="site">
    <header className="topbar"><a className="brand" href="/"><span className="brand-icon"><BrainCircuit size={23}/></span><span>ANUJ<span className="brand-accent">.</span>AI<small>ACADEMIC ASSISTANT</small></span></a><a className="profile-link" href="https://www.linkedin.com/in/anujkumarbharti/" target="_blank" rel="noreferrer">LinkedIn profile <ArrowUpRight size={16}/></a></header>
    <main className="layout"><aside className="sidebar"><div className="eyebrow"><span className="status-dot"/> ACADEMIC AI ASSISTANT</div><h1>Ideas, research<br/>& <em>curiosity.</em></h1><p className="intro">Get to know Dr. Anuj Kumar Bharti’s academic journey, research, and work at the intersection of AI and neuroscience.</p><div className="person"><div className="avatar"><UserRound size={32}/></div><div><strong>Dr. Anuj Kumar Bharti</strong><span>Computer Science · Researcher</span></div></div><div className="topics"><span>RESEARCH AREAS</span><div><i>Machine Learning</i><i>Neuroimaging</i><i>fMRI</i><i>Cognitive Science</i><i>Complex Networks</i></div></div><a className="side-link" href="https://www.linkedin.com/in/anujkumarbharti/" target="_blank" rel="noreferrer">Explore full profile <ExternalLink size={16}/></a><div className="sidebar-bottom"><ShieldCheck size={17}/> Answers are based on an editable academic knowledge base.</div></aside>
    <section className="chat-panel" aria-label="Chat with academic AI assistant"><div className="chat-header"><div className="bot-badge"><Bot size={23}/></div><div className="chat-heading"><strong>Ask Anuj AI</strong><span><span className="status-dot"/> Powered by Google Gemini</span></div><button className="reset" title="Start a new conversation" onClick={reset}><RefreshCw size={18}/><span>New chat</span></button></div>
    <div className="messages" aria-live="polite">{messages.map((m, i) => <div className={`message-row ${m.role}`} key={i}>{m.role === 'assistant' && <div className="message-avatar"><Bot size={17}/></div>}<div className="bubble">{m.content}</div></div>)}{messages.length === 1 && <div className="suggestions"><span className="suggestion-title">SUGGESTED QUESTIONS</span><div className="suggestion-grid">{prompts.map(({ icon: Icon, text }) => <button key={text} onClick={() => send(text)} disabled={busy}><Icon size={19}/><span>{text}</span><ChevronRight size={16}/></button>)}</div></div>}{busy && <div className="message-row assistant"><div className="message-avatar"><Bot size={17}/></div><div className="bubble thinking"><LoaderCircle className="spin" size={18}/> Thinking…</div></div>}{error && <div className="error" role="alert">{error} <button onClick={() => setError('')}>Dismiss</button></div>}<div ref={endRef}/></div>
    <form className="composer" onSubmit={e => {e.preventDefault(); send();}}><div className="input-wrap"><MessageCircle size={20}/><textarea aria-label="Your question" placeholder="Ask anything about Anuj’s research…" rows={1} maxLength={3000} value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) {e.preventDefault(); send();} }} disabled={busy}/><button type="submit" aria-label="Send message" disabled={!draft.trim() || busy}><Send size={19}/></button></div><p>AI can make mistakes. Verify important academic information. <span>Press Enter to send</span></p></form></section></main><footer>© {new Date().getFullYear()} Anuj AI · Built for curiosity and research</footer></div>;
}
createRoot(document.getElementById('root')).render(<App/>);
