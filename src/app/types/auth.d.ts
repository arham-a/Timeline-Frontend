
export interface RegisterRequest {
    fname: string;
    lname: string;
    email: string;
    username: string;
    password: string;
  }
  
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: {
      code: string;
      message: string;
      details?: Record<string, string>;
    };
  }
  
  export interface RegisterResponse {
    userId: string;
  }
  
  export interface LoginResponse {
    accessToken: string;
  }