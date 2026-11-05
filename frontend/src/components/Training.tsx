const learningAreas = [
  ['bi bi-code-slash', 'Python Full Stack Development'],
  ['bi bi-braces', 'FastAPI and REST API Development'],
  ['bi bi-database', 'Database Management (PostgreSQL, MongoDB)'],
  ['bi bi-window', 'React and Modern Frontend Development'],
  ['bi bi-stars', 'Generative AI and LLM Integration'],
  ['bi bi-diagram-3', 'AI Agents and RAG Architecture'],
]

export default function Training() {
  return (
    <section className="panel training-panel" id="training">
      <div className="section-heading training-heading">
        <div>
          <p className="eyebrow"><i className="bi bi-mortarboard" aria-hidden="true" /> &nbsp; PROFESSIONAL DEVELOPMENT</p>
          <h2>Current Training</h2>
        </div>
        <span className="training-status"><i aria-hidden="true" /> Currently Pursuing</span>
      </div>
      <article className="training-card">
        <div className="training-overview">
          <span className="training-mark" aria-hidden="true"><img src="src\assets\student_tribe.png" alt="Student Tribe" style={{width: '42px', height: '42px', borderRadius: '25%'}}/></span>
          <div>
            <h3>Full Stack Python &amp; Generative AI Trainee</h3>
            <p className="training-organization">Student Tribe</p>
          </div>
        </div>
        <p className="training-description">
          Currently undergoing training at Student Tribe, focusing on Full Stack Python Development and Generative AI. Building practical skills in backend development, modern web technologies, API development, and AI-powered application development.
        </p>
        <h4 className="training-subheading">Key Learning Areas</h4>
        <ul className="training-areas">
          {learningAreas.map(([icon, area]) => (
            <li key={area}><i className={icon} aria-hidden="true" /><span>{area}</span></li>
          ))}
        </ul>
      </article>
    </section>
  )
}
