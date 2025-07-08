import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  onSnapshot,
  deleteDoc,
  doc,
  runTransaction,
  updateDoc,
} from '@react-native-firebase/firestore';
import { Alert } from 'react-native';
import { OrderStatus } from '../types/enum';

// Initialize Firestore
const db = getFirestore();

export const formattedDate = (isoString: string, onlyShowTime: boolean) => {
  const date = new Date(isoString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  if (onlyShowTime) {
    return `${hours}:${minutes}`;
  }
  return `${hours}:${minutes} - ${month}/${day}/${year}`;
};

export const sortOrders = (orders: Order[]) => {
  const sortedOrders = [...orders].sort((a, b) => {
    const dateA = new Date(a.created || '').getTime();
    const dateB = new Date(b.created || '').getTime();
    return dateB - dateA;
  });
  return sortedOrders;
};

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
  const orderHistoryCollection = collection(db, 'orderHistory');
  const orderNumberDocRef = doc(db, 'counters', 'orderNumber');

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

    const orderToBeSubmitted = {
      orderNumber,
      orderItems: order.orderItems,
      total: order.total,
      numberOfItem: order.numberOfItems,
      status: OrderStatus.InProgress,
      created: new Date().toISOString(),
    };

    // Save the order with the generated orderNumber
    // Generate a single Firestore doc ID
    const newOrderDocRef = doc(currentOrdersCollection);
    await setDoc(newOrderDocRef, orderToBeSubmitted);

    const orderHistoryDocRef = doc(orderHistoryCollection, newOrderDocRef.id);
    await setDoc(orderHistoryDocRef, orderToBeSubmitted);

    Alert.alert('Success', `Order #${orderNumber} added!`);
  } catch (error) {
    console.error('Failed to add current order:', error);
    Alert.alert('Failed to add current order');
    throw error;
  }
}

export async function updateOrder(orderId: string, status: OrderStatus) {
  try {
    const orderDoc = doc(db, 'currentOrders', orderId);
    const orderHistoryDoc = doc(db, 'orderHistory', orderId);

    await deleteDoc(orderDoc);

    if (status) {
      await updateDoc(orderHistoryDoc, {
        status: status,
      });
    }

    Alert.alert('Success', 'Order updated successfully!');
  } catch (error) {
    Alert.alert('Error', 'Failed to update current order');
    throw error;
  }
}

// Order History Management

// Subscribe to realtime updates of order history
export function subscribeToOrderHistory(onUpdate: any, onError: any) {
  const currentOrdersCollection = collection(db, 'orderHistory');

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
