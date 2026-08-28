function SkillTag({ children, tone = "neutral" }) {
  return <span className={`skill-tag skill-tag--${tone}`}>{children}</span>;
}

export default SkillTag;
