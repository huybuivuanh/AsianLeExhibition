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
  limit,
  query,
  orderBy,
  increment,
} from '@react-native-firebase/firestore';
import { OrderStatus, TimeFormat } from '../types/enum';

import { DateTime } from 'luxon';

const getDate = () => {
  return DateTime.fromISO(new Date().toISOString(), { zone: 'utc' }).setZone(
    'America/Regina',
  );
};

// Initialize Firestore
const db = getFirestore();

export const formattedDate = (isoString: string, timeFormat: TimeFormat) => {
  const date = DateTime.fromISO(isoString, { zone: 'utc' }).setZone(
    'America/Regina',
  );
  if (timeFormat === TimeFormat.OnlyTime) return date.toFormat('HH:mm');
  if (timeFormat === TimeFormat.OnlyDate) return date.toFormat('yyyy/MM/dd');
  if (timeFormat === TimeFormat.OnlyMonth) return date.toFormat('yyyy/MM');
  return date.toFormat('yyyy/MM/dd HH:mm');
};

export const sortOrders = (orders: Order[]) => {
  return [...orders].sort((a, b) => {
    const dateA = DateTime.fromISO(a.created || '').toMillis();
    const dateB = DateTime.fromISO(b.created || '').toMillis();
    return dateB - dateA;
  });
};

export const sortSales = (sales: Sales[]) => {
  return [...sales].sort((a, b) => {
    const dateA = DateTime.fromISO(a.created || '').toMillis();
    const dateB = DateTime.fromISO(b.created || '').toMillis();
    return dateB - dateA;
  });
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
    console.log('Success', 'Menu item added!');
  } catch (error) {
    console.log('Failed to add menu item');
    throw error;
  }
}

// Delete a menu item by its document ID
export async function deleteMenuItem(itemID: string) {
  try {
    const itemDoc = doc(db, 'menuItems', itemID);
    await deleteDoc(itemDoc);
    console.log('Success', 'Menu item deleted!');
  } catch (error) {
    console.log('Failed to delete menu item');
    throw error;
  }
}

// Update menu item
export async function updateMenuItem(item: MenuItem) {
  try {
    if (!item.id) {
      throw new Error('Menu item id is required for update.');
    }
    const menuItemDoc = doc(db, 'menuItems', item.id);

    await updateDoc(menuItemDoc, {
      name: item.name,
      price: item.price,
    });
  } catch (error) {
    console.log('Failed to update menu item');
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
export function subscribeToCurrentOrders(
  onUpdate: (orders: Order[]) => void,
  onError: (error: any) => void,
) {
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
  const currentOrdersCollectionRef = collection(db, 'currentOrders');
  const orderHistoryCollectionRef = collection(db, 'orderHistory');
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
      numberOfItems: order.numberOfItems,
      status: OrderStatus.InProgress,
      created: new Date().toISOString(),
    };

    // Save the order with the generated orderNumber
    // Generate a single Firestore doc ID
    const newOrderDocRef = doc(currentOrdersCollectionRef);
    await setDoc(newOrderDocRef, orderToBeSubmitted);

    const orderHistoryDocRef = doc(
      orderHistoryCollectionRef,
      newOrderDocRef.id,
    );
    await setDoc(orderHistoryDocRef, orderToBeSubmitted);

    // Update sales

    // Total sales
    const totalSalesDocRef = doc(db, 'sales', 'totalSales');
    await setDoc(
      totalSalesDocRef,
      { total: increment(order.total), created: new Date().toISOString() },
      { merge: true },
    );

    // Daily sales
    const today = getDate().toFormat('yyyy-MM-dd');

    const dailySalesDocRef = doc(db, 'dailySales', today);
    await setDoc(
      dailySalesDocRef,
      { total: increment(order.total), created: new Date().toISOString() },
      { merge: true },
    );

    // Monthly sales
    const month = getDate().toFormat('yyyy-MM');
    const monthlySalesDocRef = doc(db, 'monthlySales', month);
    await setDoc(
      monthlySalesDocRef,
      { total: increment(order.total), created: new Date().toISOString() },
      { merge: true },
    );

    console.log('Success', `Order #${orderNumber} added!`);
  } catch (error) {
    console.log('Failed to add current order');
    throw error;
  }
}

export async function completeOrder(orderID: string, status: OrderStatus) {
  try {
    const orderDoc = doc(db, 'currentOrders', orderID);
    const orderHistoryDoc = doc(db, 'orderHistory', orderID);

    await deleteDoc(orderDoc);

    await updateDoc(orderHistoryDoc, {
      status: status,
    });

    console.log('Success', 'Order updated successfully!');
  } catch (error) {
    console.log('Error', 'Failed to update current order');
    throw error;
  }
}

// Update order
export async function updateOrder(order: Order) {
  if (!order.id) {
    throw new Error('Order id is required for update.');
  }

  const currentOrdersDoc = doc(db, 'currentOrders', order.id);
  const orderHistoryDoc = doc(db, 'orderHistory', order.id);

  const orderData = {
    orderItems: order.orderItems,
    total: order.total,
    numberOfItems: order.numberOfItems,
  };

  try {
    await Promise.all([
      updateDoc(currentOrdersDoc, orderData),
      updateDoc(orderHistoryDoc, orderData),
    ]);
  } catch (error) {
    console.log('Failed to update order:', error);
    throw error;
  }
}

// Order History Management

// Subscribe to realtime updates of order history
export function subscribeToOrderHistory(
  onUpdate: (orders: Order[]) => void,
  onError: (error: any) => void,
) {
  const orderHistoryCollection = collection(db, 'orderHistory');

  // Query: order by createdAt descending (latest first), limit to 200 items
  const orderHistoryQuery = query(
    orderHistoryCollection,
    orderBy('created', 'desc'),
    limit(200),
  );

  const unsubscribe = onSnapshot(
    orderHistoryQuery,
    querySnapshot => {
      const orderHistory: Order[] = [];
      querySnapshot.forEach(docSnap => {
        orderHistory.push({
          ...(docSnap.data() as Order),
          id: docSnap.id,
        });
      });
      onUpdate(orderHistory);
    },
    error => {
      console.error('Realtime update error:', error);
      if (onError) onError(error);
    },
  );

  return unsubscribe;
}

// Subscribe to realtime updates daily sales
export function subscribeToDailySales(
  onUpdate: (totals: Sales[]) => void,
  onError: (error: any) => void,
) {
  const dailySalesCollection = collection(db, 'dailySales');

  const dailySalesQuery = query(
    dailySalesCollection,
    orderBy('created', 'desc'),
    limit(31),
  );

  const unsubscribe = onSnapshot(
    dailySalesQuery,
    querySnapshot => {
      const dailySales: Sales[] = [];
      querySnapshot.forEach(docSnap => {
        dailySales.push({
          ...(docSnap.data() as Sales),
          id: docSnap.id,
        });
      });
      onUpdate(dailySales);
    },
    error => {
      console.error('Realtime update error:', error);
      if (onError) onError(error);
    },
  );

  return unsubscribe;
}

// Subscribe to realtime updates monthly sales
export function subscribeToMonthlySales(
  onUpdate: (totals: Sales[]) => void,
  onError: (error: any) => void,
) {
  const monthlySalesCollection = collection(db, 'monthlySales');

  const monthlySalesQuery = query(
    monthlySalesCollection,
    orderBy('created', 'desc'),
    limit(12),
  );

  const unsubscribe = onSnapshot(
    monthlySalesQuery,
    querySnapshot => {
      const monthlySales: Sales[] = [];
      querySnapshot.forEach(docSnap => {
        monthlySales.push({
          ...(docSnap.data() as Sales),
          id: docSnap.id,
        });
      });
      onUpdate(monthlySales);
    },
    error => {
      console.error('Realtime update error:', error);
      if (onError) onError(error);
    },
  );

  return unsubscribe;
}

// Subscribe to realtime updates of total sales
export function subscribeToTotalSales(
  onUpdate: (total: Sales) => void,
  onError: (error: any) => void,
) {
  const totalSalesDocRef = doc(db, 'sales', 'totalSales');

  const unsubscribe = onSnapshot(
    totalSalesDocRef,
    docSnap => {
      if (docSnap.exists()) {
        const totalSales = {
          ...(docSnap.data() as Sales),
          id: docSnap.id,
        };
        onUpdate(totalSales);
      } else {
        console.log('No total sales document found');
        onUpdate({
          total: 0,
          id: docSnap.id,
          created: '',
        });
      }
    },
    error => {
      console.error('Realtime update error:', error);
      if (onError) onError(error);
    },
  );

  return unsubscribe;
}
