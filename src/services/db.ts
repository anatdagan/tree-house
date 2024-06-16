// TODO: "@react-query-firebase/firestore";
import {
  DocumentData,
  query,
  collection,
  getDocs,
  addDoc,
  onSnapshot,
  where,
  deleteDoc,
  doc,
  getDoc,
  DocumentReference,
  Query,
  DocumentChangeType,
  setDoc,
  limit,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase";

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
  value?: T,
  limit?: number,
  orderBy?: string
): Promise<DocumentData> {
  const snapshot = await getDocs(
    createQuery(collectionName, key, value, limit, orderBy)
  );
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
  value?: T,
  count?: number,
  order?: string
): Query {
  const queryConstraints = [];
  if (key && value) {
    queryConstraints.push(where(key, "==", value));
  }
  if (count) {
    queryConstraints.push(limit(count));
  }
  if (order) {
    queryConstraints.push(orderBy(order));
  }
  return query(collection(db, collectionName), ...queryConstraints);
}

export async function getDocById(collectionName: string, docId: string) {
  const docRef = doc(db, collectionName, docId);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return snapshot.data();
  }
  return null;
}

export async function updateDocData(
  collectionName: string,
  docId: string,
  data: DocumentData
) {
  const docRef = doc(db, collectionName, docId);
  await setDoc(docRef, data);
}

export async function deleteDocsFromCollection(
  collectionName: string,
  key: string,
  value: string
) {
  console.log("Deleting docs from collection", collectionName);
  const docs = await await getDocs(createQuery(collectionName, key, value));
  docs.forEach(async (d) => {
    console.log("Deleting doc", d.id);
    await deleteDoc(doc(db, collectionName, d.id));
  });
}
