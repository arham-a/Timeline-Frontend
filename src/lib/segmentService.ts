import api from './axios';

interface Segment {
  id: string;
  title: string;
  description: string;
  type: string;
  startDate: string;
  endDate: string;
  timelineId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

export const segmentService = {
  async getSegments(timelineId: string): Promise<Segment[]> {
    try {
      const response = await api.get<Segment[]>(`/segment/timeline/${timelineId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  async getSegmentById(id: string): Promise<Segment> {
    try {
      const response = await api.get<Segment>(`/segment/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  async createSegment(segmentData: Omit<Segment, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Segment> {
    try {
      const response = await api.post<Segment>('/segment', segmentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  async updateSegment(id: string, segmentData: Partial<Segment>): Promise<Segment> {
    try {
      const response = await api.put<Segment>(`/segment/${id}`, segmentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  async deleteSegment(id: string): Promise<void> {
    try {
      await api.delete(`/segment/${id}`);
    } catch (error) {
      throw error;
    }
  }
}; 