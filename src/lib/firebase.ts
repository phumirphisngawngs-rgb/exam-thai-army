import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { ExamSubmission } from '../types';
import { INITIAL_SUBMISSIONS } from '../data/examData';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with custom databaseId if configured
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

const SUBMISSIONS_COLLECTION = 'submissions';

/**
 * Subscribe to real-time updates for all exam submissions across all devices.
 * Calls callback whenever a new exam is submitted or graded on any device.
 */
export function subscribeToSubmissions(
  onUpdate: (submissions: ExamSubmission[]) => void,
  onError?: (error: Error) => void
) {
  try {
    const q = query(
      collection(db, SUBMISSIONS_COLLECTION),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          // If Firestore collection is empty, trigger seeding once
          seedInitialDataIfNeeded().then((seeded) => {
            if (seeded) {
              // The next snapshot trigger will supply the data
            } else {
              onUpdate([]);
            }
          });
          return;
        }

        const list: ExamSubmission[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as ExamSubmission;
          list.push({
            ...data,
            id: docSnap.id, // ensure ID matches doc id
          });
        });
        onUpdate(list);
      },
      (err) => {
        console.error('Firestore onSnapshot error:', err);
        if (onError) onError(err);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error('Failed to subscribe to submissions:', error);
    if (onError) onError(error as Error);
    return () => {};
  }
}

/**
 * Seed initial sample submissions to Firestore if database collection is empty.
 */
export async function seedInitialDataIfNeeded(): Promise<boolean> {
  try {
    const colRef = collection(db, SUBMISSIONS_COLLECTION);
    const existing = await getDocs(colRef);
    if (existing.empty && INITIAL_SUBMISSIONS.length > 0) {
      const batch = writeBatch(db);
      for (const sub of INITIAL_SUBMISSIONS) {
        const docRef = doc(db, SUBMISSIONS_COLLECTION, sub.id);
        batch.set(docRef, sub);
      }
      await batch.commit();
      console.log('Seeded initial exam submissions to cloud Firestore successfully');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error seeding initial data to Firestore:', error);
    return false;
  }
}

/**
 * Save new candidate submission to cloud Firestore.
 */
export async function saveSubmissionToCloud(submission: ExamSubmission): Promise<void> {
  try {
    const docRef = doc(db, SUBMISSIONS_COLLECTION, submission.id);
    await setDoc(docRef, submission);
  } catch (error) {
    console.error('Error saving submission to cloud Firestore:', error);
    throw error;
  }
}

/**
 * Update candidate grading, scores, status, evaluator comments in cloud Firestore.
 */
export async function updateSubmissionInCloud(
  submissionId: string,
  updatedData: Partial<ExamSubmission>
): Promise<void> {
  try {
    const docRef = doc(db, SUBMISSIONS_COLLECTION, submissionId);
    await updateDoc(docRef, updatedData);
  } catch (error) {
    console.error('Error updating submission in cloud Firestore:', error);
    throw error;
  }
}

/**
 * Delete submission from cloud Firestore.
 */
export async function deleteSubmissionFromCloud(submissionId: string): Promise<void> {
  try {
    const docRef = doc(db, SUBMISSIONS_COLLECTION, submissionId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting submission from cloud Firestore:', error);
    throw error;
  }
}
