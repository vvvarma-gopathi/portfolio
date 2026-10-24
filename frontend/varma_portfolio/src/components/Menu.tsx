const links = [
  ['Home', '#home'],
  ['Projects', '#projects'],
  ['Skills', '#skills'],
  ['About', '#about'],
  ['Achievements', '#achievements'],
  ['Contact', '#contact'],
]

export default function Menu() {
  return (
    <header className="site-header">
      <a className="brand" href="#home"><span className="brand-mark">VV</span><span><strong>VISHNU VARDHAN VARMA GOPATHI</strong><small>Python | Full-Stack | Generative AI</small></span></a>
      <nav aria-label="Main navigation">{links.map(([label, href], index) => <a className={index === 0 ? 'active' : ''} href={href} key={label}>{label}</a>)}</nav>
      <div className="header-links"><a href="https://github.com/vvvarma-gopathi" aria-label="GitHub"><i className="devicon-github-original" aria-hidden="true" /></a><a href="https://linkedin.com/in/vvvarma66" aria-label="LinkedIn"><i className="devicon-linkedin-plain colored" aria-hidden="true" /></a><a className="resume-link" href="#about">▤ &nbsp; Resume</a></div>
    </header>
  )
}
