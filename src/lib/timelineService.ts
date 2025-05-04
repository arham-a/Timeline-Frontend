import api from './axios';

interface TimelineMetadata {
  types: string[];
  timeUnits: string[];
}

interface Timeline {
  id: string;
  title: string;
  description: string;
  type: string;
  timeUnit: string;
  startDate: string;
  endDate: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export const timelineService = {
  async getMetadata(): Promise<TimelineMetadata> {
    try {
      const response = await api.get<TimelineMetadata>('/timeline/metadata');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  async getTimelines(): Promise<Timeline[]> {
    try {
      const response = await api.get<Timeline[]>('/timeline');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  async getTimelineById(id: string): Promise<Timeline> {
    try {
      const response = await api.get<Timeline>(`/timeline/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  async createTimeline(timelineData: Omit<Timeline, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Timeline> {
    try {
      const response = await api.post<Timeline>('/timeline', timelineData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  async updateTimeline(id: string, timelineData: Partial<Timeline>): Promise<Timeline> {
    try {
      const response = await api.put<Timeline>(`/timeline/${id}`, timelineData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  async deleteTimeline(id: string): Promise<void> {
    try {
      await api.delete(`/timeline/${id}`);
    } catch (error) {
      throw error;
    }
  }
}; 