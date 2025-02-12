import { db } from './auth';  
import { collection, doc, getDoc } from 'firebase/firestore';  // Import the necessary Firestore methods

export const getUserRole = async (userId) => {
  try {
    // Access the 'users' collection and retrieve the specific document using doc
    const userDocRef = doc(db, 'user_role', userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.data().role;  // Assuming role is stored as a field in the user document
    } else {
      console.log('No user found.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user role:', error);
    throw error;
  }
};
