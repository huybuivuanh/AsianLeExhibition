import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
} from '@react-native-firebase/firestore';
import { Alert } from 'react-native';

// Initialize Firestore
const db = getFirestore();

// Menu Items Management

// Add a new menu item to the 'menuItems' collection
export async function addMenuItem(item: { name: string; price: number }) {
  const menuItemsCollection = collection(db, 'menuItems');
  try {
    await addDoc(menuItemsCollection, {
      name: item.name,
      price: item.price,
      created: new Date().toISOString(),
    });
    Alert.alert('Success', 'Menu item added!');
  } catch (error) {
    Alert.alert('Failed to add menu item');
    throw error;
  }
}

// Delete a menu item by its document ID
export async function deleteMenuItem(itemId: string) {
  try {
    const itemDoc = doc(db, 'menuItems', itemId);
    await deleteDoc(itemDoc);
    Alert.alert('Success', 'Menu item deleted!');
  } catch (error) {
    Alert.alert('Failed to delete menu item');
    throw error;
  }
}

// Subscribe to realtime updates of menu items
export function subscribeToMenuItems(onUpdate: any, onError: any) {
  const menuItemsCollection = collection(db, 'menuItems');

  const unsubscribe = onSnapshot(
    menuItemsCollection,
    querySnapshot => {
      const menuItems: MenuItem[] = [];
      querySnapshot.forEach(docSnap => {
        menuItems.push({
          ...(docSnap.data() as MenuItem),
          id: docSnap.id,
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
export function subscribeToCurrentOrders(onUpdate: any, onError: any) {
  const currentOrdersCollection = collection(db, 'currentOrders');

  const unsubscribe = onSnapshot(
    currentOrdersCollection,
    querySnapshot => {
      const currentOrders: Order[] = [];
      querySnapshot.forEach(docSnap => {
        currentOrders.push({
          ...(docSnap.data() as Order),
          id: docSnap.id,
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

// Submit the current order to the 'currentOrders' collection
export async function submitCurrentOrder(order: Order) {
  const currentOrdersCollection = collection(db, 'currentOrders');

  // Extract item IDs and total from the order
  const itemQuantities = order.items.reduce(
    (acc: { [key: string]: number }, item) => {
      if (item.id !== undefined) {
        acc[item.id] = item.quantity;
      }
      return acc;
    },
    {},
  );
  try {
    await addDoc(currentOrdersCollection, {
      quantities: itemQuantities,
      total: order.total,
      created: new Date().toISOString(),
    });
    Alert.alert('Success', 'Current order added!');
  } catch (error) {
    Alert.alert('Failed to add current order');
    throw error;
  }
}

// Delete a current order by its document ID
export async function deleteCurrentOrder(orderId: string) {
  try {
    const orderDoc = doc(db, 'currentOrders', orderId);
    await deleteDoc(orderDoc);
    Alert.alert('Success', 'Current order deleted!');
  } catch (error) {
    Alert.alert('Failed to delete current order');
    throw error;
  }
}
