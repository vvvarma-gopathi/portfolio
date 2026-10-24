import { useState, type FormEvent } from 'react'
import Menu from './components/Menu'
import Projects from './components/Projects'
import Skills from './components/Skills'
import About from './components/About'
import Achievements from './components/Achievements'
import Contact from './components/Contact'
import assistantOrb from './assets/assistant-orb.png'
import './App.css'

function Assistant() {
  const [open, setOpen] = useState(true)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<string[]>([])

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = message.trim()
    if (!trimmed) return
    setMessages((current) => [...current, trimmed])
    setMessage('')
  }

  return (
    <aside className={`assistant ${open ? 'assistant-open' : ''}`} aria-label="AI assistant">
      {open && (
        <div className="assistant-panel">
          <div className="assistant-header">
            <span className="assistant-mark">✧</span>
            <strong>AI Assistant</strong>
            <button type="button" aria-label="Minimize assistant" onClick={() => setOpen(false)}>−</button>
            <button type="button" aria-label="Close assistant" onClick={() => setOpen(false)}>×</button>
          </div>
          <div className="assistant-body">
            <p>Hi! I’m Varma’s AI assistant. I can answer questions about my projects, skills, education, or help you send a connection request.</p>
            <div className="assistant-suggestions">
              <button type="button" onClick={() => setMessages((current) => [...current, 'Tell me about Agile Bot'])}>Tell me about Agile Bot</button>
              <button type="button" onClick={() => setMessages((current) => [...current, 'What technologies do you use?'])}>What technologies do you use?</button>
              <button type="button" onClick={() => setMessages((current) => [...current, 'How can I connect with you?'])}>How can I connect with you?</button>
            </div>
            {messages.map((item, index) => <p className="chat-message" key={`${item}-${index}`}>{item}</p>)}
          </div>
          <form className="assistant-input" onSubmit={sendMessage}>
            <input aria-label="Type your message" placeholder="Type your message..." value={message} onChange={(event) => setMessage(event.target.value)} />
            <button type="submit" aria-label="Send message">➤</button>
          </form>
        </div>
      )}
      <button className="assistant-launcher" type="button" aria-label={open ? 'Hide AI assistant' : 'Open AI assistant'} onClick={() => setOpen((current) => !current)}>
        <img src={assistantOrb} alt="" /><i />
      </button>
    </aside>
  )
}

function Hero() {
  return (
    <section className="hero-section" id="home">
      <div className="hero-copy">
        <p className="eyebrow">PYTHON FULL-STACK DEVELOPER <span>·</span> GENERATIVE AI ENTHUSIAST</p>
        <h1>Engineering useful AI<br className="desktop-break" /> with Python, modern<br className="desktop-break" /> web technologies, and LLMs.</h1>
        <p className="hero-description">I build full-stack web applications and AI-powered solutions that solve real problems, from backend services to intelligent user experiences.</p>
        <div className="hero-contact"><span>⌖ &nbsp; Hyderabad, India</span><a href="mailto:vishnuvardhangopathi@gmail.com">✉ &nbsp; vishnuvardhangopathi@gmail.com</a></div>
        <div className="hero-actions"><a className="button button-primary" href="#projects">View My Projects <span>→</span></a><a className="button" href="#about">Download Resume <span>⇩</span></a></div>
      </div>
      <div className="hero-visual" aria-hidden="true" />
      <div className="stats-strip">
        <div><b>♢</b><strong>4+</strong><span>Major Projects</span></div><div><b>⬡</b><strong>3</strong><span>Deployed Apps</span></div><div><b>‹ ›</b><strong>15+</strong><span>Technologies</span></div><div><b>⚑</b><strong>2027</strong><span>B.Sc. CS (Expected)</span></div><div><b>♜</b><strong>5★</strong><span>HackerRank Python</span></div>
      </div>
    </section>
  )
}

function WhyHireMe() {
  const points = [['♧', 'Problem Solver', 'Builds real-world solutions'], ['▣', 'Full-Stack Perspective', 'Backend to frontend'], ['▤', 'AI Integration', 'Practical GenAI applications'], ['◉', 'Continuous Learner', 'Exploring and adapting to new tech'], ['⬟', 'Ownership', 'Design, build, and deploy']]
  return <section className="panel why-panel"><div className="why-copy"><p className="eyebrow">♧ &nbsp; WHY HIRE ME?</p><h2>Why Hire Me?</h2><p>I enjoy building applications that actually solve real problems. Over the past few years, I’ve worked on multiple full-stack projects involving backend APIs, database design, frontend interfaces, and Generative AI features. I like learning new technologies, exploring how they can be applied in practical applications, and then building and deploying them myself.<br />I’m comfortable working end-to-end, from designing the system and implementing the backend to creating a clean user interface and integrating AI capabilities like LLMs, RAG, and intelligent agents. I focus on writing clean code, understanding trade-offs, and building solutions that are useful, scalable, and can be improved over time.<br />If you’re looking for someone who can contribute to backend development, full-stack features, and AI-powered applications while learning and adapting quickly, I believe my projects and skills demonstrate that I can add value to your team.</p></div><div className="why-list">{points.map(([icon, title, text]) => <div className="why-point" key={title}><b>{icon}</b><span><strong>{title}</strong><small>{text}</small></span></div>)}</div></section>
}

function App() {
  return (
    <>
      <Menu />
      <main className="page-shell">
        <Hero />
        <WhyHireMe />
        <Projects />
        <Skills />
        <About />
        <Achievements />
        <Contact />
      </main>
      <Assistant />
    </>
  )
}

export default App
