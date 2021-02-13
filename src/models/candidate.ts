export enum Education {
  DOCTOR,
  MASTER,
  UNDERGRADUATE,
  JUNIOR_COLLEGE,
  HIGH_SCHOOL,
  OTHER,
}

export enum Link {
  NOT_APPLY,
  FIRST_FILTRATION,
  DEPARTMENT_FILTRATION,
  INTERVIEW,
  OFFER_COMMUNICATION,
  WAIT_FOR_HIRED,
}

export enum Status {
  WAIT_FOR_HR_FILTERED,
  WAIT_FOR_DEPARTMENT_FILTERED,
  WAIT_FOR_ARRANGE_INTERVIEW,
  INVITED,
  TIME_NOT_RIGHT,
  BE_REJECTED,
  WAIT_FOR_INTERVIEW,
  WAIT_FOR_OFFER_COMMUNICATION,
  WAIT_FOR_HIRED,
  OBSOLETE,
}

export enum BackOperation {
  PASS,
  OBSOLETE,
  ARRANGE,
  CHANGE_THE_TIME,
  FINISH,
}

export interface Candidate {
  id: string;
  phone: number;
  name: string;
  email: string;
  job: string;
  resumeUrl: string;
  education: Education;
  sex: string;
  age: number;
  cTime: Date;
  interviewTime: Date;
  status: Status;
  currentLink: Link;
  operations: BackOperation[];
}

export enum TabKey {
  ALL_APPLIED = 'ALL_APPLIED',
  FIRST_FILTRATION = 'FIRST_FILTRATION',
  DEPARTMENT_FILTRATION = 'DEPARTMENT_FILTRATION',
  INTERVIEW = 'INTERVIEW',
  OFFER_COMMUNICATION = 'OFFER_COMMUNICATION',
  TO_BO_HIRED = 'TO_BO_HIRED',
  OBSOLETED = 'OBSOLETED',
}
