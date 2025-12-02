import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useAuth } from '../auth/authContext';
import './styles/ReportModal.css';

type ReportModalProps = {
    isOpen: boolean;
    onClose: () => void;
    listingId: string;
    listingTitle: string;
}

const ReportModal: React.FC<ReportModalProps> = ({
    isOpen,
    onClose,
    listingId,
    listingTitle
}) => {

    const { currentUser } = useAuth();
    const [reason, setReason] = useState<string>('');
    const [details, setDetails] = useState('');
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!reason) {
            alert('Please select a reason');
            return;
        }

        if (!currentUser) return;

        setSubmitting(true);

        try {
            await addDoc(collection(db, 'reports'), {
                listingId,
                listingTitle,
                reportedBy: currentUser.uid,
                reportedEmail: currentUser.email,
                reason,
                details,
                status: 'pending',
                createdAt: serverTimestamp()

            });

            alert('Report submitted. Thank you for helping us keep our community safe.');
            onClose();
            setReason('');
            setDetails('');
        } catch (error) {
            console.error('Error submitting report:', error);
            alert('Failed to submit report. Please try again.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content report-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Report Listing</h2>
                    <button
                        onClick={onClose}
                        className="close-btn"
                    >
                        x
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <p className="report-listing-title">
                        Reporting: <strong>{listingTitle}</strong>
                    </p>

                    <div className="form-group">
                        <label>Reason for report *</label>
                        <select
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required
                        >
                            <option value="">Select a reason</option>
                            <option value="scam">Scam or Fraud</option>
                            <option value="inappropriate">Inappropriate Content</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Additional details (optional)</label>
                        <textarea
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            rows={4}
                        />
                    </div>

                    <div className="report-info">
                        <p>⚠️ False reports may result in account suspension</p>
                    </div>

                    <div className="modal-actions">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="cancel-btn"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="submit-report-btn"
                        >
                            {submitting ? 'Submitting...' : 'Submit Report'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ReportModal;