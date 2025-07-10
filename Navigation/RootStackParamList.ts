type EditMenuItemParams = {
  item: MenuItem;
};

type MainTabsParams = {};

type CartParams = {};

type AddMenuItemParams = {};

export type RootStackParamList = {
  MainTabs: MainTabsParams;
  Cart: CartParams;
  AddMenuItem: AddMenuItemParams;
  EditMenuItem: EditMenuItemParams;
};
