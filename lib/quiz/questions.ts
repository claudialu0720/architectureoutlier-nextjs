export type Trait = 'D' | 'T' | 'B' | 'N' | 'C' | 'S';

export type QuestionOption = {
  label: string;
  text?: string;
  image?: string;
  weights: Partial<Record<Trait, number>>;
};

export type Question = {
  id: string;
  q: string;
  options: QuestionOption[];
};

export const traits: Trait[] = ['D', 'T', 'B', 'N', 'C', 'S'];

export const dimensions: Record<Trait, string> = {
  D: '设计能力',
  T: '技术落地',
  B: '商业策略',
  N: '叙事表达',
  C: '协同管理',
  S: '系统思维',
};

export const questions: Question[] = [
  {
    id: 'q01',
    q: '你最喜欢下列的哪个建筑师：',
    options: [
      { label: 'B', text: '伦佐·皮亚诺', image: '/test/image_questions/favorite_architect_renzo.png', weights: { T: 2, S: 1 } },
      { label: 'D', text: '库哈斯 (OMA)', image: '/test/image_questions/favorite_architect_rem.png', weights: { N: 2, S: 1 } },
      { label: 'A', text: '扎哈·哈迪德', image: '/test/image_questions/favorite_architect_zaha.jpg', weights: { D: 2 } },
      { label: 'C', text: '大B哥 Bjarke (BIG)', image: '/test/image_questions/favorite_architect_big.jpg', weights: { B: 2, N: 1 } },
    ],
  },
  {
    id: 'q02',
    q: '下面哪张图片里的空间最让你感到舒适和愉悦？',
    options: [
      { label: 'C', image: '/test/image_questions/space_community.jpg', weights: { N: 2 } },
      { label: 'D', image: '/test/image_questions/space_system.jpg', weights: { T: 2, S: 1 } },
      { label: 'A', image: '/test/image_questions/space_light.jpg', weights: { D: 2 } },
      { label: 'B', image: '/test/image_questions/space_structure.jpg', weights: { S: 2, T: 1 } },
    ],
  },
  {
    id: 'q03',
    q: '你最想在下面的哪个空间里工作或学习？',
    options: [
      { label: 'C', image: '/test/image_questions/work_D.jpg', weights: { D: 2 } },
      { label: 'D', image: '/test/image_questions/work_T.png', weights: { T: 2, S: 1 } },
      { label: 'A', image: '/test/image_questions/work_B.jpg', weights: { B: 2 } },
      { label: 'B', image: '/test/image_questions/work_C.jpg', weights: { C: 2, N: 1 } },
    ],
  },
  {
    id: 'q04',
    q: '在学校读建筑时，你最喜欢哪类课程：',
    options: [
      { label: 'A', text: '历史 / 理论 / 批评类课程', weights: { N: 2, S: 1 } },
      { label: 'B', text: '结构 / 构造 / 材料类课程', weights: { T: 2, S: 1 } },
      { label: 'C', text: '视觉表达 / 设计 studio', weights: { D: 2 } },
      { label: 'D', text: '软件 / 参数化 / 数字工具', weights: { T: 2 } },
    ],
  },
  {
    id: 'q05',
    q: '如果让你再选一次专业，你更可能去学：',
    options: [
      { label: 'B', text: '编程 / AI / 信息技术', weights: { T: 2, S: 1 } },
      { label: 'A', text: '艺术 / 摄影 / 视觉创作', weights: { D: 2 } },
      { label: 'C', text: '商业 / 心理 / 社会学', weights: { B: 2, N: 1 } },
      { label: 'D', text: '组织 / 管理 / 公共事务', weights: { C: 2, S: 1 } },
    ],
  },
  {
    id: 'q06',
    q: '你在工作中最享受哪种时刻？',
    options: [
      { label: 'B', text: '图纸逻辑完全闭环的时候', weights: { T: 1, S: 2 } },
      { label: 'D', text: '把别人说服的时候', weights: { N: 2, C: 1 } },
      { label: 'A', text: '概念刚出来的那一刻', weights: { D: 2 } },
      { label: 'C', text: '项目策略被认可的时候', weights: { B: 2, S: 1 } },
    ],
  },
  {
    id: 'q07',
    q: '你在工作中最受不了的是：',
    options: [
      { label: 'B', text: '图纸出错、节点对不上', weights: { T: 2, S: 1 } },
      { label: 'A', text: '设计一直被改，改到没有灵魂', weights: { D: 2 } },
      { label: 'D', text: '开会很频繁，但没有人在同一个频道', weights: { C: 2 } },
      { label: 'C', text: '项目没有商业逻辑，还硬要做', weights: { B: 2 } },
    ],
  },
  {
    id: 'q08',
    q: '下列哪一项工作是你最不讨厌的：',
    options: [
      { label: 'D', text: '做一个有影响力的内容', weights: { N: 2 } },
      { label: 'A', text: '做一个很美的空间', weights: { D: 1, N: 1 } },
      { label: 'C', text: '做一个赚钱的项目', weights: { B: 2 } },
      { label: 'B', text: '做一个很高效的系统', weights: { T: 2, S: 1 } },
    ],
  },
  {
    id: 'q09',
    q: '一个项目成功了，你觉得关键是：',
    options: [
      { label: 'D', text: '沟通协调及时', weights: { C: 2 } },
      { label: 'C', text: '策略方向准确', weights: { B: 2 } },
      { label: 'B', text: '技术扎实硬核', weights: { T: 2, S: 1 } },
      { label: 'A', text: '设计先锋优秀', weights: { D: 2 } },
    ],
  },
  {
    id: 'q10',
    q: '下列的哪种老板/上级 是你勉强可以忍受的：',
    options: [
      { label: 'A', text: '对设计很有追求，但一天100个想法', weights: { D: 2 } },
      { label: 'D', text: '天天讲概念和理论，但图看不懂也不自己画', weights: { N: 2 } },
      { label: 'B', text: '什么软件都会的技术大佬+细节控，但非常吹毛求疵', weights: { T: 2, S: 1 } },
      { label: 'C', text: 'PPT汇报功夫了得，但空间完全没感觉', weights: { B: 2, C: 1 } },
    ],
  },
  {
    id: 'q11',
    q: '如果把你放进一部职场剧，你更像：',
    options: [
      { label: 'C', text: '这个项目到底能不能成立？', weights: { B: 1, S: 1 } },
      { label: 'A', text: '我有我的美学原则', weights: { D: 2 } },
      { label: 'D', text: '所有人都听我讲一个故事', weights: { N: 2, C: 1 } },
      { label: 'B', text: '别急，先把逻辑捋顺', weights: { T: 2, C: 1, S: 1 } },
    ],
  },
  {
    id: 'q12',
    q: '你觉得建筑师最不可被替代的能力是:',
    options: [
      { label: 'A', text: '设计和审美判断', weights: { D: 2 } },
      { label: 'B', text: '表达和说服，让他人相信这个愿景和方向', weights: { N: 2, C: 1 } },
      { label: 'D', text: '协调复杂关系，把项目推进下去', weights: { C: 2 } },
      { label: 'C', text: '在多种约束中（场地、预算、法规等）找到平衡', weights: { S: 2 } },
    ],
  },
  {
    id: 'q13',
    q: '在未来，你觉得建筑师最需要的能力是：',
    options: [
      { label: 'A', text: '快速学习新工具和技术（比如 AI / 数字工具）', weights: { T: 2 } },
      { label: 'B', text: '获取资源和项目的能力（人脉 / 商业判断）', weights: { B: 2 } },
      { label: 'D', text: '建立个人品牌和表达能力（自媒体 / 写作 / 演讲）', weights: { N: 2, D: 1 } },
      { label: 'C', text: '在复杂的跨界合作中整合资源、平衡各方利益', weights: { C: 2, S: 1 } },
    ],
  },
  {
    id: 'q14',
    q: '如果必须选一个你更认同的建筑师转型路径，你会选：',
    options: [
      { label: 'C', text: '把原本的技能转化成新的职业方向（比如 手作 / 工艺品牌）', weights: { T: 2, B: 1 } },
      { label: 'A', text: '做独立艺术家，用作品表达观点并进入艺术体系（展览 / 双年展）', weights: { N: 2, D: 1 } },
      { label: 'D', text: '做工具 / 产品 / AI，把行业经验变成可规模化的系统', weights: { S: 2, B: 1 } },
      { label: 'B', text: '彻底离开行业，在完全不同领域成为顶尖（比如职业运动员）', weights: { C: 2, N: 1 } },
    ],
  },
  {
    id: 'q15',
    q: '你要去和甲方开一个关键会议，你更可能以什么状态出现:',
    options: [
      { label: 'B', text: '干净得体的商务或商务休闲', weights: { B: 1, C: 1 } },
      { label: 'D', text: '不太在意外在，更关注内容本身', weights: { S: 2, T: 1 } },
      { label: 'A', text: '穿搭有设计感，风格明确', weights: { D: 1, N: 1 } },
      { label: 'C', text: '随意但真实，像刚从项目现场过来', weights: { T: 2, C: 1 } },
    ],
  },
  {
    id: 'q16',
    q: '你接到一个新项目，甲方说: "你们先提个想法吧。" 你的第一反应是：',
    options: [
      { label: 'B', text: '先问清楚预算和目标', weights: { B: 1, S: 1 } },
      { label: 'D', text: '想一个有说服力的概念故事', weights: { N: 2, B: 1 } },
      { label: 'A', text: '先画点东西找感觉', weights: { D: 1 } },
      { label: 'C', text: '先把需求整理成逻辑框架', weights: { S: 2, C: 1 } },
    ],
  },
  {
    id: 'q17',
    q: '一个方案被甲方否了三次，你最可能：',
    options: [
      { label: 'D', text: '优化表达方式再讲一遍', weights: { N: 2 } },
      { label: 'B', text: '反思是不是大方向和定位错了', weights: { B: 1, S: 1 } },
      { label: 'C', text: '跟甲方深入聊清楚到底要什么', weights: { C: 2, N: 1 } },
      { label: 'A', text: '再推翻重来一个更好的', weights: { D: 2 } },
    ],
  },
  {
    id: 'q18',
    q: '项目进入施工阶段，你的状态更接近：',
    options: [
      { label: 'C', text: '更关注成本和落地结果', weights: { B: 2 } },
      { label: 'A', text: '兴趣下降，设计已经完成了', weights: { D: 2 } },
      { label: 'D', text: '开始频繁沟通各方，避免翻车', weights: { C: 2, S: 1 } },
      { label: 'B', text: '开始认真盯细节和图纸', weights: { T: 2, S: 1 } },
    ],
  },
  {
    id: 'q19',
    q: '你接手了一个非常混乱的项目，资料不全、逻辑不清、空间不合理，你第一反应是：',
    options: [
      { label: 'C', text: '先和关键人沟通，搞清楚真实需求', weights: { C: 2 } },
      { label: 'B', text: '先把所有信息整理成一个清晰的架构', weights: { S: 2 } },
      { label: 'A', text: '先画几个方案草图找找方向', weights: { D: 2 } },
      { label: 'D', text: '先想一个说服力强的故事来推进', weights: { N: 2 } },
    ],
  },
  {
    id: 'q20',
    q: '团队里最容易落到你身上的角色是：',
    options: [
      { label: 'C', text: '帮大家做决策的人', weights: { B: 2, S: 1 } },
      { label: 'B', text: '解决技术问题的人', weights: { T: 2, S: 1 } },
      { label: 'D', text: '负责沟通协调的人', weights: { C: 2 } },
      { label: 'A', text: '出想法和概念的人', weights: { D: 2, N: 1 } },
    ],
  },
  {
    id: 'q21',
    q: '一个大型项目涉及多个团队，每次开会各说各话，你会怎么协调?',
    options: [
      { label: 'B', text: '建立统一的规则和流程，让大家按同一逻辑执行', weights: { S: 2, C: 1 } },
      { label: 'A', text: '直接做一个整合方案，让大家看结果', weights: { D: 1, S: 1 } },
      { label: 'D', text: '重新包装项目，让大家对齐一个目标愿景', weights: { N: 2 } },
      { label: 'C', text: '分别沟通，慢慢统一意见', weights: { C: 2 } },
    ],
  },
  {
    id: 'q22',
    q: '工作中，你经常被其他人吐槽的点是：',
    options: [
      { label: 'D', text: '太会说', weights: { N: 1, C: 1 } },
      { label: 'A', text: '太感性', weights: { D: 1 } },
      { label: 'C', text: '太现实', weights: { B: 1 } },
      { label: 'B', text: '太严谨', weights: { T: 1, S: 1 } },
    ],
  },
  {
    id: 'q23',
    q: '如果必须加班，你更不排斥做哪类工作？',
    options: [
      { label: 'D', text: '做项目的平面和空间示意图', weights: { C: 1, N: 1 } },
      { label: 'A', text: '整理汇报文件的内容和逻辑', weights: { N: 2, S: 1 } },
      { label: 'C', text: '把图纸、节点和细节补齐', weights: { T: 2 } },
      { label: 'B', text: '把效果图渲染到更极致', weights: { D: 1, B: 1 } },
    ],
  },
  {
    id: 'q24',
    q: '面对一个定位特别模糊的项目，你更倾向：',
    options: [
      { label: 'B', text: '先建立逻辑结构，不然很难推进', weights: { S: 1 } },
      { label: 'C', text: '先评估风险，判断值不值得做', weights: { B: 1 } },
      { label: 'A', text: '直接开始设计，边做边想', weights: { D: 1 } },
      { label: 'D', text: '先统一所有人的认知', weights: { C: 1 } },
    ],
  },
  {
    id: 'q25',
    q: '如果一个项目预算有限，你最本能的反应是：',
    options: [
      { label: 'D', text: '重新组织各方预期，避免过程失控', weights: { C: 2, S: 1 } },
      { label: 'B', text: '优先优化做法，确保质量和可执行性', weights: { T: 2 } },
      { label: 'C', text: '直接重算投入产出，看是否要调整方向', weights: { B: 2 } },
      { label: 'A', text: '想办法保住最核心的体验和表达', weights: { D: 1, N: 1 } },
    ],
  },
  {
    id: 'q26',
    q: '如果你失业了，暂时不想找下一份工作。打算先做个社媒账号，你可能选：',
    options: [
      { label: 'C', text: '介绍爆款产品、能带货的账号', weights: { B: 2 } },
      { label: 'D', text: '介绍升学和工作经验的账号', weights: { N: 2, B: 1 } },
      { label: 'A', text: '审美提升和创意分享的账号', weights: { D: 2 } },
      { label: 'B', text: 'ai、专业工具学习的账号', weights: { T: 2, B: 1 } },
    ],
  },
  {
    id: 'q27',
    q: '如果你要开一家公司，以你的能力，你更可能开成：',
    options: [
      { label: 'B', text: '一个技术驱动的团队', weights: { T: 2, S: 1 } },
      { label: 'D', text: '一个有影响力的品牌', weights: { N: 2, B: 1 } },
      { label: 'A', text: '一个设计很酷的studio', weights: { D: 2, N: 1 } },
      { label: 'C', text: '一个很赚钱的电商', weights: { B: 2, C: 1 } },
    ],
  },
  {
    id: 'q28',
    q: '你成功开了自己的公司，作为老板，你的工作内容更多的是：',
    options: [
      { label: 'A', text: '定义作品的调性和气质', weights: { D: 1, N: 1 } },
      { label: 'C', text: '判断优先级和团队资源配置', weights: { B: 1, S: 1 } },
      { label: 'D', text: '把外部关系协调起来', weights: { C: 2 } },
      { label: 'B', text: '把复杂的工序做准确', weights: { T: 1, S: 1 } },
    ],
  },
  {
    id: 'q29',
    q: '在一个项目中，两个关键的角色发生冲突，作为老板，你会：',
    options: [
      { label: 'B', text: '从成本和结果判断谁更合理', weights: { B: 2 } },
      { label: 'C', text: '在中间协调，让双方都能妥协', weights: { C: 2 } },
      { label: 'A', text: '先看谁的方案更好、更有突破', weights: { D: 2 } },
      { label: 'D', text: '重新定义问题，让冲突变得不重要', weights: { N: 2, C: 1 } },
    ],
  },
  {
    id: 'q30',
    q: '最后一题 -- 在平行宇宙里，你还是搞建筑的，你觉得你的角色会是：',
    options: [
      { label: 'A', text: '万众瞩目的明星建筑师', weights: { D: 1, B: 1, N: 1 } },
      { label: 'C', text: '哈佛设计学院GSD的全职教授', weights: { S: 2, N: 1 } },
      { label: 'D', text: '大型国际事务所(SOM、KPF等)的合伙人', weights: { C: 2, B: 1 } },
      { label: 'B', text: '成功打造多个爆款项目的地产开发商', weights: { B: 2, N: 1 } },
    ],
  },
];
