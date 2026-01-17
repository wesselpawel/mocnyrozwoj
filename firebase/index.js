import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore/lite";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASURMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
const analytics = isSupported().then((yes) => (yes ? getAnalytics(app) : null));

async function getDocuments(collectionName) {
  console.log(`Getting documents from collection: ${collectionName}`);
  const ref = collection(db, collectionName);
  const response = await getDocs(ref);
  const res = response.docs.map((doc) => doc.data());
  console.log(`Retrieved ${res.length} documents from ${collectionName}:`, res);
  return res;
}

async function addDocument(collectionName, uniqueId, data) {
  console.log(
    `Adding document to ${collectionName} with ID: ${uniqueId}`,
    data
  );
  try {
    await setDoc(doc(db, collectionName, uniqueId), data);
    console.log(`Document saved successfully to ${collectionName}/${uniqueId}`);
  } catch (error) {
    console.error(
      `Error saving document to ${collectionName}/${uniqueId}:`,
      error
    );
    throw error;
  }
}

async function getDocument(collectionName, id) {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
}

async function removeDocument(collectionName, uniqueId) {
  await deleteDoc(doc(db, collectionName, uniqueId));
}

async function updateDocument(keys, values, collectionName, id) {
  const docRef = doc(db, collectionName, id);
  const updateData = {};
  keys.forEach((key, index) => {
    updateData[key] = values[index];
  });
  await updateDoc(docRef, updateData);
}

// Storage functions
async function uploadFile(file, path) {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
}

async function deleteFile(fileUrl) {
  const fileRef = ref(storage, fileUrl);
  await deleteObject(fileRef);
}

// Auth functions
async function signInWithEmail(email, password) {
  return await signInWithEmailAndPassword(auth, email, password);
}

async function signUpWithEmail(email, password) {
  return await createUserWithEmailAndPassword(auth, email, password);
}

async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  return await signInWithPopup(auth, provider);
}

async function logout() {
  return await signOut(auth);
}

// User management functions
async function createUserInFirestore(userData) {
  const { id, email, name, subscriptionStatus = "free" } = userData;

  // Check if user already exists
  const userDoc = await getDocument("users", id);

  if (userDoc) {
    console.log("User already exists in Firestore:", id);
    return userDoc; // Return existing user data
  }

  // Create new user document
  const newUserData = {
    id,
    email,
    name,
    subscriptionStatus,
    totalPurchases: 0,
    totalSpent: 0,
    lastPurchaseDate: null,
    purchasedCourses: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await addDocument("users", id, newUserData);
  console.log("User created in Firestore:", id);
  return newUserData;
}

export {
  storage,
  auth,
  addDocument,
  getDocuments,
  getDocument,
  removeDocument,
  updateDocument,
  uploadFile,
  deleteFile,
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  logout,
  onAuthStateChanged,
  createUserInFirestore,
};
