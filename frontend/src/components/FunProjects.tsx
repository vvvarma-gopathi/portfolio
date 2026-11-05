type FunProject = {
  title: string
  preview:
    | { type: 'single'; src: string; alt: string }
    | { type: 'pair'; images: { src: string; alt: string }[] }
  technologies: string[]
  description: string
  focus: string
  liveUrl: string
}

const projects: FunProject[] = [
  {
    title: 'Search Engine Agent',
    preview: {
      type: 'single',
      src: '/search-engine-agent.png',
      alt: 'Search Engine Agent showing an answer and its web sources',
    },
    technologies: ['Python', 'FastAPI', 'Web Search', 'LLM Integration'],
    description: 'A lightweight, stateless search agent that retrieves relevant web results based on a user’s query and presents them with useful summaries and source URLs. It limits search queries per request and controls input and token usage to keep searches efficient, without user accounts or persistent search history.',
    focus: 'Web discovery, API design, stateless architecture, and resource management.',
    liveUrl: 'https://searchengine-gilt.vercel.app/',
  },
  {
    title: 'StockAnalyzeAgent | Stock Research Agent',
    preview: {
      type: 'pair',
      images: [
        { src: '/stock-research-analysis.png', alt: 'Stock research agent AI assessment with recommendation and supporting evidence' },
        { src: '/stock-research-dashboard.png', alt: 'Stock dashboard with company price, market metrics, and price history chart' },
      ],
    },
    technologies: ['Python', 'FastAPI', 'Financial Data APIs', 'Google Gemini', 'React'],
    description: 'An AI-powered stock research agent that combines recent stock prices and financial news to generate AI-assisted BUY, SELL, or HOLD analysis. It brings market data, relevant news articles, price visualizations, and LLM-generated insights together to help explore market trends and understand the reasoning behind an analysis.',
    focus: 'API integration, financial data processing, news retrieval, AI-assisted analysis, and data visualization.',
    liveUrl: 'https://stock-analyzer-agent.vercel.app/',
  },
]

export default function FunProjects() {
  return (
    <section className="panel fun-projects-panel" id="fun-projects">
      <div className="section-heading">
        <div>
          <p className="eyebrow">✧ &nbsp; SIDE PROJECTS</p>
          <h2>My Fun Projects</h2>
        </div>
      </div>
      <div className="projects-grid">
        {projects.map((project) => (
          <article className="project-card fun-project-card" key={project.title}>
            <div className={`fun-project-preview${project.preview.type === 'pair' ? ' fun-project-image-pair' : ''}`}>
              {project.preview.type === 'pair'
                ? project.preview.images.map((image) => <img key={image.src} src={image.src} alt={image.alt} />)
                : <img src={project.preview.src} alt={project.preview.alt} />}
            </div>
            <div className="project-content">
              <h3>{project.title}</h3>
              <p className="project-subtitle">{project.technologies.join(' · ')}</p>
              <p className="project-description">{project.description}</p>
              <p className="fun-project-focus"><strong>Focus:</strong> {project.focus}</p>
              <a className="button button-primary fun-project-live-link" href={project.liveUrl} target="_blank" rel="noopener noreferrer">Live Demo <span>↗</span></a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
