export {}; // this ensures this file is treated as a module

declare global {
  type MenuItem = {
    id?: string;
    name: string;
    price?: number;
    created?: string;
  };

  type OrderItem = {
    id?: string;
    name: string;
    price: number;
    quantity: number;
  };

  type Order = {
    id?: string;
    orderNumber?: number;
    orderItems: OrderItem[];
    total: number;
    numberOfItems: number;
    status: OrderStatus;
    printed: boolean;
    created?: string;
  };

  type Sales = {
    id?: string;
    total: number;
    created: string;
  };
}
