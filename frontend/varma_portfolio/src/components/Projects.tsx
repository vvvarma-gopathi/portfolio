import { useRef, useState } from 'react'

const projects = [
  { title: 'AI Pulse', state: 'Deployed', theme: 'pulse', subtitle: 'Research, Discover and Generate Ideas with AI', description: 'An AI research platform that discovers trending topics, startups and open-source projects using custom search and content extraction workflows. Generates research-informed project ideas and suggests improvements for existing projects.', tags: ['Python', 'FastAPI', 'RAG', 'Web Scraping', 'LLM API'], live: 'Live Demo' , url:'https://ai-pulse-frontend-orcin.vercel.app', demoVideo: '/ai-pulse-demo.mp4' },
  { title: 'Agile Bot', state: 'In Development', theme: 'agile', subtitle: 'AI-Powered Agile Project Management', description: 'A Jira-inspired project management application supporting projects, sprints, and tasks. An agent answers project management queries, uses backend tools and RAG, analyzes delays, and suggests improvements.', tags: ['Python', 'FastAPI', 'PostgreSQL', 'RAG', 'LLM APIs'], live: 'Comming Soon', demoVideo: '/agile-bot-demo.mp4' },
  { title: 'AI Resume Analyzer', state: 'Deployed', theme: 'resume', subtitle: 'Get ATS Score and Improve Your Resume', description: 'Accepts resumes through file uploads or pasted text and evaluates them against a job description. Uses LLM to analyze alignment, provide ATS score, and suggest improvements.', tags: ['Python', 'LLM API', 'Prompt Engineering', 'NLP', 'Web App'], live: 'Live Demo', demoVideo: '/Resume_Analyzer.mp4' },
  { title: 'Cortex AI', state: 'Deployed', theme: 'cortex', subtitle: 'Conversational AI with Memory', description: 'An AI assistant that answers queries using relevant information from a vector database and maintains conversation memory for context-aware assistance.', tags: ['Python', 'RAG', 'Vector DB', 'Embeddings', 'LLM APIs'], live: 'Live Demo', demoVideo: '/cortex-ai-demo.mp4' },
]

function ProjectPoster({ theme }: { theme: string }) {
  if (theme === 'resume') return <div className="project-preview-poster resume-preview"><b>◉ &nbsp; Resume Analyzer</b><span>ATS score</span><strong>85<small>%</small></strong><i /><i /></div>
  if (theme === 'agile') return <div className="project-preview-poster agile-preview"><b>◉ &nbsp; Board</b><div className="board-columns"><span>To Do<i /><i /></span><span>In Progress<i /><i /></span><span>Done<i /></span></div></div>
  if (theme === 'cortex') return <div className="project-preview-poster cortex-preview"><b>◉ &nbsp; Cortex</b><div className="chat-lines"><i /><i /><i /><i /></div><span>Ask anything...　➤</span></div>
  return <div className="project-preview-poster pulse-preview"><b>◉ &nbsp; AI Pulse</b><div className="pulse-orb">✧</div><span>Discover what's next</span></div>
}

function ProjectPreview({ title, theme, demoVideo }: { title: string; theme: string; demoVideo: string }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const playDemo = () => {
    const video = videoRef.current
    if (!video) return

    setVideoError(false)
    void video.play().then(() => setIsPlaying(true)).catch(() => setVideoError(true))
  }

  return <div className="project-preview">
    <video ref={videoRef} className={`project-demo-video${isPlaying ? ' is-playing' : ''}`} src={demoVideo} controls playsInline preload="none" aria-label={`${title} project demo`} onError={() => setVideoError(true)} />
    {!isPlaying && <>
      <ProjectPoster theme={theme} />
      {videoError && <span className="project-demo-error" role="status">Demo video unavailable. Check the video file.</span>}
      <button className="project-demo-button" type="button" onClick={playDemo}>▶ &nbsp; Play Demo</button>
    </>}
  </div>
}

export default function Projects() {
  return (
    <section className="panel projects-panel" id="projects">
      <div className="section-heading"><div><p className="eyebrow">✧ &nbsp; FEATURED PROJECTS</p><h2>My Projects</h2></div><a href="#contactz">View All Projects &nbsp; →</a></div>
      <div className="projects-grid">{projects.map((project) => <article className="project-card" key={project.title}><ProjectPreview title={project.title} theme={project.theme} demoVideo={project.demoVideo} /><div className="project-content"><span className={`status status-${project.state === 'Deployed' ? 'deployed' : 'development'}`}>● &nbsp;{project.state}</span><h3>{project.title}</h3><p className="project-subtitle">{project.subtitle}</p><p className="project-description">{project.description}</p><div className="tag-row">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><div className="project-links"><a href={project.url}>{project.live} &nbsp; →</a><a href="#contact">View Details &nbsp; →</a></div></div></article>)}</div>
    </section>
  )
}
