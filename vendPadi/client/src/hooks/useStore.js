import { useState, useEffect, useCallback } from "react";
import { storeAPI } from "../api/axiosInstance";
import toast from "react-hot-toast";

export const useStore = (slug) => {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStore = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await storeAPI.getStore(slug);
      setStore(data);
    } catch {
      toast.error("Store not found");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchStore();
  }, [fetchStore]);

  return { store, loading, refetch: fetchStore };
};

export default useStore;
