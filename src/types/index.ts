export interface Campus {
  id: string;
  name: string;
  shortName: string;
  domain: string;
  location: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  campusId: string;
  major: string;
  year: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior' | 'Graduate';
  interests: string[];
  topicIds: string[];
  postsToday: number;
  onboardingComplete: boolean;
}

export type PostType = 'short' | 'long' | 'prompt';

export interface Post {
  id: string;
  topicId: string;
  authorId: string;
  authorName: string;
  authorMajor: string;
  type: PostType;
  title?: string;
  body: string;
  replyCount: number;
  createdAt: string;
}

export interface Reply {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorMajor: string;
  body: string;
  createdAt: string;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  icon: string;
  postCount: number;
  relatedMajors: string[];
}

export interface OnboardingData {
  campusId: string;
  major: string;
  interests: string[];
  topicIds: string[];
}
