import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { subscribeToOrderHistory } from '../DataManagement/DataManager';
import { sortOrders } from '../DataManagement/utils';
import { setOrderHistory } from '../Redux/OrderHistorySlice';

export const OrderHistoryDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = subscribeToOrderHistory(
      (orders: Order[]) => dispatch(setOrderHistory(sortOrders(orders))),
      (error: any) => console.error(error),
    );

    return () => unsubscribe();
  }, [dispatch]);

  return children;
};
