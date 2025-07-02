import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
} from '@react-native-firebase/firestore';
import { Alert } from 'react-native';

// Initialize Firestore
const db = getFirestore();

// Add a document using modular API
export async function addMenuItem(item) {
  const menuItemsCollection = collection(db, 'menuItems');
  try {
    await addDoc(menuItemsCollection, {
      name: item.name,
      price: item.price,
      createdAt: serverTimestamp(),
    });
    Alert.alert('Success', 'Menu item added!');
  } catch (error) {
    Alert.alert('Failed to add menu item', error.message);
    throw error;
  }
}

// Subscribe to realtime updates
export function subscribeToMenuItems(onUpdate, onError) {
  const menuItemsCollection = collection(db, 'menuItems');

  const unsubscribe = onSnapshot(
    menuItemsCollection,
    querySnapshot => {
      const menuItems = [];
      querySnapshot.forEach(doc => {
        menuItems.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      onUpdate(menuItems);
    },
    error => {
      console.error('Realtime update error:', error);
      if (onError) onError(error);
    },
  );

  return unsubscribe;
}
