export interface StorageAdapter {
  get(id: string): Promise<any>
  set(id: string, value: any): Promise<void>
  getAll(): Promise<any[]>
  delete(id: string): Promise<void>
}