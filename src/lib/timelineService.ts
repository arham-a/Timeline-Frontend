import api from './axios';

export interface TimelineMetadata {
  timelineTypes: {
    id: string;
    type: string;
    needsTimeUnit: boolean;
    needsDuration: boolean;
    supportsScheduling: boolean;
  }[];
  timeUnits: {
    id: string;
    code: string;
  }[];
}

interface MetadataResponse {
  data: TimelineMetadata;
}

export interface CreateTimelineDto {
  title: string;
  description: string;
  typeId: string;
  timeUnitId: string;
  isPublic: boolean;
  enableScheduling: boolean;
  duration: number;
}

export interface Timeline {
  id: string;
  title: string;
  description: string;
  type: {
    id: string;
    type: string;
  };
  timeUnit: {
    id: string;
    code: string;
  } | null;
  isForked: boolean;
  isPublic: boolean;
  enableScheduling: boolean;
  duration: number | null;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    username: string;
  };
  forkDetails?:{
    originalTimelineId: string;
    forkedVersion:string;
  }
  version: string;

}

interface UserTimelinesResponse {
  data: {
    timelines: Timeline[];
    total: number;
    page: number;
    limit: number;
  }
}

interface SingleTimelineResponse {
  data: Timeline;
}

export const timelineService = {
  async getMetadata(): Promise<TimelineMetadata> {
    try {
      const response = await api.get<MetadataResponse>('/timeline/metadata');
      return response.data.data;
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
      const response = await api.get<SingleTimelineResponse>(`/timeline/${id}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  async getUserTimelines(userId: string): Promise<Timeline[]> {
    try {
      const response = await api.get<UserTimelinesResponse>(`/timeline/user/${userId}`);
      console.log("user timelines", response.data.data.timelines);
      return response.data?.data.timelines;
    } catch (error) {
      throw error;
    }
  },

  async createTimeline(timelineData: CreateTimelineDto): Promise<Timeline> {
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
  },

  async forkTimeline(timelineId: string): Promise<Timeline> {
    try {
      const response = await api.post<{ success: boolean; message: string; data: Timeline }>(`/timeline/fork/${timelineId}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
}; 