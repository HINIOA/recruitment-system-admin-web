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
  WAIT_FOR_APPLY,
  WAIT_FOR_HR_FILTERED,
  WAIT_FOR_DEPARTMENT_FILTERED,
  WAIT_FOR_APPOINT_INTERVIEWER,
  WAIT_FOR_ARRANGE_INTERVIEW,
  INVITED,
  TIME_NOT_RIGHT,
  WAIT_FOR_INTERVIEW,
  WAIT_FOR_OFFER_COMMUNICATION,
  WAIT_FOR_HIRED,
  HIRED,
  BE_REJECTED,
  OBSOLETE,
}

export enum Operation {
  PASS,
  OBSOLETE,
  ARRANGE,
  RESCHEDULE,
  FINISH,
  AGREE,
  REQUEST_RESCHEDULING,
  REJECT,
  APPOINT_INTERVIEWER,
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
  operations: Operation[];
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
