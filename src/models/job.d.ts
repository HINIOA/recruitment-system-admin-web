export interface Job {
  id: string;
  name: string;
  department: string;
  desc: string;
  c_time: string;
  p_time?: Date;
  location: string;
  types: string[];
  recruitNumber: number;
}
