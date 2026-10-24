import aboutWorkspace from '../assets/about-workspace.png'

const details = [['⚑', 'Education', 'B.Sc. (Honours) Computer Science', 'Osmania University (2027)'], ['⌖', 'Location', 'Hyderabad, India'], ['♧', 'Interests', 'Building, Learning, Open Source', 'Problem Solving, Real-world AI'], ['◈', 'Focus', 'Python Full-Stack Development', 'Generative AI Applications']]

export default function About() {
  return <section className="panel about-panel" id="about">
    <div className="about-copy"><p className="eyebrow">♧ &nbsp; ABOUT ME</p>
      <h2>Vishnu Vardhan Varma</h2>
      <p>I’m a Computer Science student at Government Degree College Khairatabad (Osmania University), expected to graduate in 2027. I enjoy building full-stack applications with Python and modern web technologies, exploring Generative AI, and turning ideas into useful products. I like working on real-world problems, learning new technologies, and continuously improving my skills.</p>
      <a className="button" href="#contact">Download Resume &nbsp; →</a>
    </div>
    <div className="about-facts">{details.map(([icon, title, ...text]) => 
      <div className="about-fact" key={title}><b>{icon}</b>
      <span><strong>{title}</strong>
      {text.map((line) => <small key={line}>{line}</small>)}</span></div>)}
    </div>
    <div className="about-art"><img src={aboutWorkspace} alt="Research, learn, and grow at a developer workspace" /></div>
  </section>
}
