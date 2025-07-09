import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  subscribeToDailySales,
  subscribeToMonthlySales,
  subscribeToTotalSales,
  sortSales,
} from '../DataManagement/DataManager';
import {
  setDailySales,
  setMonthlySales,
  setTotalSales,
} from '../Redux/SalesSlice';

export const SalesDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribeDaily = subscribeToDailySales(
      (sales: Sales[]) => dispatch(setDailySales(sortSales(sales))),
      (error: any) => console.error(error),
    );

    const unsubscribeMonthly = subscribeToMonthlySales(
      (sales: Sales[]) => dispatch(setMonthlySales(sortSales(sales))),
      (error: any) => console.error(error),
    );

    const unsubscribeTotal = subscribeToTotalSales(
      (sale: Sales) => dispatch(setTotalSales(sale)),
      (error: any) => console.error(error),
    );

    return () => {
      unsubscribeDaily();
      unsubscribeMonthly();
      unsubscribeTotal();
    };
  }, [dispatch]);

  return children;
};
