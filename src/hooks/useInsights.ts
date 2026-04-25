import { useState, useEffect, useCallback } from 'react';
import * as db from '../db/database';
import { InsightData } from '../types';

export const useInsights = () => {
  const [insights, setInsights] = useState<InsightData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchInsights = useCallback(async () => {
    setLoading(true);
    try {
      const data = await db.getInsightData(7); // Last 7 days
      setInsights(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  return { insights, loading, fetchInsights };
};
