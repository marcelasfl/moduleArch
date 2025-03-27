export interface HttpClientInterface {
    get<T>(url: string, params?: Record<string, any>, headers?: Record<string, string>): Promise<T>;
    post<T>(url: string, data?: any, headers?: Record<string, string>): Promise<T>;
    put<T>(url: string, data?: any, headers?: Record<string, string>): Promise<T>;
    delete<T>(url: string, headers?: Record<string, string>): Promise<T>;
  }