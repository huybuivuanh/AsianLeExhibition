import { useSelector } from 'react-redux';
import { RootState } from './store';

export const useMenu = () => {
  return useSelector((state: RootState) => state.menu);
};

export const useOrder = () => {
  return useSelector((state: RootState) => state.order);
};

export const useCurrentOrders = () => {
  return useSelector((state: RootState) => state.currentOrders);
};

export const useOrderHistory = () => {
  return useSelector((state: RootState) => state.orderHistory);
};

export const useSales = () => {
  return useSelector((state: RootState) => state.sales);
};
