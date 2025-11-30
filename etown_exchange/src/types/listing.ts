import {Timestamp} from 'firebase/firestore';

export interface Listing {
    id: string;
    title: string;
    price: string;
    description: string;
    image?: string;
    condition?: string;
    category?: string;
    seller?: string;
    userId: string;
    createdAt: Timestamp;
}