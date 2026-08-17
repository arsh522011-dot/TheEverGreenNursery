import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

// Helper to save a document to Firestore
export async function saveDocumentFirestore<T extends Record<string, any>>(collectionName: string, docId: string, data: T) {
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, data, { merge: true });
    return true;
  } catch (error) {
    console.warn(`Firestore write error for ${collectionName}/${docId}:`, error);
    return false;
  }
}

// Helper to delete a document from Firestore
export async function deleteDocumentFirestore(collectionName: string, docId: string) {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.warn(`Firestore delete error for ${collectionName}/${docId}:`, error);
    return false;
  }
}

// Helper to fetch all documents in a collection
export async function fetchCollectionFirestore<T>(collectionName: string): Promise<T[] | null> {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const items: T[] = [];
    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as T);
    });
    return items;
  } catch (error) {
    console.warn(`Firestore read error for ${collectionName}:`, error);
    return null;
  }
}

// Helper to fetch a single document from Firestore
export async function fetchDocumentFirestore<T>(collectionName: string, docId: string): Promise<T | null> {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as T;
    }
    return null;
  } catch (error) {
    console.warn(`Firestore read error for ${collectionName}/${docId}:`, error);
    return null;
  }
}

// Helper to listen to a single document's real-time changes
export function subscribeDocumentFirestore<T>(collectionName: string, docId: string, callback: (data: T) => void) {
  try {
    const docRef = doc(db, collectionName, docId);
    return onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data() as T);
      }
    }, (err) => {
      console.warn(`Firestore document snapshot error for ${collectionName}/${docId}:`, err);
    });
  } catch (err) {
    console.warn(`Failed to subscribe to document ${collectionName}/${docId}:`, err);
    return () => {};
  }
}

// Helper to listen to real-time changes
export function subscribeCollectionFirestore<T>(collectionName: string, callback: (data: T[]) => void) {
  try {
    return onSnapshot(collection(db, collectionName), (snapshot) => {
      const items: T[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as T);
      });
      callback(items);
    }, (err) => {
      console.warn(`Firestore snapshot error for ${collectionName}:`, err);
    });
  } catch (err) {
    console.warn(`Failed to subscribe to ${collectionName}:`, err);
    return () => {};
  }
}
