import { useSelector } from 'react-redux';
import { RootState } from './store';

export const useMenu = () => {
  return useSelector((state: RootState) => state.menu);
};

export const useOrder = () => {
  return useSelector((state: RootState) => state.order);
};

export const useLiveOrders = () => {
  return useSelector((state: RootState) => state.liveOrders);
};

export const useOrderHistory = () => {
  return useSelector((state: RootState) => state.orderHistory);
};

export const useSales = () => {
  return useSelector((state: RootState) => state.sales);
};
