export {}; // this ensures this file is treated as a module

declare global {
  type MenuItem = {
    id?: string;
    name: string;
    price?: number;
  };

  type Order = {
    id?: string;
    itemIDs: string[];
    total: number;
  };

  type OrderState = {
    items: MenuItem[];
    total: number;
  };
}
