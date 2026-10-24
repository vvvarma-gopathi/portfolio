import 'devicon/devicon.min.css'

const groups = [
  {
    title: 'Programming',
    skills: [
      ['Python', 'devicon-python-plain colored'],
      ['JavaScript', 'devicon-javascript-plain colored'],
      ['Data Structures & Algorithms', 'devicon-leetcode-plain colored'],
    ],
  },
  {
    title: 'Frontend',
    skills: [
      ['React', 'devicon-react-original colored'],
      ['HTML5', 'devicon-html5-plain colored'],
      ['CSS3', 'devicon-css3-plain colored'],
      ['Tailwind CSS', 'devicon-tailwindcss-plain colored'],
    ],
  },
  {
    title: 'Backend & APIs',
    skills: [
      ['FastAPI', 'devicon-fastapi-plain colored'],
      ['Django', 'devicon-django-plain colored'],
      ['REST APIs', 'devicon-djangorest-plain colored'],
      ['Pydantic', 'devicon-python-plain colored'],
    ],
  },
  {
    title: 'Databases & ORM',
    skills: [
      ['PostgreSQL', 'devicon-postgresql-plain colored'],
      ['MongoDB', 'devicon-mongodb-plain colored'],
      ['MySQL', 'devicon-mysql-plain colored'],
      ['SQLAlchemy', 'devicon-sqlalchemy-plain colored'],
    ],
  },
  {
    title: 'GenAI & Retrieval',
    skills: [
      ['LLMs', 'devicon-python-plain colored'],
      ['RAG', ''],
      ['Embeddings',''],
      ['Vector DB', ''],
      ['Prompt Engineering', 'devicon-jupyter-plain colored'],
      ['AI Agent Tool Calling', 'devicon-python-plain colored'],
    ],
  },
  {
    title: 'Tools & Others',
    skills: [
      ['Git', 'devicon-git-plain colored'],
      ['GitHub', 'devicon-github-original'],
      ['Docker', 'devicon-docker-plain colored'],
      ['AWS', 'devicon-amazonwebservices-original colored'],
      ['JSON', 'devicon-json-plain colored'],
      ['Async Programming', 'devicon-nodejs-plain colored'],
      ['OOP', 'devicon-python-plain colored'],
      ['Web Scraping', 'devicon-selenium-original colored'],
    ],
  },
]

export default function Skills() {
  return (
    <section className="panel skills-panel" id="skills">
      <p className="eyebrow">TECHNICAL SKILLS</p>
      <h2>Technologies I Work With</h2>
      <div className="skill-grid">
        {groups.map((group) => (
          <article className="skill-card" key={group.title}>
            <h3>{group.title}</h3>
            <ul className="skill-list">
              {group.skills.map(([name, icon]) => (
                <li key={name}>
                  <i className={icon} aria-hidden="true" />
                  <span>{name}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}
