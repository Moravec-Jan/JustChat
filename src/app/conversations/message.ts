export interface Message {
  system: boolean;
  id: number;
  status: string;
  author: string;
  body: string;
}
