import CmsImage from '@/components/ui/CmsImage';
import type { Educator } from '@/lib/cms/educators';

/**
 * The Education page's educators, from Studio (Educators): a portrait card each with the subject
 * in gold capitals, the name and one line of qualification or experience. Four across on wide
 * screens, two on tablets, a sideways scroll on phones. Renders nothing until there is one.
 */
export default function Educators({
  id,
  eyebrow,
  heading,
  intro,
  educators,
  tone = 'light',
}: {
  id: string;
  eyebrow: string;
  heading: string;
  intro?: string;
  educators: Educator[];
  tone?: 'light' | 'dark';
}) {
  if (!educators.length) return null;
  return (
    <section id={id} className="section educators-section" data-tone={tone} aria-labelledby={`${id}-title`}>
      <div className="container">
        <div className="section-head">
          <p className="h3" style={{ color: 'var(--fg-muted)' }} data-reveal>
            {eyebrow}
          </p>
          <h2 id={`${id}-title`} className="h2" data-split>
            {heading}
          </h2>
          {intro ? (
            <p className="lead" data-reveal>
              {intro}
            </p>
          ) : null}
        </div>
        <ul className="educators" data-reveal-group>
          {educators.map((e, i) => (
            <li key={`${e.name}-${i}`} className="educator">
              <figure>
                <div className="educator__photo">
                  <CmsImage src={e.photo.src} alt={e.photo.alt} fill sizes="(max-width: 699px) 72vw, (max-width: 1099px) 46vw, 24vw" />
                </div>
                <figcaption>
                  <span className="educator__subject">{e.subject}</span>
                  <span className="educator__name">{e.name}</span>
                  {e.sample ? <span className="educator__meta">Sample profile</span> : e.credential ? <span className="educator__meta">{e.credential}</span> : null}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
