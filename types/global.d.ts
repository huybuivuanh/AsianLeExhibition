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
    items: OrderItem[];
    total: number;
    numberOfItems: number;
    created?: string;
  };
}
