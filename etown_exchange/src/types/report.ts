import {Timestamp} from 'firebase/firestore';

export interface Report {
    id: string;
    listingId: string;
    listingTitle: string;
    reportedBy: string;
    reporterEmail: string;
    reason: 'inappropriate' | 'scam' | 'other';
    details?: string;
    status: 'pending' | 'reviewed' | 'resolved';
    createdAt: Timestamp;
    reviewedAt?: Timestamp;
    reviewedBy?: string;
}