// src/redux/thunks/subscriptionThunk.js

import { APIS } from "@api/apiSheet";
import { setError, setLoading, setPlans } from "./subscription.slice";
import { getRequest } from "@api/apiService";

export const fetchSubscriptionPlans = () => async dispatch => {
  try {
    dispatch(setLoading(true));
    const response = await getRequest(APIS.GET_SUBSCRIPTION_PLAN); // Replace with your actual endpoint
    dispatch(setPlans(response?.data || []));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message || 'Failed to fetch plans'));
    dispatch(setLoading(false));
  }
};
