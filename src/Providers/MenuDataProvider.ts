import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { subscribeToMenuItems } from '../DataManagement/DataManager';
import { setMenuItems } from '../Redux/MenuSlice';

export const MenuDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = subscribeToMenuItems(
      (items: MenuItem[]) => dispatch(setMenuItems(items)),
      (error: any) => console.error(error),
    );

    return () => unsubscribe();
  }, [dispatch]);

  return children;
};
