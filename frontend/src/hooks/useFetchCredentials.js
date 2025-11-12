import { useState, useEffect, useCallback } from 'react';
import api from '../config/api';

export const useFetchCredentials = () => {
  const [credentials, setCredentials] = useState([]);
  const [allCredentials, setAllCredentials] = useState([]); // For stats/charts - all credentials without pagination
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1,
  });
  const [filters, setFilters] = useState({
    name: '',
    type: '',
  });

  // Fetch all credentials for stats/charts (no pagination)
  const fetchAllCredentials = useCallback(async () => {
    try {
      const params = { per_page: 1000 }; // Large number to get all
      if (filters.name) params.name = filters.name;
      if (filters.type) params.type = filters.type;

      const response = await api.get('/credentials', { params });
      setAllCredentials(response.data.data || []);
    } catch (err) {
      console.error('Error fetching all credentials:', err);
    }
  }, [filters.name, filters.type]);

  // Fetch paginated credentials for table
  const fetchCredentials = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = { page, per_page: perPage };
      if (filters.name) params.name = filters.name;
      if (filters.type) params.type = filters.type;

      const response = await api.get('/credentials', { params });
      setCredentials(response.data.data || []);
      if (response.data.meta) {
        setPagination(response.data.meta);
      } else {
        setPagination((prev) => ({ ...prev, total: response.data.data?.length || 0, last_page: 1 }));
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch credentials');
      console.error('Error fetching credentials:', err);
    } finally {
      setLoading(false);
    }
  }, [filters.name, filters.type, page, perPage]);

  useEffect(() => {
    fetchCredentials();
    fetchAllCredentials(); // Also fetch all credentials for stats
  }, [fetchCredentials, fetchAllCredentials]);

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1); // reset to first page on filter change
  };

  const refresh = () => {
    fetchCredentials();
    fetchAllCredentials(); // Refresh both paginated and all credentials
  };

  return {
    credentials, // Paginated credentials for table
    allCredentials, // All credentials for stats/charts
    loading,
    error,
    filters,
    updateFilters,
    refresh,
    page,
    perPage,
    setPage,
    setPerPage,
    pagination,
  };
};

