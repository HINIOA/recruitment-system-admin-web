export interface Job {
  _id: string;
  name: string;
  department: string;
  description: string;
  cTime: string;
  p_time?: Date;
  location: string;
  types: string[];
  recruitNumber: number;
}
