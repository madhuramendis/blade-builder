export type FieldType = "text" | "textarea" | "select";

export interface FieldDef {
  id: string;
  label: string;
  type: FieldType;
  maxLength: number;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  options?: string[];
}

export interface BladeDef {
  label: string;
  description: string;
  icon: string;
  iconBg: string;
  maxInstances: number;
  fields: FieldDef[];
  defaults: Record<string, string>;
}

export type BladeType = keyof typeof BLADE_DEFS;

export interface PageBlade {
  id: string;
  type: BladeType;
  label: string;
  data: Record<string, string>;
}

export const BLADE_DEFS = {

  "platform-hero": {
    label: "Hero section",
    description: "Dark full-width hero with headline + CTAs",
    icon: "H",
    iconBg: "#1a1f36",
    maxInstances: 1,
    fields: [
      { id: "eyebrow",  label: "Eyebrow tag",         type: "text"     as FieldType, maxLength: 60,  placeholder: 'e.g. "Agent Platform"' },
      { id: "headline", label: "Headline",             type: "text"     as FieldType, maxLength: 90,  placeholder: "The Enterprise Control Plane for AI Agents", required: true },
      { id: "sub",      label: "Subheadline",          type: "textarea" as FieldType, maxLength: 250, placeholder: "One to two sentences expanding the headline.", rows: 3 },
      { id: "cta1",     label: "Primary CTA label",    type: "text"     as FieldType, maxLength: 35,  placeholder: "Get started free" },
      { id: "cta2",     label: "Secondary CTA label",  type: "text"     as FieldType, maxLength: 35,  placeholder: "Schedule a demo" },
    ],
    defaults: {
      eyebrow:  "API Platform",
      headline: "The Open Platform to Control APIs, AI, and MCP",
      sub:      "Ship, govern, and monetize your APIs, AI, and MCP across any cloud, any gateway. Zero lock-in.",
      cta1:     "Sign up for free",
      cta2:     "Download now",
    },
  },

  "logo-scroll": {
    label: "Customer logo bar",
    description: "Scrolling strip of enterprise customer logos",
    icon: "L",
    iconBg: "#f5f7fa",
    maxInstances: 2,
    fields: [
      { id: "title",  label: "Section label",                    type: "text"     as FieldType, maxLength: 60,  placeholder: "Trusted by enterprises worldwide" },
      { id: "logos",  label: "Company names (comma-separated)",  type: "textarea" as FieldType, maxLength: 300, placeholder: "Wipro, JLR, Kotak, Hilton, Saudi Aramco, Honda, UNICEF, Renault", rows: 3 },
    ],
    defaults: {
      title: "Trusted by enterprises worldwide",
      logos: "Wipro, JLR, Kotak, Hilton, Saudi Aramco, Honda, UNICEF, Renault, ABSA, Travis Perkins",
    },
  },

  "feature-grid": {
    label: "Feature grid",
    description: "3-column grid of icon, title, and description",
    icon: "G",
    iconBg: "#eef2ff",
    maxInstances: 3,
    fields: [
      { id: "eyebrow",  label: "Eyebrow",        type: "text"     as FieldType, maxLength: 50,  placeholder: "Why enterprises choose us" },
      { id: "title",    label: "Section title",  type: "text"     as FieldType, maxLength: 80,  placeholder: "Everything you need, nothing you don't", required: true },
      { id: "subtitle", label: "Subtitle",       type: "textarea" as FieldType, maxLength: 180, placeholder: "Optional intro sentence.", rows: 2 },
      { id: "cols",     label: "Columns",        type: "select"   as FieldType, maxLength: 1,   options: ["3", "2"] },
      { id: "f1i", label: "Feature 1 icon", type: "text" as FieldType, maxLength: 2, placeholder: "⚡" },
      { id: "f1t", label: "Feature 1 title", type: "text" as FieldType, maxLength: 50, placeholder: "Blazing fast", required: true },
      { id: "f1d", label: "Feature 1 description", type: "textarea" as FieldType, maxLength: 140, placeholder: "Short description.", rows: 2 },
      { id: "f2i", label: "Feature 2 icon", type: "text" as FieldType, maxLength: 2, placeholder: "🔒" },
      { id: "f2t", label: "Feature 2 title", type: "text" as FieldType, maxLength: 50, placeholder: "Secure by default", required: true },
      { id: "f2d", label: "Feature 2 description", type: "textarea" as FieldType, maxLength: 140, placeholder: "Short description.", rows: 2 },
      { id: "f3i", label: "Feature 3 icon", type: "text" as FieldType, maxLength: 2, placeholder: "🎨" },
      { id: "f3t", label: "Feature 3 title", type: "text" as FieldType, maxLength: 50, placeholder: "Beautiful UI", required: true },
      { id: "f3d", label: "Feature 3 description", type: "textarea" as FieldType, maxLength: 140, placeholder: "Short description.", rows: 2 },
    ],
    defaults: {
      eyebrow: "Why enterprises choose WSO2",
      title: "The most open platform on the market",
      subtitle: "Built on open source. Deployed anywhere. No vendor lock-in.",
      cols: "3",
      f1i: "🔓", f1t: "Zero vendor lock-in",        f1d: "100% open source. Deploy as SaaS, self-hosted, or hybrid without re-engineering your stack.",
      f2i: "☁️",  f2t: "Deployment flexibility",     f2d: "On-premises, private cloud, public cloud, or fully managed SaaS. Your choice, always.",
      f3i: "⚡",  f3t: "AI-ready from day one",      f3d: "Built-in MCP, LLM gateway, agent identity, and agentic workflow support across all platforms.",
    },
  },

  "feature-deep-dive": {
    label: "Feature deep-dive",
    description: "Image + text side-by-side feature section",
    icon: "F",
    iconBg: "#f0fdf4",
    maxInstances: 6,
    fields: [
      { id: "eyebrow",  label: "Eyebrow",       type: "text"     as FieldType, maxLength: 50,  placeholder: "Observability" },
      { id: "headline", label: "Headline",      type: "text"     as FieldType, maxLength: 80,  placeholder: "See every agent trace in real time", required: true },
      { id: "body",     label: "Body copy",     type: "textarea" as FieldType, maxLength: 350, placeholder: "2–3 sentences of supporting copy.", rows: 4 },
      { id: "cta",      label: "CTA label",     type: "text"     as FieldType, maxLength: 40,  placeholder: "Learn more" },
      { id: "imgside",  label: "Image side",    type: "select"   as FieldType, maxLength: 5,   options: ["right", "left"] },
      { id: "imglabel", label: "Image label",   type: "text"     as FieldType, maxLength: 60,  placeholder: "Product screenshot" },
      { id: "imgbg",    label: "Image bg colour", type: "select" as FieldType, maxLength: 20,  options: ["#f5f7fa", "#eef2ff", "#f0fdf4", "#fdf4ff", "#fff7ed", "#1a1f36"] },
    ],
    defaults: {
      eyebrow:  "Observability and evaluations",
      headline: "See every agent trace and drill into LLM interactions",
      body:     "Monitor agents continuously to track performance at runtime using pre-built or code evaluators. Evaluate the agent's behaviour against a predefined set of tasks with OTEL-compatible tracing for rapid root cause analysis.",
      cta:      "Explore observability",
      imgside:  "right",
      imglabel: "Observability dashboard screenshot",
      imgbg:    "#eef2ff",
    },
  },

  "deployment-options": {
    label: "Deployment options",
    description: "Self-hosted / Hybrid / SaaS option cards",
    icon: "D",
    iconBg: "#fff7ed",
    maxInstances: 1,
    fields: [
      { id: "title",      label: "Section title",      type: "text" as FieldType, maxLength: 60,  placeholder: "Run it your way." },
      { id: "subtitle",   label: "Section subtitle",   type: "textarea" as FieldType, maxLength: 200, placeholder: "WSO2 products are architected to deploy wherever your infrastructure lives…", rows: 2 },
      { id: "show_hybrid",label: "Show hybrid option", type: "select" as FieldType, maxLength: 3,  options: ["yes", "no"] },
      { id: "cta1",       label: "Option 1 CTA label", type: "text" as FieldType, maxLength: 25,  placeholder: "Download now" },
      { id: "cta2",       label: "Option 2 CTA label", type: "text" as FieldType, maxLength: 25,  placeholder: "Sign up now" },
      { id: "cta3",       label: "Option 3 CTA label", type: "text" as FieldType, maxLength: 25,  placeholder: "Sign up now" },
    ],
    defaults: {
      title:       "Run it your way.",
      subtitle:    "WSO2 products are architected to deploy wherever your infrastructure lives — on-premises, private cloud, public cloud, or fully managed SaaS. No lock-in. No compromises.",
      show_hybrid: "yes",
      cta1: "Download now",
      cta2: "Sign up now",
      cta3: "Sign up now",
    },
  },

  "stats-bar": {
    label: "Stats bar",
    description: "Large numbers + labels in a dark band",
    icon: "S",
    iconBg: "#1a1f36",
    maxInstances: 2,
    fields: [
      { id: "s1n", label: "Stat 1 number", type: "text" as FieldType, maxLength: 20, placeholder: "2.5 billion", required: true },
      { id: "s1l", label: "Stat 1 label",  type: "text" as FieldType, maxLength: 50, placeholder: "Managed identities", required: true },
      { id: "s2n", label: "Stat 2 number", type: "text" as FieldType, maxLength: 20, placeholder: "1,500+" },
      { id: "s2l", label: "Stat 2 label",  type: "text" as FieldType, maxLength: 50, placeholder: "Commercial deployments globally" },
      { id: "s3n", label: "Stat 3 number", type: "text" as FieldType, maxLength: 20, placeholder: "99.99%" },
      { id: "s3l", label: "Stat 3 label",  type: "text" as FieldType, maxLength: 50, placeholder: "Uptime SLA" },
      { id: "s4n", label: "Stat 4 number", type: "text" as FieldType, maxLength: 20, placeholder: "20 years" },
      { id: "s4l", label: "Stat 4 label",  type: "text" as FieldType, maxLength: 50, placeholder: "Of enterprise trust" },
    ],
    defaults: {
      s1n: "2.5B+",   s1l: "Managed identities",
      s2n: "1,500+",  s2l: "Commercial deployments globally",
      s3n: "99.99%",  s3l: "Uptime SLA",
      s4n: "20 yrs",  s4l: "Of enterprise trust",
    },
  },

  "analyst-awards": {
    label: "Analyst recognition",
    description: "Forrester / Gartner / KuppingerCole award cards",
    icon: "A",
    iconBg: "#1a1f36",
    maxInstances: 1,
    fields: [
      { id: "title",  label: "Section title",    type: "text"  as FieldType, maxLength: 60, placeholder: "Industry recognition" },
      { id: "a1org",  label: "Award 1 org",      type: "text"  as FieldType, maxLength: 40, placeholder: "Forrester", required: true },
      { id: "a1head", label: "Award 1 headline", type: "text"  as FieldType, maxLength: 100, placeholder: "WSO2 named a Leader in The Forrester Wave™: API Management Software, Q3 2024", required: true },
      { id: "a1cta",  label: "Award 1 CTA",      type: "text"  as FieldType, maxLength: 40, placeholder: "View Forrester report" },
      { id: "a2org",  label: "Award 2 org",      type: "text"  as FieldType, maxLength: 40, placeholder: "KuppingerCole" },
      { id: "a2head", label: "Award 2 headline", type: "text"  as FieldType, maxLength: 100, placeholder: "WSO2 recognized as Overall Leader in KuppingerCole Leadership Compass" },
      { id: "a2cta",  label: "Award 2 CTA",      type: "text"  as FieldType, maxLength: 40, placeholder: "View analyst report" },
      { id: "a3org",  label: "Award 3 org",      type: "text"  as FieldType, maxLength: 40, placeholder: "Gartner" },
      { id: "a3head", label: "Award 3 headline", type: "text"  as FieldType, maxLength: 100, placeholder: "WSO2 is a 2023 Customers' Choice in Gartner Peer Insights" },
      { id: "a3cta",  label: "Award 3 CTA",      type: "text"  as FieldType, maxLength: 40, placeholder: "Read our Gartner PR" },
    ],
    defaults: {
      title:  "Industry recognition",
      a1org:  "Forrester", a1head: "WSO2 named a Leader in The Forrester Wave™: API Management Software, Q3 2024", a1cta: "View Forrester report",
      a2org:  "KuppingerCole", a2head: "WSO2 recognized as Overall Leader in KuppingerCole API Security and Management Leadership Compass", a2cta: "View analyst report",
      a3org:  "Gartner", a3head: "WSO2 is a 2023 Customers' Choice in Gartner Peer Insights Voice of the Customer", a3cta: "Read Gartner PR",
    },
  },

  "customer-testimonial": {
    label: "Customer testimonial",
    description: "Quote with name, title, and company",
    icon: "T",
    iconBg: "#f5f7fa",
    maxInstances: 2,
    fields: [
      { id: "quote",   label: "Quote text",   type: "textarea" as FieldType, maxLength: 280, placeholder: "WSO2 really helped us solve one of the most complex technology challenges…", required: true, rows: 4 },
      { id: "name",    label: "Person name",  type: "text"     as FieldType, maxLength: 60,  placeholder: "André Gowens", required: true },
      { id: "title",   label: "Job title",    type: "text"     as FieldType, maxLength: 80,  placeholder: "Vice President of Enterprise Architecture" },
      { id: "company", label: "Company name", type: "text"     as FieldType, maxLength: 60,  placeholder: "Hard Rock International" },
    ],
    defaults: {
      quote:   "WSO2 really helped us solve one of the most complex technology challenges I've seen in my 20-plus year career, enabling a single, seamless global experience for customers across hundreds of locations and systems.",
      name:    "André Gowens",
      title:   "Vice President of Enterprise Architecture",
      company: "Hard Rock International",
    },
  },

  "page-cta": {
    label: "Page CTA",
    description: "Full-width dark conversion section",
    icon: "C",
    iconBg: "#1a1f36",
    maxInstances: 1,
    fields: [
      { id: "headline", label: "Headline",       type: "text"     as FieldType, maxLength: 80,  placeholder: "Get started with WSO2 API Platform", required: true },
      { id: "cta1",     label: "Primary CTA",    type: "text"     as FieldType, maxLength: 35,  placeholder: "Contact us" },
      { id: "cta2",     label: "Secondary CTA",  type: "text"     as FieldType, maxLength: 35,  placeholder: "Download now" },
    ],
    defaults: {
      headline: "Get started with WSO2 API Platform",
      cta1:     "Contact us",
      cta2:     "Download now",
    },
  },

} satisfies Record<string, BladeDef>;
