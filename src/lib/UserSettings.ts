import { Timestamp } from "@firebase/firestore";

export interface UserSettings {
  userId: string;
  dateOfBirth?: Date;
  showAgeOnTimeline: boolean;
}

export interface SerializableUserSettings {
  userId: string;
  dateOfBirth?: Timestamp;
  showAgeOnTimeline: boolean;
}
