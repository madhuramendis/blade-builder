"use client";
import { PageBlade } from "@/app/lib/bladeDefinitions";

export function BladePreview({ blade }: { blade: PageBlade }) {
  const d = blade.data;
  switch (blade.type) {
    case "platform-hero":        return <PlatformHero d={d} />;
    case "logo-scroll":          return <LogoScroll d={d} />;
    case "feature-grid":         return <FeatureGrid d={d} />;
    case "feature-deep-dive":    return <FeatureDeepDive d={d} />;
    case "deployment-options":   return <DeploymentOptions d={d} />;
    case "stats-bar":            return <StatsBar d={d} />;
    case "analyst-awards":       return <AnalystAwards d={d} />;
    case "customer-testimonial": return <CustomerTestimonial d={d} />;
    case "page-cta":             return <PageCTA d={d} />;
    default:                     return <div className="p-5 text-center text-muted">Unknown blade: {blade.type}</div>;
  }
}

type D = Record<string, string>;

/* ─── Platform Hero ─────────────────────────────────────────── */
function PlatformHero({ d }: { d: D }) {
  return (
    <section className="wso2-hero text-center">
      <div className="container py-2">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            {d.eyebrow && <div className="wso2-hero-eyebrow">{d.eyebrow}</div>}
            <h1 className="wso2-hero-headline">
              {d.headline || <span className="wso2-placeholder">Headline goes here…</span>}
            </h1>
            {d.sub && <p className="wso2-hero-sub">{d.sub}</p>}
            <div className="d-flex gap-3 justify-content-center flex-wrap mt-4">
              {d.cta1 && <button className="wso2-btn-primary">{d.cta1}</button>}
              {d.cta2 && <button className="wso2-btn-outline">{d.cta2}</button>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Logo Scroll ───────────────────────────────────────────── */
function LogoScroll({ d }: { d: D }) {
  const logos = (d.logos || "").split(",").map(l => l.trim()).filter(Boolean);
  return (
    <section className="wso2-logobar">
      <div className="container text-center">
        {d.title && <p className="wso2-logobar-label">{d.title}</p>}
        <div className="d-flex flex-wrap gap-2 justify-content-center align-items-center">
          {logos.map((l, i) => <span key={i} className="wso2-logo-chip">{l}</span>)}
        </div>
      </div>
    </section>
  );
}

/* ─── Feature Grid ──────────────────────────────────────────── */
function FeatureGrid({ d }: { d: D }) {
  const cols = d.cols === "2" ? 2 : 3;
  const features = [
    { icon: d.f1i, title: d.f1t, desc: d.f1d },
    { icon: d.f2i, title: d.f2t, desc: d.f2d },
    { icon: d.f3i, title: d.f3t, desc: d.f3d },
  ].filter(f => f.title);
  return (
    <section className="wso2-features">
      <div className="container">
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8 text-center">
            {d.eyebrow && <div className="wso2-eyebrow">{d.eyebrow}</div>}
            <h2 className="wso2-section-title">
              {d.title || <span className="wso2-placeholder">Section title…</span>}
            </h2>
            {d.subtitle && <p className="wso2-section-sub">{d.subtitle}</p>}
          </div>
        </div>
        <div className={`row row-cols-1 row-cols-md-${cols} g-4`}>
          {features.map((f, i) => (
            <div key={i} className="col">
              <div className="wso2-feature-card h-100">
                {f.icon && <div className="wso2-feature-icon">{f.icon}</div>}
                <h4 className="wso2-feature-title">{f.title}</h4>
                {f.desc && <p className="wso2-feature-desc mb-0">{f.desc}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Feature Deep-Dive ─────────────────────────────────────── */
function FeatureDeepDive({ d }: { d: D }) {
  const imgRight = d.imgside !== "left";
  const textCol = (
    <div className="col-md-6 d-flex align-items-center">
      <div className="wso2-split-text">
        {d.eyebrow && <div className="wso2-eyebrow">{d.eyebrow}</div>}
        <h3 className="wso2-split-headline">
          {d.headline || <span className="wso2-placeholder">Headline…</span>}
        </h3>
        {d.body && <p className="wso2-split-body">{d.body}</p>}
        {d.cta && <button className="wso2-link-btn">{d.cta} →</button>}
      </div>
    </div>
  );
  const imgCol = (
    <div className="col-md-6">
      <div className="wso2-split-img" style={{ background: d.imgbg || "#f5f7fa" }}>
        <span className="wso2-split-img-label">{d.imglabel || "Screenshot"}</span>
      </div>
    </div>
  );
  return (
    <section className="wso2-split">
      <div className="container-fluid p-0">
        <div className={`row g-0${imgRight ? "" : " flex-md-row-reverse"}`}>
          {textCol}
          {imgCol}
        </div>
      </div>
    </section>
  );
}

/* ─── Deployment Options ────────────────────────────────────── */
function DeploymentOptions({ d }: { d: D }) {
  const showHybrid = d.show_hybrid !== "no";
  const options = [
    { key: "self",   label: "Self-hosted", bullets: ["Complete data sovereignty", "Air-gapped environment support", "Kubernetes, Docker, VM, or bare metal", "Bring your own CI/CD pipeline"], cta: d.cta1 },
    ...(showHybrid ? [{ key: "hybrid", label: "Hybrid", bullets: ["Data plane stays in your network", "Fully managed control & observability", "Cloud agnostic, no vendor lock-in", "Pay-as-you-go pricing available"], cta: d.cta2 }] : []),
    { key: "saas",   label: "SaaS / Cloud", bullets: ["99.99% SLA with automated failover", "Continuous updates, zero downtime", "Multi-region availability", "Pay-as-you-grow pricing"], cta: showHybrid ? d.cta3 : d.cta2 },
  ];
  return (
    <section className="wso2-deploy">
      <div className="container">
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8 text-center">
            <h2 className="wso2-section-title">{d.title || "Run it your way."}</h2>
            {d.subtitle && <p className="wso2-section-sub" style={{ maxWidth: 660, margin: "0 auto" }}>{d.subtitle}</p>}
          </div>
        </div>
        <div className={`row row-cols-1 row-cols-md-${options.length} g-4 mb-4`}>
          {options.map(opt => (
            <div key={opt.key} className="col">
              <div className="wso2-deploy-card h-100">
                <h4 className="wso2-deploy-label">{opt.label}</h4>
                <ul className="wso2-deploy-list list-unstyled flex-grow-1">
                  {opt.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
                {opt.cta && <button className="wso2-btn-ghost mt-3">{opt.cta}</button>}
              </div>
            </div>
          ))}
        </div>
        <p className="wso2-deploy-note text-center">
          Your vendor choice shouldn&apos;t determine your deployment requirements. Evaluate WSO2 in the environment that makes sense for you. No constraints, no artificial limitations.
        </p>
      </div>
    </section>
  );
}

/* ─── Stats Bar ─────────────────────────────────────────────── */
function StatsBar({ d }: { d: D }) {
  const stats = [
    [d.s1n, d.s1l], [d.s2n, d.s2l], [d.s3n, d.s3l], [d.s4n, d.s4l],
  ].filter(([n]) => n) as [string, string][];
  return (
    <section className="wso2-stats">
      <div className="container">
        <div className="row justify-content-center">
          {stats.map(([num, label], i) => (
            <div key={i} className="col-6 col-md-3">
              <div className="wso2-stat-item text-center">
                <div className="wso2-stat-num">{num}</div>
                <div className="wso2-stat-label">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Analyst Awards ────────────────────────────────────────── */
function AnalystAwards({ d }: { d: D }) {
  const awards = [
    { org: d.a1org, head: d.a1head, cta: d.a1cta },
    { org: d.a2org, head: d.a2head, cta: d.a2cta },
    { org: d.a3org, head: d.a3head, cta: d.a3cta },
  ].filter(a => a.org);
  return (
    <section className="wso2-awards">
      <div className="container">
        {d.title && (
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              <h2 className="wso2-section-title light">{d.title}</h2>
            </div>
          </div>
        )}
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {awards.map((a, i) => (
            <div key={i} className="col">
              <div className="wso2-award-card h-100">
                <div className="wso2-award-org">{a.org}</div>
                <p className="wso2-award-head flex-grow-1">{a.head}</p>
                {a.cta && <button className="wso2-link-btn-light">{a.cta} →</button>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Customer Testimonial ──────────────────────────────────── */
function CustomerTestimonial({ d }: { d: D }) {
  return (
    <section className="wso2-testimonial">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="wso2-quote-mark">&ldquo;</div>
            <blockquote className="wso2-quote-text">
              {d.quote || <span className="wso2-placeholder">Quote goes here…</span>}
            </blockquote>
            <div className="d-flex align-items-center gap-3 mt-4">
              <div className="wso2-quote-avatar">{(d.name || "?")[0]}</div>
              <div>
                <div className="wso2-quote-name">{d.name}</div>
                <div className="wso2-quote-title">{d.title}{d.company ? ` · ${d.company}` : ""}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Page CTA ──────────────────────────────────────────────── */
function PageCTA({ d }: { d: D }) {
  return (
    <section className="wso2-page-cta text-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h2 className="wso2-cta-headline">
              {d.headline || <span className="wso2-placeholder">Headline…</span>}
            </h2>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              {d.cta1 && <button className="wso2-btn-primary">{d.cta1}</button>}
              {d.cta2 && <button className="wso2-btn-outline">{d.cta2}</button>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
