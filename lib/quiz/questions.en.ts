// 1:1 English mirror of questions.ts. Same exports, same order, same option
// labels and weights — only `q` and `text` are translated. Keep this file in
// lockstep with the Chinese version so a side-by-side diff stays trivial.

import type { Question, Trait } from './questions';

export const traits: Trait[] = ['D', 'T', 'B', 'N', 'C', 'S'];

export const dimensions: Record<Trait, string> = {
  D: 'Design &\nAesthetics',
  T: 'Technical\nExecution',
  B: 'Business\nStrategy',
  N: 'Narrative &\nStorytelling',
  C: 'Collaborative\nManagement',
  S: 'Systems\nThinking',
};

export const questions: Question[] = [
  {
    id: 'q01',
    q: 'Which of the following architects do you like the most?',
    options: [
      { label: 'B', text: 'Renzo Piano', image: '/test/image_questions/favorite_architect_renzo.png', weights: { T: 2, S: 1 } },
      { label: 'D', text: 'Rem Koolhaas (OMA)', image: '/test/image_questions/favorite_architect_rem.png', weights: { N: 2, S: 1 } },
      { label: 'A', text: 'Zaha Hadid', image: '/test/image_questions/favorite_architect_zaha.jpg', weights: { D: 2 } },
      { label: 'C', text: 'Bjarke Ingels (BIG)', image: '/test/image_questions/favorite_architect_big.jpg', weights: { B: 2, N: 1 } },
    ],
  },
  {
    id: 'q02',
    q: 'Which space in the images below makes you feel the most comfortable and joyful?',
    options: [
      { label: 'C', image: '/test/image_questions/space_community.jpg', weights: { N: 2 } },
      { label: 'D', image: '/test/image_questions/space_system.jpg', weights: { T: 2, S: 1 } },
      { label: 'A', image: '/test/image_questions/space_light.jpg', weights: { D: 2 } },
      { label: 'B', image: '/test/image_questions/space_structure.jpg', weights: { S: 2, T: 1 } },
    ],
  },
  {
    id: 'q03',
    q: 'Which of the following spaces would you most like to work or study in?',
    options: [
      { label: 'C', image: '/test/image_questions/work_D.jpg', weights: { D: 2 } },
      { label: 'D', image: '/test/image_questions/work_T.png', weights: { T: 2, S: 1 } },
      { label: 'A', image: '/test/image_questions/work_B.jpg', weights: { B: 2 } },
      { label: 'B', image: '/test/image_questions/work_C.jpg', weights: { C: 2, N: 1 } },
    ],
  },
  {
    id: 'q04',
    q: 'When studying architecture in university, which type of courses did you enjoy the most?',
    options: [
      { label: 'A', text: 'History / Theory / Criticism', weights: { N: 2, S: 1 } },
      { label: 'B', text: 'Structures / Tectonics / Materials', weights: { T: 2, S: 1 } },
      { label: 'C', text: 'Visual Representation / Design Studio', weights: { D: 2 } },
      { label: 'D', text: 'Software / Parametric Design / Digital Tools', weights: { T: 2 } },
    ],
  },
  {
    id: 'q05',
    q: 'If you could choose your major all over again, you would most likely study:',
    options: [
      { label: 'B', text: 'Computer Science / AI / Information Technology', weights: { T: 2, S: 1 } },
      { label: 'A', text: 'Art / Photography / Visual Arts', weights: { D: 2 } },
      { label: 'C', text: 'Business / Psychology / Sociology', weights: { B: 2, N: 1 } },
      { label: 'D', text: 'Organizational Management / Public Administration', weights: { C: 2, S: 1 } },
    ],
  },
  {
    id: 'q06',
    q: 'Which moment do you enjoy the most at work?',
    options: [
      { label: 'B', text: 'When the logic of the drawing sets is perfectly resolved', weights: { T: 1, S: 2 } },
      { label: 'D', text: 'When you successfully pitch an idea and persuade others', weights: { N: 2, C: 1 } },
      { label: 'A', text: 'The "aha" moment when a new concept is born', weights: { D: 2 } },
      { label: 'C', text: 'When the project strategy and direction are validated', weights: { B: 2, S: 1 } },
    ],
  },
  {
    id: 'q07',
    q: 'What is the most unbearable part of your work?',
    options: [
      { label: 'B', text: 'Errors in drawings and unresolved construction details', weights: { T: 2, S: 1 } },
      { label: 'A', text: 'Endless design revisions until the project loses its soul', weights: { D: 2 } },
      { label: 'D', text: 'Endless meetings but nobody is on the same page', weights: { C: 2 } },
      { label: 'C', text: 'Pushing forward a project that lacks any business logic', weights: { B: 2 } },
    ],
  },
  {
    id: 'q08',
    q: 'Which of the following tasks do you dislike the least?',
    options: [
      { label: 'D', text: 'Creating highly impactful content', weights: { N: 2 } },
      { label: 'A', text: 'Designing a highly aesthetic space', weights: { D: 1, N: 1 } },
      { label: 'C', text: 'Managing a highly profitable project', weights: { B: 2 } },
      { label: 'B', text: 'Building a highly efficient system', weights: { T: 2, S: 1 } },
    ],
  },
  {
    id: 'q09',
    q: 'When a project is successful, you believe the key factor is:',
    options: [
      { label: 'D', text: 'Timely communication and coordination', weights: { C: 2 } },
      { label: 'C', text: 'An accurate strategic direction', weights: { B: 2 } },
      { label: 'B', text: 'Solid and hardcore technical execution', weights: { T: 2, S: 1 } },
      { label: 'A', text: 'Outstanding and avant-garde design', weights: { D: 2 } },
    ],
  },
  {
    id: 'q10',
    q: 'Which type of boss/manager is the most tolerable for you?',
    options: [
      { label: 'A', text: 'Has high design standards, but changes their mind with 100 new ideas a day', weights: { D: 2 } },
      { label: 'D', text: 'Talks compelling concepts and theory all day, but can\'t read drawings or produce them', weights: { N: 2 } },
      { label: 'B', text: 'A tech wizard and detail-freak who knows every software, but is extremely nitpicky', weights: { T: 2, S: 1 } },
      { label: 'C', text: 'A master at presenting ideas, but has no sense of spatial quality', weights: { B: 2, C: 1 } },
    ],
  },
  {
    id: 'q11',
    q: 'If you were cast in a workplace drama, your catchphrase would be:',
    options: [
      { label: 'C', text: '"Is this project actually viable?"', weights: { B: 1, S: 1 } },
      { label: 'A', text: '"I have my aesthetic principles."', weights: { D: 2 } },
      { label: 'D', text: '"Everyone, listen to my story."', weights: { N: 2, C: 1 } },
      { label: 'B', text: '"Hold on, let\'s get the logic straight first."', weights: { T: 2, C: 1, S: 1 } },
    ],
  },
  {
    id: 'q12',
    q: 'What do you think is the most irreplaceable skill of an architect?',
    options: [
      { label: 'A', text: 'Design and aesthetic judgment', weights: { D: 2 } },
      { label: 'B', text: 'Communication and persuasion: making others believe in the vision', weights: { N: 2, C: 1 } },
      { label: 'D', text: 'Coordinating complex relationships to push the project forward', weights: { C: 2 } },
      { label: 'C', text: 'Finding balance amidst multiple constraints (site, budget, codes, etc.)', weights: { S: 2 } },
    ],
  },
  {
    id: 'q13',
    q: 'In the future, what capability will architects need the most?',
    options: [
      { label: 'A', text: 'Quickly picking up new tools and technologies (e.g., AI / digital tools)', weights: { T: 2 } },
      { label: 'B', text: 'Acquiring resources and securing projects (networking / business acumen)', weights: { B: 2 } },
      { label: 'D', text: 'Building a personal brand and strong communication skills (social media / writing / public speaking)', weights: { N: 2, D: 1 } },
      { label: 'C', text: 'Integrating resources and balancing stakeholder interests in complex, cross-disciplinary collaborations', weights: { C: 2, S: 1 } },
    ],
  },
  {
    id: 'q14',
    q: 'Which of the following career transition paths do you align with most?',
    options: [
      { label: 'C', text: 'Translating existing skills into a new related craft (e.g., artisanal making / craft brand)', weights: { T: 2, B: 1 } },
      { label: 'A', text: 'Becoming an independent artist, expressing views through work (exhibitions / biennales)', weights: { N: 2, D: 1 } },
      { label: 'D', text: 'Building tools / products / AI, turning industry experience into scalable systems', weights: { S: 2, B: 1 } },
      { label: 'B', text: 'Leaving the industry entirely to excel in a completely different field', weights: { C: 2, N: 1 } },
    ],
  },
  {
    id: 'q15',
    q: 'You are heading to a critical meeting with a client. How are you most likely to show up?',
    options: [
      { label: 'B', text: 'Clean and appropriate business or business-casual attire', weights: { B: 1, C: 1 } },
      { label: 'D', text: 'Not too concerned about appearance, focusing entirely on the content', weights: { S: 2, T: 1 } },
      { label: 'A', text: 'Wearing a well-designed outfit with a distinct personal style', weights: { D: 1, N: 1 } },
      { label: 'C', text: 'Casual but authentic, looking like you just came from the job site', weights: { T: 2, C: 1 } },
    ],
  },
  {
    id: 'q16',
    q: 'You just received a new project, and the client says, "Just pitch us an idea first." Your first reaction is:',
    options: [
      { label: 'B', text: 'Clarifying the budget and objectives', weights: { B: 1, S: 1 } },
      { label: 'D', text: 'Brainstorming a compelling conceptual narrative', weights: { N: 2, B: 1 } },
      { label: 'A', text: 'Sketching something right away to find the vibe', weights: { D: 1 } },
      { label: 'C', text: 'Organizing their requirements into a logical framework', weights: { S: 2, C: 1 } },
    ],
  },
  {
    id: 'q17',
    q: 'Your proposal has been rejected by the client three times. You are most likely to:',
    options: [
      { label: 'D', text: 'Optimize the presentation and pitch it again', weights: { N: 2 } },
      { label: 'B', text: 'Reflect on whether the overall strategy and positioning are off', weights: { B: 1, S: 1 } },
      { label: 'C', text: 'Have a deep conversation with the client to figure out what they actually want', weights: { C: 2, N: 1 } },
      { label: 'A', text: 'Scrap it and start over to design something even better', weights: { D: 2 } },
    ],
  },
  {
    id: 'q18',
    q: 'As the project enters the construction phase, your state is closest to:',
    options: [
      { label: 'C', text: 'Highly focused on costs and the final delivered result', weights: { B: 2 } },
      { label: 'A', text: 'Losing interest, as the design phase is already done', weights: { D: 2 } },
      { label: 'D', text: 'Constantly communicating with all parties to prevent things from derailing', weights: { C: 2, S: 1 } },
      { label: 'B', text: 'Meticulously checking shop drawings and construction details', weights: { T: 2, S: 1 } },
    ],
  },
  {
    id: 'q19',
    q: 'You take over a chaotic project: missing files, unclear logic, and hideous design. Your first move is:',
    options: [
      { label: 'C', text: 'Communicate with key stakeholders first to understand the true needs', weights: { C: 2 } },
      { label: 'B', text: 'Organize all the information into a clear framework', weights: { S: 2 } },
      { label: 'A', text: 'Sketch a few design options to find a direction', weights: { D: 2 } },
      { label: 'D', text: 'Come up with a strong narrative to drive the project forward', weights: { N: 2 } },
    ],
  },
  {
    id: 'q20',
    q: 'Which role in a team most naturally falls on your shoulders?',
    options: [
      { label: 'C', text: 'The decision-maker', weights: { B: 2, S: 1 } },
      { label: 'B', text: 'The technical problem-solver', weights: { T: 2, S: 1 } },
      { label: 'D', text: 'The communication coordinator', weights: { C: 2 } },
      { label: 'A', text: 'The idea and concept generator', weights: { D: 2, N: 1 } },
    ],
  },
  {
    id: 'q21',
    q: 'In a massive project with multiple teams, everyone talks past each other in meetings. How do you coordinate?',
    options: [
      { label: 'B', text: 'Establish unified rules and workflows so everyone operates on the same logic', weights: { S: 2, C: 1 } },
      { label: 'A', text: 'Create an integrated proposal directly and let the result speak for itself', weights: { D: 1, S: 1 } },
      { label: 'D', text: 'Repackage the project to align everyone under a single visionary goal', weights: { N: 2 } },
      { label: 'C', text: 'Communicate with teams individually and slowly build consensus', weights: { C: 2 } },
    ],
  },
  {
    id: 'q22',
    q: 'What do your colleagues comment on most often about you at work?',
    options: [
      { label: 'D', text: 'Being a "smooth talker"', weights: { N: 1, C: 1 } },
      { label: 'A', text: 'Being too emotional/idealistic', weights: { D: 1 } },
      { label: 'C', text: 'Being too pragmatic/realistic', weights: { B: 1 } },
      { label: 'B', text: 'Being overly rigorous/pedantic', weights: { T: 1, S: 1 } },
    ],
  },
  {
    id: 'q23',
    q: 'If you have to work overtime, which task do you mind doing the least?',
    options: [
      { label: 'D', text: 'Making spatial diagrams for the project', weights: { C: 1, N: 1 } },
      { label: 'A', text: 'Organizing the narrative flow and content of a presentation deck', weights: { N: 2, S: 1 } },
      { label: 'C', text: 'Completing drawing sets and details', weights: { T: 2 } },
      { label: 'B', text: 'Pushing renderings to absolute perfection', weights: { D: 1, B: 1 } },
    ],
  },
  {
    id: 'q24',
    q: 'Faced with a project that has extremely vague positioning, you tend to:',
    options: [
      { label: 'B', text: 'Establish a logical structure first, otherwise it\'s impossible to proceed', weights: { S: 1 } },
      { label: 'C', text: 'Assess the risks first to determine if it\'s even worth doing', weights: { B: 1 } },
      { label: 'A', text: 'Jump into design and figure everything out along the way', weights: { D: 1 } },
      { label: 'D', text: 'Align everyone\'s understanding first', weights: { C: 1 } },
    ],
  },
  {
    id: 'q25',
    q: 'If a project has reduced the budget, your intuitive reaction is to:',
    options: [
      { label: 'D', text: 'Reset stakeholders\' expectations to prevent the process from spiraling out of control', weights: { C: 2, S: 1 } },
      { label: 'B', text: 'Optimize construction methods first to ensure quality and buildability', weights: { T: 2 } },
      { label: 'C', text: 'Recalculate the ROI directly to see if the direction needs adjusting', weights: { B: 2 } },
      { label: 'A', text: 'Find a way to salvage the core spatial experience and design expression', weights: { D: 1, N: 1 } },
    ],
  },
  {
    id: 'q26',
    q: 'If you were unemployed and decided to start a social media account instead of looking for a job, you\'d probably choose:',
    options: [
      { label: 'C', text: 'A commercial account reviewing trending products to drive sales', weights: { B: 2 } },
      { label: 'D', text: 'An advice account sharing career and academic experiences', weights: { N: 2, B: 1 } },
      { label: 'A', text: 'A curation account focusing on aesthetics and creative inspiration', weights: { D: 2 } },
      { label: 'B', text: 'An educational account teaching AI and professional design tools', weights: { T: 2, B: 1 } },
    ],
  },
  {
    id: 'q27',
    q: 'If you started your own firm, based on your skills, it would most likely become:',
    options: [
      { label: 'B', text: 'A technology-driven practice', weights: { T: 2, S: 1 } },
      { label: 'D', text: 'An influential branded content', weights: { N: 2, B: 1 } },
      { label: 'A', text: 'A boutique design studio', weights: { D: 2, N: 1 } },
      { label: 'C', text: 'A profitable e-commerce business', weights: { B: 2, C: 1 } },
    ],
  },
  {
    id: 'q28',
    q: 'Having successfully started your firm, your day-to-day work as a boss consists mostly of:',
    options: [
      { label: 'A', text: 'Defining the tone and aesthetic identity of the projects', weights: { D: 1, N: 1 } },
      { label: 'C', text: 'Determining priorities and allocating team resources', weights: { B: 1, S: 1 } },
      { label: 'D', text: 'Managing and coordinating external relationships', weights: { C: 2 } },
      { label: 'B', text: 'Ensuring complex processes are executed accurately', weights: { T: 1, S: 1 } },
    ],
  },
  {
    id: 'q29',
    q: 'In a project, two key stakeholders clash. You would:',
    options: [
      { label: 'B', text: 'Judge who is right based on cost implications and final outcomes', weights: { B: 2 } },
      { label: 'C', text: 'Mediate in the middle to get both sides to compromise', weights: { C: 2 } },
      { label: 'A', text: 'Look at whose proposal is better and more groundbreaking', weights: { D: 2 } },
      { label: 'D', text: 'Redefine the problem to make the conflict irrelevant', weights: { N: 2, C: 1 } },
    ],
  },
  {
    id: 'q30',
    q: 'Last question — In a parallel universe, if you still work in architecture, what role would you play?',
    options: [
      { label: 'A', text: 'A world-renowned "Starchitect"', weights: { D: 1, B: 1, N: 1 } },
      { label: 'C', text: 'A tenured professor at Harvard GSD', weights: { S: 2, N: 1 } },
      { label: 'D', text: 'A partner at a large international firm (like SOM or KPF)', weights: { C: 2, B: 1 } },
      { label: 'B', text: 'A real estate developer behind multiple blockbuster projects', weights: { B: 2, N: 1 } },
    ],
  },
];