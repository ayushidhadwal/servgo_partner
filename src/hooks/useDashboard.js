import {useEffect, useState} from 'react';
import {useError} from './useError';
import {BASE_URL} from '../constant/base_url';

export const useDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboard, setDashboard] = useState({
    salesByCity: '0',
    monthlySalesByMonthly: '0',
    pendingBooking: '0',
    acceptBooking: '0',
    numberOfBooking: '0',
    complaintRaise: '0',
  });

  const setError = useError();

  useEffect(() => {
    const getDashboardData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${BASE_URL}partner/dashboard-for-partner`);
        const data = await res.json();

        console.log(res);

        const {
          Data: {
            salesBycity,
            monthlySelesByMonthly,
            pendingBooking,
            acceptBooking,
            numberOfbooking,
            complaintRaise,
          },
        } = data;

        setDashboard({
          salesByCity: String(salesBycity),
          monthlySalesByMonthly: String(monthlySelesByMonthly),
          pendingBooking: String(pendingBooking),
          acceptBooking: String(acceptBooking),
          numberOfBooking: String(numberOfbooking),
          complaintRaise: String(complaintRaise),
        });
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    getDashboardData();
  }, [setError]);

  return {isLoading, dashboard};
};
