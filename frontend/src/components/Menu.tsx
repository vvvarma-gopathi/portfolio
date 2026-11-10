const links = [
  ['Home', '#home'],
  ['Projects', '#projects'],
  ['Skills', '#skills'],
  ['About', '#about'],
  ['Training', '#training'],
  ['Achievements', '#achievements'],
  ['Contact', '#contact'],
]

type MenuProps = {
  soundEnabled: boolean
  onToggleSound: () => void
}

export default function Menu({ soundEnabled, onToggleSound }: MenuProps) {
  return (
    <header className="site-header">
      <a className="brand" href="#home"><span className="brand-mark">VV</span><span><strong>VISHNU VARDHAN VARMA GOPATHI</strong><small>Python | Full-Stack | Generative AI</small></span></a>
      <nav aria-label="Main navigation">{links.map(([label, href], index) => <a className={index === 0 ? 'active' : ''} href={href} key={label}>{label}</a>)}</nav>
      <div className="header-links"><a href="https://github.com/vvvarma-gopathi" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><i className="devicon-github-original" aria-hidden="true" /></a><a href="https://linkedin.com/in/vvvarma66" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i className="devicon-linkedin-plain colored" aria-hidden="true" /></a><button className="sound-toggle" type="button" aria-label={soundEnabled ? 'Mute all sound' : 'Enable all sound'} title={soundEnabled ? 'Mute interface and video sounds' : 'Enable interface and video sounds'} aria-pressed={soundEnabled} onClick={onToggleSound}><i className={`bi ${soundEnabled ? 'bi-volume-up-fill' : 'bi-volume-mute-fill'}`} aria-hidden="true" /></button><a className="resume-link" href="/Vishnu_Varma_PythonGenAI_Resume.docx" download="Vishnu_Varma_PythonGenAI_Resume.docx"><i className="bi bi-box-arrow-down"></i> Resume</a></div>
    </header>
  )
}
