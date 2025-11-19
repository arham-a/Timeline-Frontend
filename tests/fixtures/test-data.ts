/**
 * Test data fixtures for timeline app
 */

export const mockTimeline = {
  id: 'test-timeline-1',
  title: 'Test Timeline',
  description: 'A test timeline for automated testing',
  isPublic: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const mockTimelines = [
  {
    id: 'timeline-1',
    title: 'Web Development Roadmap',
    description: 'Complete guide to becoming a full-stack developer',
    isPublic: true,
    author: 'John Doe',
    forks: 42,
    likes: 128,
  },
  {
    id: 'timeline-2',
    title: 'Machine Learning Journey',
    description: 'From basics to advanced ML concepts',
    isPublic: true,
    author: 'Jane Smith',
    forks: 35,
    likes: 95,
  },
  {
    id: 'timeline-3',
    title: 'DevOps Mastery',
    description: 'Learn DevOps tools and practices',
    isPublic: true,
    author: 'Bob Johnson',
    forks: 28,
    likes: 73,
  },
];

export const mockSegment = {
  id: 'segment-1',
  title: 'Learn HTML & CSS',
  description: 'Master the fundamentals of web design',
  order: 1,
  isCompleted: false,
  dueDate: null,
};

export const mockSegments = [
  {
    id: 'segment-1',
    title: 'Introduction to Programming',
    description: 'Learn basic programming concepts',
    order: 1,
    isCompleted: true,
  },
  {
    id: 'segment-2',
    title: 'JavaScript Fundamentals',
    description: 'Master JavaScript basics',
    order: 2,
    isCompleted: false,
  },
  {
    id: 'segment-3',
    title: 'React Framework',
    description: 'Build modern web apps with React',
    order: 3,
    isCompleted: false,
  },
];

export const mockUser = {
  id: 'user-1',
  name: 'Test User',
  email: 'test@example.com',
  avatar: null,
  bio: 'A test user for automated testing',
  createdAt: new Date().toISOString(),
};

/**
 * Generate random test data
 */
export function generateRandomTimeline() {
  const id = `timeline-${Date.now()}`;
  return {
    id,
    title: `Test Timeline ${id}`,
    description: `Auto-generated timeline for testing`,
    isPublic: Math.random() > 0.5,
    createdAt: new Date().toISOString(),
  };
}

export function generateRandomSegment(timelineId: string, order: number) {
  const id = `segment-${Date.now()}-${order}`;
  return {
    id,
    timelineId,
    title: `Test Segment ${order}`,
    description: `Auto-generated segment for testing`,
    order,
    isCompleted: false,
  };
}

/**
 * API response mocks
 */
export const apiResponses = {
  success: {
    status: 200,
    body: { success: true, message: 'Operation successful' },
  },
  created: {
    status: 201,
    body: { success: true, message: 'Resource created' },
  },
  badRequest: {
    status: 400,
    body: { success: false, message: 'Bad request' },
  },
  unauthorized: {
    status: 401,
    body: { success: false, message: 'Unauthorized' },
  },
  notFound: {
    status: 404,
    body: { success: false, message: 'Resource not found' },
  },
  serverError: {
    status: 500,
    body: { success: false, message: 'Internal server error' },
  },
};
