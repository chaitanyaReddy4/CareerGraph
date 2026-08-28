function PageHeader({ eyebrow, title, description, actions, meta }) {
  return (
    <div className="page-header">
      <div>
        {eyebrow ? <p className="page-header__eyebrow">{eyebrow}</p> : null}
        <h2 className="page-header__title">{title}</h2>
        {description ? (
          <p className="page-header__description">{description}</p>
        ) : null}
      </div>

      {actions || meta ? (
        <div className="page-header__side">
          {meta}
          {actions}
        </div>
      ) : null}
    </div>
  );
}

export default PageHeader;
