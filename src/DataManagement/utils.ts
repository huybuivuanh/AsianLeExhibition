import { TimeFormat } from '../types/enum';
import { DateTime } from 'luxon';

export const formattedDate = (isoString: string, timeFormat: TimeFormat) => {
  const date = DateTime.fromISO(isoString, { zone: 'utc' }).setZone(
    'America/Regina',
  );
  if (timeFormat === TimeFormat.OnlyTime) return date.toFormat('HH:mm');
  if (timeFormat === TimeFormat.OnlyDate) return date.toFormat('yyyy/MM/dd');
  if (timeFormat === TimeFormat.OnlyMonth) return date.toFormat('yyyy/MM');
  return date.toFormat('yyyy/MM/dd HH:mm');
};

export const sortOrders = (orders: Order[]) => {
  return [...orders].sort((a, b) => {
    const dateA = DateTime.fromISO(a.created || '').toMillis();
    const dateB = DateTime.fromISO(b.created || '').toMillis();
    return dateB - dateA;
  });
};

export const sortSales = (sales: Sales[]) => {
  return [...sales].sort((a, b) => {
    const dateA = DateTime.fromISO(a.created || '').toMillis();
    const dateB = DateTime.fromISO(b.created || '').toMillis();
    return dateB - dateA;
  });
};
