import type { Campus, Topic, Post, Reply } from '@/types';

// ── Campus ────────────────────────────────────────────────────────
export const UW_CAMPUS: Campus = {
  id: 'uw',
  name: 'University of Washington',
  shortName: 'UW',
  domain: 'uw.edu',
  location: 'Seattle, WA',
};

export const CAMPUSES: Campus[] = [UW_CAMPUS];

// ── UW Majors grouped by college (for <optgroup> dropdowns) ───────
export const UW_MAJORS_BY_COLLEGE: { college: string; majors: string[] }[] = [
  {
    college: 'College of Arts & Sciences',
    majors: [
      'American Ethnic Studies',
      'American Indian Studies',
      'Anthropology',
      'Applied and Computational Mathematical Sciences',
      'Applied Mathematics',
      'Art, Art History, and Design',
      'Asian Languages and Literature',
      'Astrobiology',
      'Astronomy',
      'Biology',
      'Chemistry',
      'Cinema and Media Studies',
      'Classics',
      'Communication',
      'Comparative History of Ideas',
      'Dance',
      'Digital Arts and Experimental Media',
      'Disability Studies',
      'Drama',
      'Economics',
      'English',
      'French and Italian Studies',
      'Gender, Women, and Sexuality Studies',
      'General Studies',
      'Geography',
      'German Studies',
      'History',
      'Integrated Social Sciences',
      'Law, Societies, and Justice',
      'Linguistics',
      'Marine Biology',
      'Mathematics',
      'Microbiology',
      'Middle Eastern Languages and Cultures',
      'Music',
      'Neuroscience',
      'Philosophy',
      'Physics',
      'Political Science',
      'Psychology',
      'Scandinavian Studies',
      'Slavic Languages and Literatures',
      'Sociology',
      'Spanish and Portuguese Studies',
      'Speech and Hearing Sciences',
      'Statistics',
    ],
  },
  {
    college: 'College of Built Environments',
    majors: [
      'Architecture',
      'Built Environments',
      'Construction Management',
      'Landscape Architecture',
      'Real Estate',
      'Urban Design and Planning',
    ],
  },
  {
    college: 'College of Education',
    majors: ['Education, Learning, and Society'],
  },
  {
    college: 'College of Engineering',
    majors: [
      'Aeronautics and Astronautics',
      'Chemical Engineering',
      'Civil and Environmental Engineering',
      'Computer Science and Engineering',
      'Electrical and Computer Engineering',
      'Engineering',
      'Human Centered Design and Engineering',
      'Industrial and Systems Engineering',
      'Materials Science and Engineering',
      'Mechanical Engineering',
    ],
  },
  {
    college: 'College of the Environment',
    majors: [
      'Atmospheric and Climate Science',
      'Earth and Space Sciences',
      'School of Aquatic and Fishery Sciences',
      'School of Environmental and Forest Sciences',
      'School of Marine and Environmental Affairs',
      'School of Oceanography',
    ],
  },
  {
    college: 'Foster School of Business',
    majors: ['Business'],
  },
  {
    college: 'The Information School',
    majors: ['Informatics'],
  },
  {
    college: 'Jackson School of International Studies',
    majors: ['International Studies'],
  },
  {
    college: 'School of Nursing',
    majors: ['Nursing'],
  },
  {
    college: 'School of Public Health',
    majors: ['Food Systems, Nutrition, and Health', 'Health Management and Informatics'],
  },
  {
    college: 'Interdisciplinary',
    majors: ['Honors'],
  },
];

/** Flat sorted list — used anywhere a simple array is needed */
export const MAJORS: string[] = UW_MAJORS_BY_COLLEGE.flatMap(c => c.majors).sort((a, b) =>
  a.localeCompare(b),
);

// ── Interests ─────────────────────────────────────────────────────
export const INTERESTS: string[] = [
  'Machine Learning',
  'Web Development',
  'Research',
  'Startups',
  'Open Source',
  'Design',
  'Photography',
  'Music Production',
  'Fitness',
  'Gaming',
  'Film',
  'Creative Writing',
  'Debate',
  'Volunteering',
  'Cooking',
  'Hiking',
  'Investing',
  'Podcasting',
];

// ── Topics ────────────────────────────────────────────────────────
export const TOPICS: Topic[] = [
  {
    id: 'study-groups',
    name: 'Study Groups',
    description: 'Find study partners and organize group sessions.',
    icon: '📚',
    postCount: 142,
    relatedMajors: [],
  },
  {
    id: 'campus-events',
    name: 'Campus Events',
    description: 'Discover what\'s happening around the UW campus.',
    icon: '🎉',
    postCount: 89,
    relatedMajors: [],
  },
  {
    id: 'housing',
    name: 'Housing & Roommates',
    description: 'Find a place to live near the U District.',
    icon: '🏠',
    postCount: 67,
    relatedMajors: [],
  },
  {
    id: 'course-reviews',
    name: 'Course Reviews',
    description: 'Honest takes on UW classes, professors, and workload.',
    icon: '⭐',
    postCount: 213,
    relatedMajors: [],
  },
  {
    id: 'research',
    name: 'Research Opportunities',
    description: 'UW labs, internships, and academic collaborations.',
    icon: '🔬',
    postCount: 54,
    relatedMajors: [
      'Computer Science and Engineering',
      'Biology',
      'Chemistry',
      'Physics',
      'Neuroscience',
      'Statistics',
      'Informatics',
    ],
  },
  {
    id: 'clubs-sports',
    name: 'Clubs & Sports',
    description: 'Huskies extracurriculars — RSOs, intramurals, and more.',
    icon: '🐾',
    postCount: 98,
    relatedMajors: [],
  },
  {
    id: 'wellness',
    name: 'Mental Health & Wellness',
    description: 'A supportive space for Husky wellbeing.',
    icon: '💚',
    postCount: 31,
    relatedMajors: ['Psychology', 'Neuroscience', 'Nursing'],
  },
  {
    id: 'food',
    name: 'Food & Dining',
    description: 'HFS dining, Ave spots, and late-night snack recs.',
    icon: '🍕',
    postCount: 77,
    relatedMajors: [],
  },
  {
    id: 'cs-tech',
    name: 'CS & Tech Hub',
    description: 'Software, hardware, hackathons, and DubHacks.',
    icon: '💻',
    postCount: 189,
    relatedMajors: [
      'Computer Science and Engineering',
      'Electrical and Computer Engineering',
      'Statistics',
      'Informatics',
      'Human Centered Design and Engineering',
    ],
  },
  {
    id: 'careers',
    name: 'Internships & Careers',
    description: 'Recruiting, resume tips, and industry connections.',
    icon: '💼',
    postCount: 156,
    relatedMajors: ['Business', 'Computer Science and Engineering', 'Economics', 'Informatics'],
  },
];

// ── Filler posts (UW-specific) ────────────────────────────────────
export const SAMPLE_POSTS: Post[] = [
  {
    id: 'p1',
    topicId: 'cs-tech',
    authorId: 'a1',
    authorName: 'Alex Chen',
    authorMajor: 'Computer Science and Engineering',
    type: 'long',
    title: 'Best resources for learning transformers from scratch?',
    body: "I've been going through Andrej Karpathy's videos but looking for more structured material. Has anyone gone through the Hugging Face course or the fast.ai deep learning track? Would love to compare notes on what actually clicked.",
    replyCount: 8,
    createdAt: '2026-03-30T10:30:00Z',
  },
  {
    id: 'p2',
    topicId: 'study-groups',
    authorId: 'a2',
    authorName: 'Priya Sharma',
    authorMajor: 'Statistics',
    type: 'short',
    body: 'Looking for a study group for finals week! CSE 373 or STAT 390 focused. DM if interested 📚',
    replyCount: 5,
    createdAt: '2026-03-30T09:15:00Z',
  },
  {
    id: 'p3',
    topicId: 'campus-events',
    authorId: 'a3',
    authorName: 'Marcus Johnson',
    authorMajor: 'Business',
    type: 'short',
    body: "Husky Career Fair is this Thursday 2–6pm in the HUB. Over 80 companies including some solid Pacific Northwest startups. Don't sleep on it!",
    replyCount: 12,
    createdAt: '2026-03-30T08:00:00Z',
  },
  {
    id: 'p4',
    topicId: 'housing',
    authorId: 'a5',
    authorName: 'Jordan Kim',
    authorMajor: 'Mechanical Engineering',
    type: 'short',
    body: 'Anyone know of off-campus 2BR apartments available for fall near the U District? Budget ~$1,100/mo per person. Preferably walkable to Padelford.',
    replyCount: 3,
    createdAt: '2026-03-29T22:45:00Z',
  },
  {
    id: 'p5',
    topicId: 'course-reviews',
    authorId: 'a4',
    authorName: 'Sofia Rivera',
    authorMajor: 'Psychology',
    type: 'long',
    title: 'PSYCH 355 (Cognitive Psychology) – honest review',
    body: "Just finished the midterm and wanted to give a real take. Prof. Markman is brilliant but the lectures move FAST. Attend every class, the slides aren't enough on their own. Weekly response papers are the most work but genuinely help you retain things. Overall 8/10, would recommend.",
    replyCount: 6,
    createdAt: '2026-03-29T20:00:00Z',
  },
  {
    id: 'p6',
    topicId: 'wellness',
    authorId: 'a2',
    authorName: 'Priya Sharma',
    authorMajor: 'Statistics',
    type: 'prompt',
    title: 'How do you actually unwind after a brutal finals week?',
    body: "Genuinely asking – I always tell myself I'll relax and then immediately spiral into worrying about the next thing. What actually works for you?",
    replyCount: 14,
    createdAt: '2026-03-29T18:30:00Z',
  },
  {
    id: 'p7',
    topicId: 'careers',
    authorId: 'a1',
    authorName: 'Alex Chen',
    authorMajor: 'Computer Science and Engineering',
    type: 'long',
    title: 'My summer internship application timeline (what actually worked)',
    body: "Applied to ~40 companies starting in September. Got 8 phone screens, 4 final rounds, 2 offers. Here's what I learned: 1) Referrals beat cold apps 10x. 2) FAANG-style prep is mostly LeetCode but smaller companies care more about system design. 3) Apply earlier than you think you need to.",
    replyCount: 21,
    createdAt: '2026-03-29T14:00:00Z',
  },
  {
    id: 'p8',
    topicId: 'food',
    authorId: 'a3',
    authorName: 'Marcus Johnson',
    authorMajor: 'Business',
    type: 'short',
    body: 'Thai place on the Ave has a student discount on Tuesdays – 15% off with your Husky Card. The pad see ew is legit 🙌',
    replyCount: 4,
    createdAt: '2026-03-29T12:00:00Z',
  },
  {
    id: 'p9',
    topicId: 'research',
    authorId: 'a4',
    authorName: 'Sofia Rivera',
    authorMajor: 'Psychology',
    type: 'long',
    title: 'Undergrad research positions at UW – how competitive are they really?',
    body: "I've been emailing professors for two semesters and finally got a position in Dr. Lee's cognition lab. My honest take: cold emails work if they're specific. Read one of their recent papers, mention it. Offer to volunteer for a quarter first. Persistence matters more than credentials.",
    replyCount: 9,
    createdAt: '2026-03-28T11:00:00Z',
  },
  {
    id: 'p10',
    topicId: 'clubs-sports',
    authorId: 'a5',
    authorName: 'Jordan Kim',
    authorMajor: 'Mechanical Engineering',
    type: 'short',
    body: "Intramural basketball signups are open until Friday at the IMA! We need two more players for a full squad. No experience needed, just good vibes 🏀",
    replyCount: 7,
    createdAt: '2026-03-28T09:30:00Z',
  },
  {
    id: 'p11',
    topicId: 'cs-tech',
    authorId: 'a3',
    authorName: 'Marcus Johnson',
    authorMajor: 'Business',
    type: 'prompt',
    title: 'Non-CSE students learning to code – where are you now?',
    body: "I'm a Foster student who started learning Python last summer. Just shipped my first small web scraper. Curious how far others have gotten coming from a non-technical background.",
    replyCount: 11,
    createdAt: '2026-03-27T16:00:00Z',
  },
  {
    id: 'p12',
    topicId: 'study-groups',
    authorId: 'a5',
    authorName: 'Jordan Kim',
    authorMajor: 'Mechanical Engineering',
    type: 'short',
    body: "Anyone else use the Pomodoro technique for long study sessions in Suzzallo? Trying 25/5 but wondering if 50/10 works better for deep work.",
    replyCount: 8,
    createdAt: '2026-03-27T14:30:00Z',
  },
];

// ── Filler replies ────────────────────────────────────────────────
export const SAMPLE_REPLIES: Reply[] = [
  {
    id: 'r1',
    postId: 'p1',
    authorId: 'a2',
    authorName: 'Priya Sharma',
    authorMajor: 'Statistics',
    body: 'The HuggingFace course is genuinely great, especially the NLP section. Pair it with "Attention Is All You Need" once you have the intuition down.',
    createdAt: '2026-03-30T11:00:00Z',
  },
  {
    id: 'r2',
    postId: 'p1',
    authorId: 'a4',
    authorName: 'Sofia Rivera',
    authorMajor: 'Psychology',
    body: 'The Illustrated Transformer blog post was the best conceptual intro for me before diving into any code.',
    createdAt: '2026-03-30T11:45:00Z',
  },
  {
    id: 'r3',
    postId: 'p1',
    authorId: 'a3',
    authorName: 'Marcus Johnson',
    authorMajor: 'Business',
    body: 'Coming from non-CSE: d2l.ai (Dive into Deep Learning) is surprisingly accessible. Works through everything from scratch.',
    createdAt: '2026-03-30T12:00:00Z',
  },
  {
    id: 'r4',
    postId: 'p6',
    authorId: 'a1',
    authorName: 'Alex Chen',
    authorMajor: 'Computer Science and Engineering',
    body: 'Long walks around Portage Bay. Sounds boring but genuinely resets my brain better than anything else.',
    createdAt: '2026-03-29T19:00:00Z',
  },
  {
    id: 'r5',
    postId: 'p6',
    authorId: 'a5',
    authorName: 'Jordan Kim',
    authorMajor: 'Mechanical Engineering',
    body: 'Exercise at the IMA is the obvious answer but it actually works. Even 30 mins of basketball makes the next study session hit different.',
    createdAt: '2026-03-29T19:30:00Z',
  },
  {
    id: 'r6',
    postId: 'p6',
    authorId: 'a3',
    authorName: 'Marcus Johnson',
    authorMajor: 'Business',
    body: "I started cooking as a way to decompress. There's something about having a concrete, tangible output that feels really good after staring at abstract problems all day.",
    createdAt: '2026-03-29T20:00:00Z',
  },
  {
    id: 'r7',
    postId: 'p7',
    authorId: 'a2',
    authorName: 'Priya Sharma',
    authorMajor: 'Statistics',
    body: "The referral point is so true. I had friends at two Seattle companies who just forwarded my resume and heard back within 24 hours. Spent months cold applying elsewhere with silence.",
    createdAt: '2026-03-29T15:00:00Z',
  },
  {
    id: 'r8',
    postId: 'p7',
    authorId: 'a5',
    authorName: 'Jordan Kim',
    authorMajor: 'Mechanical Engineering',
    body: "Would love a follow-up on how you prepped for system design. That's where I always feel least confident.",
    createdAt: '2026-03-29T16:00:00Z',
  },
  {
    id: 'r9',
    postId: 'p9',
    authorId: 'a1',
    authorName: 'Alex Chen',
    authorMajor: 'Computer Science and Engineering',
    body: "This is exactly the advice I wish I'd had freshman year. Mentioned a specific paper in a cold email and got a reply same day from a prof who had ghosted my previous generic email.",
    createdAt: '2026-03-28T12:00:00Z',
  },
  {
    id: 'r10',
    postId: 'p5',
    authorId: 'a1',
    authorName: 'Alex Chen',
    authorMajor: 'Computer Science and Engineering',
    body: 'Taking this next quarter, really helpful context. Do you need to have taken intro psych first or is PSYCH 355 self-contained?',
    createdAt: '2026-03-29T21:00:00Z',
  },
  {
    id: 'r11',
    postId: 'p5',
    authorId: 'a4',
    authorName: 'Sofia Rivera',
    authorMajor: 'Psychology',
    body: "PSYCH 101 is technically a prereq but the instructor is flexible about it if you've had any related science background.",
    createdAt: '2026-03-29T21:30:00Z',
  },
];

// ── Helpers ───────────────────────────────────────────────────────
export function getPostsByTopic(topicId: string): Post[] {
  return SAMPLE_POSTS.filter(p => p.topicId === topicId);
}

export function getRepliesByPost(postId: string): Reply[] {
  return SAMPLE_REPLIES.filter(r => r.postId === postId);
}

export function getPostById(id: string): Post | undefined {
  return SAMPLE_POSTS.find(p => p.id === id);
}

export function getTopicById(id: string): Topic | undefined {
  return TOPICS.find(t => t.id === id);
}

export function getCampusById(id: string): Campus | undefined {
  return CAMPUSES.find(c => c.id === id);
}

export function detectCampusByEmail(email: string): Campus | undefined {
  const normalized = email.trim().toLowerCase();
  return normalized.endsWith('@uw.edu') ? UW_CAMPUS : undefined;
}
