const projects = [
  {
    title: 'Shivanya Coffee House',
    image: '/shivanya-coffee-house.jpg',
    imageAlt: 'Shivanya Coffee House website with café menu and coffee offerings',
    technologies: ['React', 'JavaScript', 'HTML', 'CSS'],
    description: 'A coffee house frontend project designed to showcase a modern café website experience. It focuses on an attractive user interface, organized content presentation, and responsive layouts to highlight the coffee menu, café offerings, and brand identity.',
    focus: 'React component design, UI development, responsive styling, and frontend fundamentals.',
    liveUrl: 'https://shivanyacoffeehouse.netlify.app/',
  },
  {
    title: 'TSRTC Bus Booking Website',
    image: '/tsrtc-bus-booking.jpg',
    imageAlt: 'TSRTC bus booking website with route search and seat selection interface',
    technologies: ['React', 'JavaScript', 'HTML', 'CSS'],
    description: 'A bus booking frontend inspired by TSRTC’s public transportation services, designed to provide a convenient interface for exploring bus travel and booking workflows. It presents route-search options, travel details, and booking-related interactions through a structured, user-friendly interface.',
    focus: 'React UI development, reusable components, form handling, and travel-booking interface design.',
    liveUrl: 'https://tgsrtc.netlify.app/',
  },
]

export default function ReactProjects() {
  return (
    <section className="panel react-projects-panel" id="react-projects">
      <div className="section-heading">
        <div>
          <p className="eyebrow">✧ &nbsp; FRONTEND PROJECTS</p>
          <h2>My React Projects</h2>
        </div>
      </div>
      <div className="projects-grid">
        {projects.map((project) => (
          <article className="project-card fun-project-card" key={project.title}>
            <div className="fun-project-preview">
              <img src={project.image} alt={project.imageAlt} />
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
