const contacts = [
  ['✉', 'Email', 'vishnuvardhangopathi@gmail.com', 'I usually respond within 24 hours.', 'mailto:vishnuvardhangopathi@gmail.com'],
  ['in', 'LinkedIn', 'linkedin.com/in/vvvarma66', 'Let’s connect professionally.', 'https://linkedin.com/in/vvvarma66'],
  ['◉', 'GitHub', 'github.com/vvarma-gopathi', 'Check out my projects and code.', 'https://github.com/vvvarma-gopathi'],
]

export default function Contact() {
  return <><section className="panel contact-panel" id="contact"><p className="eyebrow">♧ &nbsp; LET’S CONNECT</p><div className="contact-heading"><h2>Get In Touch</h2><p>Open to opportunities, collaborations, and interesting projects.</p></div><div className="contact-grid">{contacts.map(([icon, title, detail, caption, link]) => <a className="contact-card" href={link} key={title}><b>{icon}</b><span><strong>{title}</strong><small className="contact-detail">{detail}</small><small>{caption}</small></span></a>)}</div></section><footer className="site-footer"><a className="brand footer-brand" href="#home"><span className="brand-mark">VV</span><span><strong>VISHNU VARDHAN VARMA</strong><small>Engineering useful AI with Python, modern web technologies, and LLMs.</small></span></a><span>Built with <b>♥</b> by Varma</span><a className="back-top" href="#home" aria-label="Back to top">↑</a></footer></>
}
