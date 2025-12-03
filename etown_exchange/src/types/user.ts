import {Timestamp} from 'firebase/firestore';

export interface UserProfile {
    userId: string;
    email: string;
    firstName: string;
    lastName?: string;
    profilePicture?: string;
    bio?: string;
    instagramHandle?: string;
    snapchatHandle?: string;
    preferredMeetingLocation?: string;
    customMeetingLocation?: string;
    showLastName: boolean;
    showInstagram: boolean;
    showSnapchat: boolean;
    createdAt: Timestamp;
    updatedAt?: Timestamp;
}