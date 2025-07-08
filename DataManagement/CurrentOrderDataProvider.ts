import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { subscribeToCurrentOrders } from './DataManager';
import { setCurrentOrders } from '../Redux/CurrentOrderSlice';

export const CurrentOrderDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = subscribeToCurrentOrders(
      (orders: Order[]) => dispatch(setCurrentOrders(orders)),
      (error: any) => console.error(error),
    );

    return () => unsubscribe();
  }, [dispatch]);

  return children;
};
