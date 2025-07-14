type EditMenuItemParams = {
  item: MenuItem;
};

type EditOrderParams = {
  order: Order;
};

export type RootStackParamList = {
  MainTabs: undefined;
  Cart: undefined;
  AddMenuItem: undefined;
  EditMenuItem: EditMenuItemParams;
  EditOrder: EditOrderParams;
};
