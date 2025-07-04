import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  runTransaction,
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
  const orderNumberDocRef = doc(db, 'counters', 'orderNumber');

  // Extract item IDs and quantities from the order
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
    // 🔑 Run transaction to get and increment order number atomically
    const orderNumber = await runTransaction(db, async transaction => {
      const orderNumberDoc = await transaction.get(orderNumberDocRef);

      if (!orderNumberDoc.exists()) {
        throw new Error('Order number counter document does not exist!');
      }

      const data = orderNumberDoc.data();
      const currentNumber =
        data && data.current !== undefined ? data.current : 0;
      const nextNumber = currentNumber + 1;

      transaction.update(orderNumberDocRef, { current: nextNumber });

      return nextNumber;
    });

    // Save the order with the generated orderNumber
    await addDoc(currentOrdersCollection, {
      orderNumber,
      quantities: itemQuantities,
      total: order.total,
      created: new Date().toISOString(),
    });

    Alert.alert('Success', `Order #${orderNumber} added!`);
  } catch (error) {
    console.error('Failed to add current order:', error);
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
