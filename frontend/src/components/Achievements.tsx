const achievements = [
  ['🏆', 'HackerRank Python', '5-Star Python badge', 'purple'],
  ['▤', 'HackerRank SQL', 'SQL skill credential', 'blue'],
  ['‹ ›', 'GeeksforGeeks', '160 Days of Problem Solving', 'green'],
  ['🎓', 'Udemy', 'Prompt Engineering', 'gold'],
  ['‹ ›', '30 Days of Code', 'Completed HackerRank 30 Days of Code', 'green'],
]

export default function Achievements() {
  return <section className="panel achievements-panel" id="achievements"><p className="eyebrow">◉ &nbsp; CERTIFICATIONS &amp; ACHIEVEMENTS</p><h2>Certifications &amp; Milestones</h2><div className="achievement-grid">{achievements.map(([icon, title, detail, color]) => <article className="achievement-card" key={title}><b className={`achievement-icon ${color}`}>{icon}</b><span><strong>{title}</strong><small>{detail}</small></span></article>)}</div></section>
}
