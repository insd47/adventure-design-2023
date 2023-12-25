export enum AttendanceStatus {
  ATTENDANCE = "ATTENDANCE",
  ABSENCE = "ABSENCE",
  EARLY_DEPARTURE = "EARLY_DEPARTURE",
  TARDINESS = "TARDINESS",
}

export interface Attendance {
  id: string;
  status: AttendanceStatus;
}

export interface Student {
  name: string;
  id: string;
}