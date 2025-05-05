import api from './axios';

export interface Segment {
  id: string; // UUID
  timelineId: string; // UUID reference to Timeline
  unitNumber: number;
  title: string;
  milestone: string | null;
  isForkModified: boolean;
  createdAt: Date;
  updatedAt: Date;
  goals: Array<{id:string, goal:string}>
  references: Array<{id:string, reference:string}>
}

export interface SegmentCreateDto {
  unitNumber: number;
  title: string;
  description: string;
  goals: string[];
  references?: string[];
  milestone?: string;
}

export interface SegmentBulkRequest {
  timelineId: string;
  segments:SegmentCreateDto[]
}

export interface SegmentBulkResponse {
  data: {
    timelineId: string;
    segments:Segment[]
  }
}

interface TimelineSegmentsResponse {
  data: {
    segments: Segment[];
    total: number;
    page: number;
    limit: number;
  }
}

export const segmentService = {
  async getTimelineSegments(timelineId: string): Promise<Segment[]> {
    try {
      const response = await api.get<TimelineSegmentsResponse>(`/segment/timeline/${timelineId}`);
      return response.data?.data.segments;
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

  async createSegmentsBulk(segmentsData:SegmentBulkRequest): Promise<Segment[]> {
    try {
      const response = await api.post<SegmentBulkResponse>('/segment/bulk', segmentsData);
      return response.data.data.segments;
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