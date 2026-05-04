import type { Archetype } from './archetypes';

export const dominantProfiles: Record<'D' | 'T' | 'B' | 'N' | 'C' | 'S', Archetype> = {
  D: {
    name: 'Spatial Dreamer',
    summary:
      'You’re the type who first asks, “Does this feel right?” You’re highly sensitive to proportion, atmosphere, light, material and emotional tone. Your strength is not simply having “good taste” — it is being able to quickly recognize whether something has presence, character and memorability. Beyond architecture, this sensitivity can become a powerful advantage in any field where visual judgment, atmosphere and experience matter.',
    careers: [
      ['Creative direction / art direction', 'Use your spatial and visual judgment to shape campaigns, sets, shoots, brand worlds and visual identities.'],
      ['Interior styling / home & lifestyle styling', 'Turn your sensitivity to atmosphere, objects and material combinations into a lighter, more flexible creative service.'],
      ['Retail / hospitality experience design', 'Move from designing buildings to designing moments people can enter, photograph, remember and share.'],
      ['Visual content / AI imagery / concept visuals', 'Convert your eye for space into visual production for brands, media, products or digital campaigns.'],
    ],
    risk:
      'Risk note: Aesthetic sensitivity alone is not a business. You need to attach your taste to a clear service, product or audience — otherwise people may admire your eye without knowing what to pay you for.',
  },

  T: {
    name: 'Pragmatic Builder',
    summary:
      'You’re the type who asks, “Can this actually work?” Vague concepts and pretty images don’t easily impress you. You care about logic, structure, precision, workflow and reliability. Beyond architecture, your strength translates well into fields where systems need to be built, tested, optimized and made dependable.',
    careers: [
      ['Product operations / technical operations', 'Use your ability to manage complexity, workflows and execution details in tech, logistics, platforms or service businesses.'],
      ['No-code / automation / AI workflow builder', 'Turn your technical mindset into tools, automations, dashboards or internal systems for small businesses and creative teams.'],
      ['Digital fabrication / maker entrepreneurship', 'Apply your making ability to furniture, objects, 3D-printed products, prototypes or custom fabrication.'],
      ['AEC tech / product specialist', 'A strong bridge direction — use your industry knowledge to support software, plugins, BIM tools, AI products or workflow platforms.'],
    ],
    risk:
      'Risk note: You can easily become the reliable execution person who fixes everything but owns nothing. Build communication, positioning and product thinking so people see you as someone who defines systems — not just someone who repairs them.',
  },

  B: {
    name: 'Project Strategist',
    summary:
      'You’re the type who asks, “Is this worth doing?” You naturally notice resources, cost, market, timing, return and positioning. You may already see projects the way a client, developer or founder does: who is this for, how does it make money, and can it sustain itself? Beyond architecture, this makes you well suited to business-facing roles where judgment, positioning and resource allocation matter.',
    careers: [
      ['Real estate development / investment / asset strategy', 'Move closer to capital, ownership and decision-making rather than staying only on the design delivery side.'],
      ['Brand strategy / commercial strategy', 'Use your spatial understanding to help brands define positioning, customer scenarios and experience value.'],
      ['Entrepreneurship / small business ownership', 'You have the instinct to turn an idea into a business — especially in retail, lifestyle, hospitality or design-led products.'],
      ['Growth / partnerships / business development', 'Use your ability to read opportunity, people and timing to open doors and create commercial momentum.'],
    ],
    risk:
      'Risk note: You may underestimate how hard execution is. Strategic people often assume that if the logic is clear, the project will work. Find strong operators and test your ideas at small scale before going all in.',
  },

  N: {
    name: 'Spatial Storyteller',
    summary:
      'You’re the type who asks, “Will people understand this? Will they care?” You are good at framing, storytelling, organizing information and making others believe in a direction. Many architects have ideas but cannot make them legible. You can translate complexity into meaning. Beyond architecture, this is a major advantage in media, branding, education, content and communication-led work.',
    careers: [
      ['Content creator / independent media', 'Turn your professional perspective into essays, videos, newsletters, podcasts or a niche media brand.'],
      ['Brand storytelling / copywriting / content strategy', 'Help brands explain who they are, what they do and why people should care.'],
      ['Curation / cultural programming', 'Translate complex spatial, cultural or social topics into exhibitions, events, publications or public programs.'],
      ['Education / workshops / online courses', 'Package your knowledge and communication ability into learning products, lectures or community-based education.'],
    ],
    risk:
      'Risk note: Strong expression needs a concrete vehicle. Without a product, service, audience or platform, you may be seen as someone who speaks beautifully but does not deliver enough substance.',
  },

  C: {
    name: 'Project Commander',
    summary:
      'You’re the type who asks, “How do we move this forward?” You are sensitive to people, timelines, responsibilities, expectations and communication rhythm. Your value is not always visible in a portfolio, but complex work falls apart quickly without people like you. Beyond architecture, this ability transfers strongly into operations, production, events, client management and team leadership.',
    careers: [
      ['Operations manager / project operations', 'Use your ability to coordinate people, timelines and resources in startups, agencies, studios or growing businesses.'],
      ['Event production / experience production', 'A natural cross-over field — complex timelines, vendors, emotions, budgets and live outcomes all need your skill set.'],
      ['Client success / account management', 'Translate your coordination ability into relationship-heavy roles that keep clients, teams and deliverables aligned.'],
      ['Producer role in creative industries', 'Work behind the scenes to make shoots, exhibitions, campaigns, installations or digital products actually happen.'],
    ],
    risk:
      'Risk note: You can easily become the person who absorbs everyone else’s chaos. Make sure your coordination power comes with authority, decision-making rights and visible credit — not just more responsibility.',
  },

  S: {
    name: 'Systems Architect',
    summary:
      'You’re the type who asks, “What is the structure behind this?” You are good at sorting complexity, building frameworks and seeing how people, rules, workflows and incentives connect. Beyond architecture, your strength transfers well into product, service design, strategy, operations and social innovation — fields where systems matter more than objects.',
    careers: [
      ['Product management', 'Turn your ability to organize users, constraints, features and priorities into digital products or platforms.'],
      ['Service design / experience strategy', 'Move from designing spaces to designing journeys, touchpoints, interactions and service systems.'],
      ['Operations strategy / process design', 'Help organizations clarify workflows, responsibilities and decision systems.'],
      ['Social innovation / community systems', 'Apply your systems thinking to housing, aging, education, public service, community or nonprofit projects.'],
    ],
    risk:
      'Risk note: You may stay too long in analysis mode. Systems thinkers can see the whole map but hesitate to act. Push yourself to turn frameworks into prototypes, pilots, products or public-facing work.',
  },
};

const baseArchetypes: Record<string, Archetype> = {
  'D+N': {
    name: 'Spatial Director',
    summary:
      'You are not just designing spaces — you are designing experiences, moods and memories. You care about how something looks, but also how people feel, talk about it and remember it afterward. Beyond architecture, you are well suited to fields where atmosphere, storytelling and emotional impact come together.',
    careers: [
      ['Creative direction / campaign concepting', 'Shape the visual world, mood and narrative of brands, shoots, launches or cultural campaigns.'],
      ['Exhibition / immersive experience / installation', 'Use space as a storytelling medium outside traditional architectural practice.'],
      ['Retail pop-ups / brand experience', 'Design temporary but memorable environments that help brands become physical and shareable.'],
      ['Content creation / visual storytelling', 'Turn spaces, cities, objects and lifestyles into stories for media, social platforms or publications.'],
    ],
    risk:
      'Risk note: You may over-invest in atmosphere and under-invest in business structure. Define who pays, what you deliver and how your work becomes repeatable.',
  },

  'D+T': {
    name: 'Master Craftsman',
    summary:
      'You do not just imagine things — you can make them real. You combine aesthetic judgment with technical precision, material sensitivity and production logic. Beyond architecture, this is a strong foundation for product, fabrication, craft, objects and design-led entrepreneurship.',
    careers: [
      ['Furniture / object / product design', 'Turn architectural thinking into smaller-scale products that can be made, sold and improved over time.'],
      ['Digital fabrication / custom manufacturing', 'Use tools, materials and precision to create prototypes, installations, products or fabrication services.'],
      ['Independent craft or design brand', 'Build a niche brand around high-taste, well-made objects, accessories, homeware or lifestyle products.'],
      ['Prototype designer / physical product developer', 'Work with startups, brands or makers to turn abstract ideas into tangible things.'],
    ],
    risk:
      'Risk note: You may keep perfecting the object and delay the market test. Get real users, buyers or clients in front of your work early.',
  },

  'B+S': {
    name: 'Systems Operator',
    summary:
      'You do not only see a project — you see the system around it. You care about how it runs, how it makes money, how roles connect and how the model sustains itself. Beyond architecture, you are suited to business models, operations, real estate, platforms and strategic roles.',
    careers: [
      ['Real estate development / asset strategy', 'Work on positioning, programming, investment logic and long-term value instead of only design output.'],
      ['Product strategy / business operations', 'Use your systems thinking to define product models, workflows, priorities and growth logic.'],
      ['Strategy consulting / market research', 'Structure complex business, urban or consumer problems into clear decisions.'],
      ['Startup founder / platform builder', 'You are suited to building systems — especially service platforms, community products or industry tools.'],
    ],
    risk:
      'Risk note: You may believe that a clear model is enough. But every system needs execution, users and iteration. Pair strategic thinking with small, fast tests.',
  },

  'T+C': {
    name: 'Build Commander',
    summary:
      'You are the person who can make complex things actually happen. You know why projects fail, where coordination breaks, and what needs to be fixed before everything collapses. Beyond architecture, this makes you strong in operations, production, implementation and delivery-heavy environments.',
    careers: [
      ['Operations lead / implementation manager', 'Bring structure, discipline and follow-through to startups, agencies, platforms or service companies.'],
      ['Event production / live experience production', 'Manage high-pressure, multi-party, deadline-driven work where everything must land in real time.'],
      ['Construction tech / proptech operations', 'Use your built-environment knowledge in companies building tools for construction, real estate or project delivery.'],
      ['Supply chain / production coordination', 'Translate your detail and process mindset into product, manufacturing or logistics-related roles.'],
    ],
    risk:
      'Risk note: You may spend years putting out fires. The more capable you are, the more people hand you broken systems. Push for earlier involvement and decision-making power.',
  },

  'N+B': {
    name: 'Influence Operator',
    summary:
      'You understand that attention, trust and narrative create opportunity. You are not just expressive — you know who you are speaking to, why it matters and what should happen next. Beyond architecture, you are well suited to brand, content, education, sales and influence-driven businesses.',
    careers: [
      ['Brand strategist / content strategist', 'Help brands define their message, audience, voice and market-facing story.'],
      ['Creator business / personal media brand', 'Turn your knowledge and taste into a scalable audience, content platform or paid community.'],
      ['Online education / course business', 'Package your expertise into workshops, guides, lectures, templates or paid learning products.'],
      ['Business development / partnerships', 'Use narrative and persuasion to create opportunities, collaborations and commercial relationships.'],
    ],
    risk:
      'Risk note: Influence without delivery becomes empty. Make sure your storytelling is connected to a clear offer, product or result.',
  },

  'D+B': {
    name: 'Spatial Entrepreneur',
    summary:
      'You care about beauty, but also about whether beauty sells. You are suited to fields where taste becomes a commercial advantage — retail, hospitality, lifestyle, content commerce and experience-led brands. Beyond architecture, your edge is turning atmosphere into desire.',
    careers: [
      ['Lifestyle brand founder', 'Build a brand around taste, objects, interiors, rituals, home, fashion, food or design-led living.'],
      ['Retail / hospitality concept development', 'Create cafes, stores, boutique stays, studios or pop-ups where space and business work together.'],
      ['Visual merchandising / brand environment', 'Use spatial and aesthetic judgment to shape how products are displayed, experienced and sold.'],
      ['Content commerce / curated e-commerce', 'Combine taste, storytelling, products and scenes into a business with a clear audience.'],
    ],
    risk:
      'Risk note: A beautiful business still needs numbers. Be clear whether you are building a project, a brand or a repeatable commercial model.',
  },

  'S+N': {
    name: 'Agenda Setter',
    summary:
      'You are good at identifying problems and framing them in a way others want to discuss. You combine systems thinking with narrative ability, which makes you strong at turning complex social, cultural or urban issues into public-facing ideas. Beyond architecture, this fits research, writing, policy, education and thought-leadership work.',
    careers: [
      ['Research / policy / think tank work', 'Work on housing, cities, aging, sustainability, culture or public systems through research and agenda-setting.'],
      ['Long-form writing / journalism / editorial work', 'Translate complex spatial and social issues into essays, reports, newsletters or public discourse.'],
      ['Cultural strategy / public programming', 'Develop talks, exhibitions, programs or platforms around important but under-discussed topics.'],
      ['Education / knowledge products', 'Turn frameworks and analysis into courses, lectures, toolkits or learning communities.'],
    ],
    risk:
      'Risk note: You may stay at the level of perspective. Every agenda needs a vehicle — a publication, project, course, community, organization or service.',
  },

  'T+B': {
    name: 'Tech Productizer',
    summary:
      'You are interested not only in how things work, but in whether they can become valuable. You can translate technical knowledge into tools, services or products. Beyond architecture, this is a strong foundation for AI tools, software, automation, product management and technical entrepreneurship.',
    careers: [
      ['Product manager for technical or AI products', 'Use your ability to understand both users and systems to shape useful digital tools.'],
      ['AI workflow consultant', 'Help firms, creators or small businesses automate workflows, create tools and improve productivity.'],
      ['SaaS / plugin / digital tool founder', 'Turn a specific professional pain point into a product, platform or paid tool.'],
      ['Technical sales / solutions consultant', 'Use your technical credibility and business sense to explain complex products to clients.'],
    ],
    risk:
      'Risk note: Do not build in isolation. The biggest risk is creating something technically impressive that no one urgently needs. Talk to real users before building too much.',
  },

  'C+B': {
    name: 'Project Helmsman',
    summary:
      'You can judge direction and organize people around it. You are not just a coordinator and not just a strategist — your strength is turning decisions into action. Beyond architecture, this fits roles where business goals, people, resources and execution all need to be managed together.',
    careers: [
      ['General manager / operations manager', 'Run teams, resources, timelines and outcomes in a growing business or creative company.'],
      ['Client-side project lead / owner representative', 'Move toward the side that defines goals, controls budgets and manages external teams.'],
      ['Partnerships / business development lead', 'Use coordination and judgment to build strategic relationships and unlock opportunities.'],
      ['Agency producer / account director', 'Manage clients, creative teams, budgets and delivery in branding, media, events or experience agencies.'],
    ],
    risk:
      'Risk note: Do not become only the person who “keeps things moving.” Your value should include setting direction, allocating resources and owning outcomes.',
  },

  'S+C': {
    name: 'Systems Orchestrator',
    summary:
      'You are good at building systems and making them run. You care about long-term mechanisms, organizational relationships and operating structures. Beyond architecture, this skill transfers strongly to service design, community operations, product operations and organization-building.',
    careers: [
      ['Service designer / experience strategist', 'Design journeys, touchpoints, systems and interactions instead of only physical spaces.'],
      ['Community operations / platform operations', 'Build and manage systems where users, rules, content, events and relationships interact.'],
      ['Organizational design / process consulting', 'Help teams or institutions improve workflows, responsibilities and decision-making structures.'],
      ['Nonprofit / social-impact operations', 'Apply your ability to organize people and systems to education, housing, aging, culture or public-interest work.'],
    ],
    risk:
      'Risk note: A system only matters if people actually use it. Test with real users, observe behavior and adjust the system around lived experience.',
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
  name: 'Hybrid Pivoter',
  summary:
    'You do not simply need to “switch careers” — you need to recombine your abilities. Your result suggests that you may have design, communication, business, systems and coordination skills all at once, but no single axis has fully taken over yet. Beyond architecture, your best path may not be a conventional job title. It may be a hybrid role, a niche service, a creator-led business or a portfolio career that lets several strengths work together.',
  careers: [
    ['Product management / service design', 'A good fit if you want to translate architectural thinking into users, journeys, systems and digital products.'],
    ['Creative strategy / brand consulting', 'A good fit if you can combine taste, research, storytelling and business judgment.'],
    ['Independent consulting / fractional creative operator', 'Build a flexible service around strategy, visuals, content, planning or operations for small businesses and founders.'],
    ['Portfolio career / entrepreneurship', 'Use multiple small projects to test what people actually pay you for before committing to one identity.'],
  ],
  risk:
    'Risk note: Hybrid people often say “I can do many things,” but the market needs a clear label. Choose one main entry point first, then let the other strengths support it.',
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