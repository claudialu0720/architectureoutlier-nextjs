// 1:1 English mirror of archetypes.ts. Same exports, same shape, same keys.
// Archetype names are brand copy — REVIEW comments mark them for translator.
// Keep this file in lockstep with the Chinese version so a side-by-side diff
// stays trivial.

import type { Archetype } from './archetypes';

export const dominantProfiles: Record<'D' | 'T' | 'B' | 'N' | 'C' | 'S', Archetype> = {
  D: {
    name: 'Spatial Dreamer', // REVIEW: brand name
    summary:
      'You’re the type who first asks "is this space good?" You’re highly sensitive to proportion, atmosphere, light, material and the emotional tone of a space — while others work on function, you’re already judging how it feels. Your strength isn’t simply "good taste"; it’s being able to quickly tell whether a space has a memorable moment, whether it moves people, whether it has character. For you, the most valuable part of architecture isn’t the drawing itself — it’s the instant a person walks in.',
    careers: [
      ['High-end design firm / lead-designer track', 'Keep amplifying your spatial judgment — suited to projects that emphasize concept, atmosphere and finish.'],
      ['Exhibition / retail / spatial experience design', 'Turn taste into experiences that can be felt, lingered in, photographed and consumed.'],
      ['Visual consultant / AI spatial visuals / concept design', 'If you don’t want to stay in traditional project cycles, you can convert spatial judgment into visual productivity.'],
      ['Floral design / interior styling / spatial styling', 'A direction many architects overlook but that fits you well — it turns your sense of space into lighter, more service-oriented work.'],
    ],
    risk:
      'Risk note: Aesthetics alone rarely build a lasting advantage. You need to find a vehicle — something you can monetize, deliver and that the market understands — sooner rather than later, or you risk becoming someone who is "great at ideas but hard to sell."',
  },

  T: {
    name: 'Pragmatic Builder', // REVIEW: brand name
    summary:
      'You’re the type who asks "can this actually be built?" You don’t put much faith in vague concepts, and pretty renderings don’t easily impress you. What you care about is whether the logic closes, whether the structure makes sense, whether the joints can be built, whether the process is reliable. Your strength is being steady, accurate and trustworthy — especially when everyone else just wants to tell a story, you instinctively pull the conversation back to reality.',
    careers: [
      ['Technical design / specialist consulting', 'Your skills are extremely valuable on complex projects, especially in facade, joint, code-compliance and detail-development work.'],
      ['BIM / digital fabrication / parametric delivery', 'A natural fit for turning your sensitivity to logic and precision into more systematic technical capability.'],
      ['Engineering / construction / project delivery', 'You’re built to solve problems in the real world, especially in high-complexity, high-responsibility delivery environments.'],
      ['AEC tech / tools / AI products', 'You can convert technical experience into tools, plugins, process systems or industry products.'],
    ],
    risk:
      'Risk note: You’re easy to typecast as the execution workhorse. The more reliable you are, the more often you get assigned to "catch the fall." Build up your communication and influence so people see you as someone who defines problems, not just someone who solves them.',
  },

  B: {
    name: 'Project Strategist', // REVIEW: brand name
    summary:
      'You’re the type who asks "is this worth doing?" You’re more sensitive to resources, cost, market, return and timing windows — you don’t judge a project by its design alone. You may already be looking at the world the way a client, developer or founder does: who does this project serve? where does the money come from? can it sustain itself? is there room to grow? Your strength is putting space inside a bigger business logic.',
    careers: [
      ['Developer / owner-side design management', 'If you still want to stay in the space industry, move closer to where decisions and resources sit.'],
      ['Real estate / front-end planning / asset management', 'You belong on the project-definition side, not just at the back end completing design tasks.'],
      ['Brand / commercial strategy / spatial consulting', 'Convert spatial experience into positioning, programming, consumer scenarios and brand value.'],
      ['F&B / boutique stays / small-scale entrepreneurship', 'You have what it takes to turn a project into a business — start with light-asset, small-scale formats to validate.'],
    ],
    risk:
      'Risk note: You tend to underestimate execution difficulty. People with strong business judgment sometimes assume "I’ve thought it through" equals "we can pull it off." Find a reliable execution partner and validate at small scale early.',
  },

  N: {
    name: 'Spatial Storyteller', // REVIEW: brand name
    summary:
      'You’re the type who asks "will people understand this? will they be moved?" You’re skilled at expression, storytelling, organizing information and influencing others. Many architects have ideas but can’t articulate them — you can turn a complex concept into something other people are willing to believe in. Your strength isn’t just being articulate; it’s connecting space, emotion, value and people.',
    careers: [
      ['Brand narrative / pitching / business development', 'You belong on the front line of winning projects — telling design value to clients, market and the public.'],
      ['Curation / cultural projects / public communication', 'A natural fit for turning complex topics into exhibitions, events, text or visual narrative.'],
      ['Architecture media / content IP / independent publishing', 'You can convert professional experience into influence, building your own perspective and audience.'],
      ['Education / workshops / expression-driven roles', 'Your understanding of people and command of language are powerful cross-disciplinary advantages.'],
    ],
    risk:
      'Risk note: Strong expression doesn’t equal strong outcomes. You need to anchor yourself to a concrete product, service or deliverable — otherwise you risk being seen as "great at talking, light on delivery."',
  },

  C: {
    name: 'Project Commander', // REVIEW: brand name
    summary:
      'You’re the type who asks "how do we move this forward?" You’re sensitive to people, schedule, responsibility boundaries and communication rhythm — you can push a tangled mess forward. Your value doesn’t always show up in a portfolio, but when a project is actually running, things go off the rails fast without you. You’re not just a coordinator; you’re the person who keeps complex systems running.',
    careers: [
      ['Project management / PM / Design Manager', 'You belong in complex collaborative environments, especially projects that need multi-party communication and constant momentum.'],
      ['Owner-side / client-side management', 'You can integrate design, cost, schedule and disparate teams.'],
      ['Firm operations / team management', 'If you want to stay in architecture, you’re better suited to moving from individual contributor to team builder.'],
      ['Wedding planning / event production / project coordination', 'A strong cross-disciplinary fit — at heart, all of these are about organizing complex experiences.'],
    ],
    risk:
      'Risk note: You can easily become the coordinator-by-default. You’re great at making things happen, but be careful about absorbing other people’s accountability long-term. Push for decision-making power, not just communication power.',
  },

  S: {
    name: 'Systems Architect', // REVIEW: brand name
    summary:
      'You’re the type who asks "what’s the structure here?" You’re skilled at sorting out complex problems and building frameworks, rules and systems. You’re not satisfied solving just one piece of a problem — you naturally think about the mechanism behind it: who’s involved? what are the rules? how does the workflow run? can this system sustain itself? Your strength is turning chaos into structure.',
    careers: [
      ['Spatial systems / co-living / cohousing', 'Lets you extend space into operations, governance, community and rule design.'],
      ['Product management / service design / ops', 'Your systems thinking maps cleanly onto internet, service and product-driven work.'],
      ['Community ops / social innovation', 'Suited to long-horizon mechanism design, especially projects where people, space and rules intersect.'],
      ['Consulting / strategy / organizational design', 'You build frameworks — you don’t just execute.'],
    ],
    risk:
      'Risk note: You can stay stuck in the thinking layer. People with strong systems sense often think big but move slowly. Push yourself to express and act — turn the framework into a concrete product or case study.',
  },
};

const baseArchetypes: Record<string, Archetype> = {
  'D+N': {
    name: 'Spatial Director', // REVIEW: brand name
    summary:
      'You’re not designing spaces — you’re designing experiences. You care both about how a space looks and about what people feel, remember and tell others after they walk through it. You’re well-positioned to shift from "the person drawing the scheme" to "the person defining the experience." Compared with a pure designer, you understand expression better; compared with a pure content person, you have real spatial judgment.',
    careers: [
      ['Exhibition / curation / spatial brand', 'Experience design is your strength — well suited to turning space into story, atmosphere and shareable moments.'],
      ['Brand pop-ups / retail experience / art installations', 'Suited to lightweight but high-shareability spatial projects.'],
      ['Content creation / architecture media', 'You can turn space into story and translate professional content into something the public can grasp.'],
      ['Weddings / events / experience design', 'A genuine fit — at heart, all of these combine space, emotion, ritual and choreography.'],
    ],
    risk:
      'Risk note: You can over-index on expression and under-invest in monetization. You may be brilliant at concept, atmosphere and visual — but you need to define a clear commercial path early: who’s the client? how do you charge? how do you keep the pipeline flowing?',
  },

  'D+T': {
    name: 'Master Craftsman', // REVIEW: brand name
    summary:
      'You don’t just design — you can actually make things. You’re not the type who stops at concept, and you’re not just a technical executor either. Your real strength is turning abstract ideas into specific material, construction, product and detail. You’re suited to directions that need both aesthetic judgment and the ability to make.',
    careers: [
      ['Materials / tectonics / detail consulting', 'Lets you turn your sensitivity to detail and quality into a paid professional service.'],
      ['Digital fabrication / parametric products', 'Design ability translates directly into productive output — a fit for tools, manufacturing and customization.'],
      ['Independent craft / product brand (furniture, footwear, 3D-printed goods)', 'Architectural training is a huge advantage, especially for high-taste, high-finish small products.'],
      ['Designer brand / small-scale entrepreneurship', 'You can build your own product line — not necessarily limited to architecture projects.'],
    ],
    risk:
      'Risk note: You tend to make but not sell. Craftspeople often get lost in making something perfect and skip market validation. Get real users in front of your work early — don’t wait until it’s "perfect" to ship.',
  },

  'B+S': {
    name: 'Systems Operator', // REVIEW: brand name
    summary:
      'You don’t see a project — you see a system. You care more about how it runs, how it makes money, how it sustains itself and how the relationships between roles get organized. You’re suited to a more upstream position — not just solving spatial problems but defining rules, patterns and resource allocation.',
    careers: [
      ['Real estate / urban regeneration / planning', 'Suited to upstream decision-making — project positioning, programming mix and long-term operating logic.'],
      ['Asset management / existing-stock operations', 'Suited to managing the relationship between asset value, spatial efficiency and operating mechanisms.'],
      ['Consulting / commercial strategy', 'You can structure complex problems — a fit for strategy, research and business judgment.'],
      ['Entrepreneurship / productized space', 'You’re better at building systems than running individual projects — consider space services, community products or industry tools.'],
    ],
    risk:
      'Risk note: You tend to overlook execution detail. Having the system clear in your head doesn’t mean the project will land itself. Keep a partner who can own design, technical or delivery work.',
  },

  'T+C': {
    name: 'Build Commander', // REVIEW: brand name
    summary:
      'You’re the type who can actually make complex things happen. You’re not the one who loves talking concept, but you know exactly why a project goes off the rails — and you know how to pull it back. You belong in high-complexity, high-pressure, multi-party environments. Your value isn’t "drawing" — it’s making the project hold up in the real world.',
    careers: [
      ['Design management / construction management', 'You can bridge design and construction — the critical translator between the design end and the execution end.'],
      ['Project manager / PM', 'A textbook driver-type — well suited to managing schedule, budget, consultants and delivery.'],
      ['Owner’s rep / client-side project management', 'A fit for shifting from the consultant execution end into a more decision-making position.'],
      ['Project coordination / complex-delivery roles', 'Suited to high-complexity environments — large commercial, public buildings, regeneration or overseas projects.'],
    ],
    risk:
      'Risk note: You tend to spend years putting out fires. The more capable you are of solving problems, the more you get trapped inside them. Push for decision-making power and earlier-stage involvement instead of staying in delivery forever.',
  },

  'N+B': {
    name: 'Influence Operator', // REVIEW: brand name
    summary:
      'You know that expression brings opportunity. You’re skilled at converting ability into influence, resources and commercial chances. You’re not just a storyteller — you understand "who am I telling this to, why am I telling it, and what should happen after." You belong close to market, brand, user and the front edge of distribution.',
    careers: [
      ['Brand strategy / business development', 'You belong in front-end roles that help projects get understood, bought and shared.'],
      ['Content IP / education / community', 'You can scale a personal brand and turn professional experience into a sustainable content asset.'],
      ['Courses / consulting / knowledge products', 'Suited to packaging your expression into a service or product.'],
      ['Independent publishing / KOL / creator', 'Your architecture background is a differentiator — useful for entering taste, career, urbanism or lifestyle topics.'],
    ],
    risk:
      'Risk note: Don’t talk without doing. Influence brings opportunity, but without steady delivery or a repeatable product, it’s easy to stall at the traffic layer.',
  },

  'D+B': {
    name: 'Spatial Entrepreneur', // REVIEW: brand name
    summary:
      'You care about design — and about whether it sells. You’re suited to spaces that can be consumed, experienced and shared. You don’t fit pure concept work, and you’re not satisfied with pure number-crunching either. Your strength is turning aesthetics into a reason to buy, and turning space into a product.',
    careers: [
      ['Brand spatial design', 'Suited to designing stores, showrooms, offices and event scenes for brands.'],
      ['F&B / boutique stays / retail brand', 'Space becomes the product directly — you can enter through experience and the commercial loop together.'],
      ['Lifestyle brand / spatial content commerce', 'Combine taste, curation, scene and sales into one play.'],
      ['Spatial entrepreneurship / small-scale development', 'Suited to light-asset projects — studios, pop-ups, buyer’s clubs, experiential spaces.'],
    ],
    risk:
      'Risk note: Aesthetics and profit easily clash. Be clear whether you’re making work, making a business or making a brand — those are very different decisions.',
  },

  'S+N': {
    name: 'Agenda Setter', // REVIEW: brand name
    summary:
      'You’re skilled at spotting problems — and at framing them as agendas other people want to discuss. You’re not just making content, and not just doing research. Your strength is taking complex social, urban or spatial phenomena, organizing them into a framework, then turning that into expression that carries both perspective and reach. You belong working on problems that are "invisible but important."',
    careers: [
      ['Research / think tank', 'Suited to structure-plus-perspective work, especially on city, housing, community and culture.'],
      ['Media / curation / public discourse', 'A fit for translating complex topics into public conversation.'],
      ['Education / writing / research-driven content products', 'Suited to converting deep knowledge into more systematic content services.'],
      ['Social innovation projects', 'A fit for long-horizon agenda work — turning perspective into action.'],
    ],
    risk:
      'Risk note: Don’t get stuck at the perspective layer. Every agenda needs a real-world vehicle — a project, an article, a course, a community or a service.',
  },

  'T+B': {
    name: 'Tech Productizer', // REVIEW: brand name
    summary:
      'What you care about isn’t just whether something gets built — it’s whether it sells. You’re skilled at converting technology into value and packaging professional capability into tools, services or products. You’re not the textbook pure-tech personality, because you naturally think about how this capability gets priced, who it serves and how the market will receive it.',
    careers: [
      ['Technical consulting / specialty services', 'Your skills can command a premium — especially as clear, deliverable, replicable service packages.'],
      ['Digitalization consulting / in-house tooling', 'Suited to helping design firms or developers optimize workflow.'],
      ['Product management / AI / AEC tech', 'Suited to productization, especially industry-facing tools, platforms, AI workflows or plugins.'],
      ['Technical entrepreneurship', 'Suited to small-and-focused — start from a specific pain point: efficiency tools, automation, BIM workflow, visualization tools.'],
    ],
    risk:
      'Risk note: Don’t get detached from real user needs. The killer of tech monetization is "I think this is useful" with no one buying. Talk to 10 real users before building the product.',
  },

  'C+B': {
    name: 'Project Helmsman', // REVIEW: brand name
    summary:
      'You can call the direction and rally people around it. You’re not just a coordinator, and you’re not just a strategist. Your strength is turning judgment into action — organizing resources, people, time and goals. You belong at the project’s decision-making end, not perpetually executing someone else’s direction.',
    careers: [
      ['Developer / client side', 'Suited to project ownership, especially roles that need to coordinate design, cost, construction and operations.'],
      ['Project management consulting', 'Suited to complex collaboration, risk control and cross-functional drive.'],
      ['Commercial project lead / operations coordinator', 'Suited to owning the result, not just the drawings.'],
      ['Firm management / partner track', 'A natural progression from doing the work to leading the team — gradually moving into operations and management.'],
    ],
    risk:
      'Risk note: Don’t drift into the pure-coordinator role. Your value should be more than "helping people communicate" — it should include calling the direction, allocating the resources and owning the outcome.',
  },

  'S+C': {
    name: 'Systems Orchestrator', // REVIEW: brand name
    summary:
      'You’re skilled at building systems — and at making them actually run. What you care about isn’t a one-shot design deliverable; it’s long-term mechanism, organizational relationships and operating structure. You’re suited to problems where people, space, rules and processes are tangled together. Your skill set transfers cleanly to service design, community operations and organization-driven projects.',
    careers: [
      ['Community operations / collective housing', 'Suited to space-plus-organization — co-living, community, senior housing and public space.'],
      ['Product ops / service design', 'Systems thinking transfers to internet, services and experience design.'],
      ['Operations strategy / organizational process design', 'Suited to helping teams, institutions or projects build sustainable ways of running.'],
      ['Social-impact projects / NGOs', 'A fit for long-horizon mechanism design — turning spatial experience into organizational and public value.'],
    ],
    risk:
      'Risk note: Don’t ignore user experience. No matter how complete the system is, if people won’t use it, it can’t sustain. Run more user interviews and small-scale tests.',
  },
};

export const pairArchetypes: Record<string, Archetype> = {
  ...baseArchetypes,
  'S+B': baseArchetypes['B+S'],
  'C+T': baseArchetypes['T+C'],
  'B+N': baseArchetypes['N+B'],
  'B+T': baseArchetypes['T+B'],
};

export const fallback: Archetype = {
  name: 'Hybrid Pivoter', // REVIEW: brand name
  summary:
    'You don’t simply need to "switch careers" — you need to recombine your abilities. Your results show you’re not a single-strength type; you’re better suited to building a hybrid professional identity. You may have design, expression, business, systems and collaborative ability all at once, but no clear main axis yet. The key for you isn’t to learn more — it’s to first decide which capability you’ll use to open the market.',
  careers: [
    ['Spatial consulting / front-end planning', 'Suited to multi-skill integrator roles — putting design, business, research and expression together.'],
    ['Product management / AEC tech', 'Strong cross-disciplinary fit — turning architecture experience into tools, platforms or services.'],
    ['Personal brand / consultative service', 'Suited to staking out a clear topic first, then organizing work, content and service around it.'],
    ['Freelance / entrepreneurship', 'Suited to a portfolio career — using multiple small projects to test your market fit.'],
  ],
  risk:
    'Risk note: Pick one main direction — don’t try to do everything. Hybrid types easily fall into "I can do anything," but the market needs a clear label.',
};

// images that exist in /public/results/ (filename without .jpg)
export const validResultImages = new Set([
  'B+C',
  'B+N',
  'B+S',
  'C+S',
  'C+T',
  'D+B',
  'D+N',
  'D+T',
  'S+N',
  'T+B',
  'B',
  'C',
  'D',
  'N',
  'S',
  'T',
]);

export const FALLBACK_IMAGE = 'fallback';
