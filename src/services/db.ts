import {
  DocumentData,
  query,
  collection,
  getFirestore,
  getDocs,
  addDoc,
  onSnapshot,
  where,
  doc,
  getDoc,
  DocumentReference,
  Query,
  DocumentChangeType,
  setDoc,
} from "firebase/firestore";

const db = getFirestore();

export async function getDocDataFromCollection<T>(
  collectionName: string,
  key: string,
  value: T
): Promise<DocumentData | null> {
  const docsData = await getDocsFromCollection(collectionName, key, value);
  if (docsData.length === 0) {
    return Promise.resolve(null);
  } else {
    return docsData[0];
  }
}

export async function getDocsFromCollection<T>(
  collectionName: string,
  key?: string,
  value?: T
): Promise<DocumentData> {
  const q = key
    ? query(collection(db, collectionName), where(key, "==", value))
    : query(collection(db, collectionName));

  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    Promise.resolve(null);
  }
  return snapshot.docs.map((doc) => doc.data());
}

export async function addDocToCollection<T>(
  collectionName: string,
  data: T extends DocumentData ? T : DocumentData
): Promise<DocumentReference> {
  return await addDoc(collection(db, collectionName), data);
}

export async function listenToDocChanges<T>(
  query: Query,
  changeType: DocumentChangeType,
  callback: (data: T) => void
): Promise<void> {
  console.log("Listening to doc changes");
  await onSnapshot(query, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      console.log("Change type", change.type);
      if (change.type === changeType) {
        callback(change.doc.data() as T);
      }
    });
  });
}

export function createQuery<T>(
  collectionName: string,
  key?: string,
  value?: T
): Query {
  if (key && value) {
    return query(collection(db, collectionName), where(key, "==", value));
  }
  return query(collection(db, collectionName));
}

export async function getDocSnapshot(collectionName: string, docId: string) {
  const docRef = doc(db, collectionName, docId);
  return await getDoc(docRef);
}

export async function updateDocData(
  collectionName: string,
  docId: string,
  data: DocumentData
) {
  const docRef = doc(db, collectionName, docId);
  await setDoc(docRef, data);
}
