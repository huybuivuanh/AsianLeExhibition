export enum OrderStatus {
  Pending = 'Pending',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Canceled = 'Canceled',
}

export enum TimeFormat {
  DateAndTime = 'DateAndTime',
  OnlyTime = 'OnlyTime',
  OnlyDate = 'OnlyDate',
  OnlyMonth = 'OnlyMonth',
}

export enum RouteName {
  Cart = 'Cart',
  AddMenuItem = 'AddMenuItem',
  EditMenuItem = 'EditMenuItem',
  EditOrder = 'EditOrder',
  AddItemToOrder = 'AddItemToOrder',
}

export enum AlertType {
  Success = 'success',
  Error = 'error',
  Info = 'info',
}
