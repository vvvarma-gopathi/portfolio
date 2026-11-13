import { useEffect, useRef, useState, type FormEvent } from 'react'
import Menu from './components/Menu'
import Projects from './components/Projects'
import FunProjects from './components/FunProjects'
import ReactProjects from './components/ReactProjects'
import Skills from './components/Skills'
import About from './components/About'
import Training from './components/Training'
import Achievements from './components/Achievements'
import Contact from './components/Contact'
import AssistantMessage from './components/AssistantMessage'
import assistantOrb from './assets/assistant-orb.png'
import './App.css'
import "bootstrap-icons/font/bootstrap-icons.css";

type AssistantResponse = {
  answer: string
  sources: string[]
}

type ChatMessage = {
  id: number
  role: 'user' | 'assistant' | 'error'
  text: string
}

type ConnectionResponse = {
  message: string
}

function playInterfaceSound(context: AudioContext) {
  const now = context.currentTime
  const oscillator = context.createOscillator()
  const toneVolume = context.createGain()
  const noise = context.createBufferSource()
  const noiseVolume = context.createGain()
  const duration = 0.12
  const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate)
  const samples = buffer.getChannelData(0)

  for (let index = 0; index < samples.length; index += 1) {
    samples[index] = (Math.random() * 2 - 1) * (1 - index / samples.length)
  }

  noise.buffer = buffer
  noiseVolume.gain.setValueAtTime(0.035, now)
  noiseVolume.gain.exponentialRampToValueAtTime(0.0001, now + 0.025)

  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(1050, now)
  oscillator.frequency.exponentialRampToValueAtTime(280, now + duration)
  toneVolume.gain.setValueAtTime(0.0001, now)
  toneVolume.gain.exponentialRampToValueAtTime(0.18, now + 0.003)
  toneVolume.gain.exponentialRampToValueAtTime(0.0001, now + duration)

  noise.connect(noiseVolume)
  noiseVolume.connect(context.destination)
  oscillator.connect(toneVolume)
  toneVolume.connect(context.destination)
  noise.start(now)
  noise.stop(now + duration)
  oscillator.start(now)
  oscillator.stop(now + duration)
  oscillator.addEventListener('ended', () => {
    oscillator.disconnect()
    toneVolume.disconnect()
    noise.disconnect()
    noiseVolume.disconnect()
  }, { once: true })
}

function isConnectionRequest(text: string): boolean {
  return /\bconnect(?:ion|ing)?\b|\bget in touch\b|\breach out\b|\bcontact(?: you| me)?\b/i.test(text)
}

function isAssistantResponse(value: unknown): value is AssistantResponse {
  if (typeof value !== 'object' || value === null) return false
  const response = value as Record<string, unknown>
  return (
    typeof response.answer === 'string' &&
    Array.isArray(response.sources) &&
    response.sources.every((source) => typeof source === 'string')
  )
}

function isConnectionResponse(value: unknown): value is ConnectionResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Record<string, unknown>).message === 'string'
  )
}

function Assistant() {
  const [open, setOpen] = useState(true)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [connectionFormOpen, setConnectionFormOpen] = useState(false)
  const [connectionName, setConnectionName] = useState('')
  const [connectionEmail, setConnectionEmail] = useState('')
  const [connectionReason, setConnectionReason] = useState('')
  const [connectionConsent, setConnectionConsent] = useState(false)
  const [isConnectionSubmitting, setIsConnectionSubmitting] = useState(false)
  const messageIdRef = useRef(0)
  const assistantBodyRef = useRef<HTMLDivElement>(null)

  function addMessage(role: ChatMessage['role'], text: string) {
    const message = { id: ++messageIdRef.current, role, text }
    setMessages((current) => [...current, message])
  }

  useEffect(() => {
    const body = assistantBodyRef.current
    if (body) body.scrollTop = body.scrollHeight
  }, [messages, isLoading])

  async function submitMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return

    setMessage('')

    if (isConnectionRequest(trimmed)) {
      addMessage('user', trimmed)
      addMessage(
        'assistant',
        'I’d be happy to pass along your request. Please share your name and email, and optionally what you’d like to connect about.',
      )
      setConnectionFormOpen(true)
      return
    }

    addMessage('user', trimmed)
    setIsLoading(true)

    try {
      const response = await fetch('https://portfolio-9jph.onrender.com/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      })

      if (!response.ok) {
        throw new Error(`The assistant request failed (${response.status}).`)
      }

      const result: unknown = await response.json()
      if (!isAssistantResponse(result) || !result.answer.trim()) {
        throw new Error('The assistant returned an invalid response.')
      }

      addMessage('assistant', result.answer)
    } catch (error) {
      const text =
        error instanceof TypeError
          ? 'Unable to reach the assistant. Check that the backend is running at localhost:8000.'
          : error instanceof Error
            ? error.message
            : 'Something went wrong. Please try again.'
      addMessage('error', text)
    } finally {
      setIsLoading(false)
    }
  }

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void submitMessage(message)
  }

  async function sendConnectionRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isConnectionSubmitting) return

    setIsConnectionSubmitting(true)
    try {
      const response = await fetch('https://portfolio-9jph.onrender.com/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: connectionName,
          email: connectionEmail,
          reason: connectionReason || null,
          consent: connectionConsent,
        }),
      })
      const result: unknown = await response.json()

      if (!response.ok) {
        const detail =
          typeof result === 'object' && result !== null &&
          typeof (result as Record<string, unknown>).detail === 'string'
            ? (result as Record<string, string>).detail
            : 'Your connection request could not be sent. Please try again later.'
        throw new Error(detail)
      }
      if (!isConnectionResponse(result)) {
        throw new Error('The server returned an invalid response.')
      }

      setConnectionFormOpen(false)
      setConnectionName('')
      setConnectionEmail('')
      setConnectionReason('')
      setConnectionConsent(false)
      addMessage('assistant', `${result.message} Varma can reply directly to your email.`)
    } catch (error) {
      const text =
        error instanceof TypeError
          ? 'Unable to reach the backend. Please try again later.'
          : error instanceof Error
            ? error.message
            : 'Your connection request could not be sent. Please try again later.'
      addMessage('error', text)
    } finally {
      setIsConnectionSubmitting(false)
    }
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
          <div className="assistant-body" ref={assistantBodyRef}>
            <p>Hi! I’m Varma’s AI assistant. I can answer questions about Varma's projects, skills, education, or help you send a connection request.</p>
            <div className="assistant-suggestions">
              <button type="button" disabled={isLoading} onClick={() => void submitMessage('Tell me about Agile Bot')}>Tell me about Agile Bot</button>
              <button type="button" disabled={isLoading} onClick={() => void submitMessage('What technologies do you use?')}>What technologies do Varma use?</button>
              <button type="button" disabled={isLoading} onClick={() => void submitMessage('How can I connect with you?')}>How can I connect with Varma?</button>
            </div>
            <div className="assistant-conversation" aria-live="polite">
              {messages.map((item) => (
                <div className={`chat-message chat-message-${item.role}`} key={item.id}>
                  {item.role === 'assistant' ? (
                    <AssistantMessage text={item.text} />
                  ) : (
                    item.text
                  )}
                </div>
              ))}
              {connectionFormOpen && (
                <form className="connection-form" onSubmit={sendConnectionRequest}>
                  <label>
                    Name
                    <input
                      autoComplete="name"
                      maxLength={100}
                      required
                      value={connectionName}
                      onChange={(event) => setConnectionName(event.target.value)}
                    />
                  </label>
                  <label>
                    Email
                    <input
                      autoComplete="email"
                      maxLength={254}
                      required
                      type="email"
                      value={connectionEmail}
                      onChange={(event) => setConnectionEmail(event.target.value)}
                    />
                  </label>
                  <label>
                    Reason to connect <span>(optional)</span>
                    <textarea
                      maxLength={1000}
                      rows={3}
                      value={connectionReason}
                      onChange={(event) => setConnectionReason(event.target.value)}
                    />
                  </label>
                  <label className="connection-consent">
                    <input
                      checked={connectionConsent}
                      onChange={(event) => setConnectionConsent(event.target.checked)}
                      required
                      type="checkbox"
                    />
                    <span>
                      I agree to send these details to Varma by email so he can respond to my request.
                    </span>
                  </label>
                  <button type="submit" disabled={isConnectionSubmitting || !connectionConsent}>
                    {isConnectionSubmitting ? 'Sending…' : 'Send connection request'}
                  </button>
                </form>
              )}
              {isLoading && <div className="chat-message chat-message-assistant">Thinking…</div>}
            </div>
          </div>
          <form className="assistant-input" onSubmit={sendMessage}>
            <input aria-label="Type your message" placeholder="Type your message..." value={message} disabled={isLoading} onChange={(event) => setMessage(event.target.value)} />
            <button type="submit" aria-label="Send message" disabled={isLoading || !message.trim()}>➤</button>
          </form>
        </div>
      )}
      <button className="assistant-launcher" type="button" aria-label={open ? 'Hide AI assistant' : 'Open AI assistant'} onClick={() => setOpen((current) => !current)}>
        <img src={assistantOrb} alt="" /><i />
        {!open && <span className="assistant-prompt" aria-hidden="true">May I help you?</span>}
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
        <div className="hero-contact"><span><i className="bi bi-geo-alt"></i> Hyderabad, India</span><a href="mailto:vishnuvardhangopathi@gmail.com">✉ &nbsp; vishnuvardhangopathi@gmail.com</a></div>
        <div className="hero-actions"><a className="button button-primary" href="#projects">View My Projects <span><i className="bi bi-arrow-right-square-fill"></i></span></a><a className="button" href="/Vishnu_Varma_PythonGenAI_Resume.docx" download="Vishnu_Varma_PythonGenAI_Resume.docx">Download Resume <span><i className="bi bi-box-arrow-down"></i></span></a></div>
      </div>
      <div className="hero-visual" aria-hidden="true" />
      <div className="stats-strip">
        <div><i className="bi bi-star-fill" style={{ color: '#4db0ed' }}></i><strong>4+</strong><span>Major Projects</span></div><div><b><i className="bi bi-cloud-check-fill"></i></b><strong>9</strong><span>Deployed Apps</span></div><div><b>‹ ›</b><strong>15+</strong><span>Technologies</span></div><div><b>⚑</b><strong>2027</strong><span>B.Sc. CS (Expected)</span></div><div><b>♜</b><strong>5★</strong><span>HackerRank Python</span></div>
      </div>
    </section>
  )
}

function WhyHireMe() {
  const points = [['♧', 'Problem Solver', 'Builds real-world solutions'], ['▣', 'Full-Stack Perspective', 'Backend to frontend'], ['▤', 'AI Integration', 'Practical GenAI applications'], ['◉', 'Continuous Learner', 'Exploring and adapting to new tech'], ['⬟', 'Ownership', 'Design, build, and deploy']]
  return <section className="panel why-panel"><div className="why-copy"><p className="eyebrow">♧ &nbsp; WHY HIRE ME?</p><h2>Why Hire Me?</h2><p>I enjoy building applications that actually solve real problems. Over the past few years, I’ve worked on multiple full-stack projects involving backend APIs, database design, frontend interfaces, and Generative AI features. I like learning new technologies, exploring how they can be applied in practical applications, and then building and deploying them myself.<br />I’m comfortable working end-to-end, from designing the system and implementing the backend to creating a clean user interface and integrating AI capabilities like LLMs, RAG, and intelligent agents. I focus on writing clean code, understanding trade-offs, and building solutions that are useful, scalable, and can be improved over time.<br />If you’re looking for someone who can contribute to backend development, full-stack features, and AI-powered applications while learning and adapting quickly, I believe my projects and skills demonstrate that I can add value to your team.</p></div><div className="why-list">{points.map(([icon, title, text]) => <div className="why-point" key={title}><b>{icon}</b><span><strong>{title}</strong><small>{text}</small></span></div>)}</div></section>
}

function App() {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const soundEnabledRef = useRef(soundEnabled)
  const audioContextRef = useRef<AudioContext | null>(null)

  function toggleSound() {
    const enabled = !soundEnabledRef.current
    soundEnabledRef.current = enabled
    setSoundEnabled(enabled)
  }

  useEffect(() => {
    function playClickSound(event: MouseEvent) {
      if (!(event.target instanceof Element)) return
      const control = event.target.closest<HTMLElement>('button, a[href]')
      if (!control || control.matches(':disabled, [aria-disabled="true"]')) return
      if (control.classList.contains('sound-toggle')) return
      if (!soundEnabledRef.current || !('AudioContext' in window)) return

      const context = audioContextRef.current ?? new AudioContext()
      audioContextRef.current = context

      if (context.state === 'suspended') {
        void context.resume().then(() => playInterfaceSound(context)).catch((error: unknown) => {
          console.error('Unable to play the interface sound.', error)
        })
        return
      }

      playInterfaceSound(context)
    }

    document.addEventListener('click', playClickSound, true)
    return () => {
      document.removeEventListener('click', playClickSound, true)
      void audioContextRef.current?.close()
      audioContextRef.current = null
    }
  }, [])

  useEffect(() => {
    document.querySelectorAll<HTMLVideoElement>('video').forEach((video) => {
      video.muted = !soundEnabled
    })
  }, [soundEnabled])

  useEffect(() => {
    void fetch('https://portfolio-9jph.onrender.com/health')
      .then((response) => {
        if (!response.ok) {
          console.error(`The health check failed (${response.status}).`)
        }
      })
      .catch((error: unknown) => {
        console.error('Unable to reach the backend health endpoint.', error)
      })
  }, [])

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('.page-shell > section')
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)
    ) {
      return
    }

    sections.forEach((section) => section.classList.add('scroll-reveal'))

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          } else {
            entry.target.classList.remove('is-visible')
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -36px 0px' },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    function showNewTabArrow(event: MouseEvent) {
      if (!(event.target instanceof Element)) return

      const link = event.target.closest<HTMLAnchorElement>('a[target="_blank"]')
      if (!link) return
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const bounds = link.getBoundingClientRect()
      const arrow = document.createElement('span')
      arrow.className = 'new-tab-arrow'
      arrow.textContent = '↗'
      arrow.setAttribute('aria-hidden', 'true')
      arrow.style.left = `${Math.min(bounds.right, window.innerWidth - 24)}px`
      arrow.style.top = `${Math.max(bounds.top, 24)}px`
      document.body.append(arrow)

      const newTab = window.open('about:blank', '_blank')
      if (!newTab) {
        arrow.remove()
        return
      }

      event.preventDefault()
      newTab.opener = null
      window.setTimeout(() => {
        arrow.remove()
        newTab.location.replace(link.href)
      }, 500)
    }

    document.addEventListener('click', showNewTabArrow)
    return () => document.removeEventListener('click', showNewTabArrow)
  }, [])

  return (
    <>
      <Menu soundEnabled={soundEnabled} onToggleSound={toggleSound} />
      <main className="page-shell">
        <Hero />
        <WhyHireMe />
        <Skills />
        <Projects />
        <FunProjects />
        <ReactProjects />
        <Training />
        <About />
        <Achievements />
        <Contact />
      </main>
      <Assistant />
    </>
  )
}

export default App
