import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { subscribeToLiveOrders } from '../DataManagement/DataManager';
import { sortOrders } from '../DataManagement/utils';
import { setLiveOrders } from '../Redux/LiveOrderSlice';

export const LiveOrderDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = subscribeToLiveOrders(
      (orders: Order[]) => dispatch(setLiveOrders(sortOrders(orders))),
      (error: any) => console.error(error),
    );

    return () => unsubscribe();
  }, [dispatch]);

  return children;
};
