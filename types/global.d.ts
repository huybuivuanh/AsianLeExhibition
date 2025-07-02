export {}; // this ensures this file is treated as a module

declare global {
  type MenuItem = {
    id?: string;
    name: string;
    price?: number;
  };

  // you can add other global types/interfaces here
}
