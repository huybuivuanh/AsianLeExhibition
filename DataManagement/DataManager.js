import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  deleteDoc,
  doc,
} from '@react-native-firebase/firestore';
import { Alert } from 'react-native';

// Initialize Firestore
const db = getFirestore();

// Menu Items Management

// Add a new menu item to the 'menuItems' collection
export async function addMenuItem(item) {
  const menuItemsCollection = collection(db, 'menuItems');
  try {
    await addDoc(menuItemsCollection, {
      name: item.name,
      price: item.price,
      time: serverTimestamp(),
    });
    Alert.alert('Success', 'Menu item added!');
  } catch (error) {
    Alert.alert('Failed to add menu item', error.message);
    throw error;
  }
}

// Delete a menu item by its document ID
export async function deleteMenuItem(itemId) {
  try {
    const itemDoc = doc(db, 'menuItems', itemId);
    await deleteDoc(itemDoc);
    Alert.alert('Success', 'Menu item deleted!');
  } catch (error) {
    Alert.alert('Failed to delete menu item', error.message);
    throw error;
  }
}

// Subscribe to realtime updates of menu items
export function subscribeToMenuItems(onUpdate, onError) {
  const menuItemsCollection = collection(db, 'menuItems');

  const unsubscribe = onSnapshot(
    menuItemsCollection,
    querySnapshot => {
      const menuItems = [];
      querySnapshot.forEach(docSnap => {
        menuItems.push({
          id: docSnap.id,
          ...docSnap.data(),
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

// Current Orders Management

// Subscribe to realtime updates of current orders
export function subscribeToCurrentOrders(onUpdate, onError) {
  const currentOrdersCollection = collection(db, 'currentOrders');

  const unsubscribe = onSnapshot(
    currentOrdersCollection,
    querySnapshot => {
      const currentOrders = [];
      querySnapshot.forEach(docSnap => {
        currentOrders.push({
          id: docSnap.id,
          ...docSnap.data(),
        });
      });
      onUpdate(currentOrders);
    },
    error => {
      console.error('Realtime update error:', error);
      if (onError) onError(error);
    },
  );

  return unsubscribe;
}

// Add a new menu item to the 'menuItems' collection
export async function addCurrentOrder(order) {
  const currentOrdersCollection = collection(db, 'currentOrders');
  try {
    await addDoc(currentOrdersCollection, {
      itemIDs: order.itemIDs,
      total: order.total,
      time: serverTimestamp(),
    });
    Alert.alert('Success', 'Current order added!');
  } catch (error) {
    Alert.alert('Failed to add current order', error.message);
    throw error;
  }
}

// Delete a current order by its document ID
export async function deleteCurrentOrder(orderId) {
  try {
    const orderDoc = doc(db, 'currentOrders', orderId);
    await deleteDoc(orderDoc);
    Alert.alert('Success', 'Current order deleted!');
  } catch (error) {
    Alert.alert('Failed to delete current order', error.message);
    throw error;
  }
}
