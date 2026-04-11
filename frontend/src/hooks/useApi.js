import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

/**
 * Custom hook for API data fetching with loading and error handling
 * @param {string} url - API endpoint
 * @param {Array} dependencies - Re-fetch when these change
 * @returns {Object} { data, loading, error, refetch }
 */
export function useApi(url, dependencies = []) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await api.get(url);
      setState({
        data: response.data?.data || response.data,
        loading: false,
        error: null,
      });
    } catch (err) {
      setState({
        data: null,
        loading: false,
        error: err.response?.data?.message || err.message,
      });
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  return { ...state, refetch: fetchData };
}

export default useApi;
