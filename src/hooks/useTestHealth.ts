import { useState, useEffect } from 'react';

export interface TestHealthPoint {
  date: string;
  total: number;
  passing: number;
}

export function useTestHealth() {
  const [data, setData] = useState<TestHealthPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for now - later connect to GitHub Actions API or Supabase
    const mockData: TestHealthPoint[] = [
      { date: 'Feb 5', total: 450, passing: 448 },
      { date: 'Feb 6', total: 455, passing: 455 },
      { date: 'Feb 7', total: 460, passing: 458 },
      { date: 'Feb 8', total: 465, passing: 465 },
      { date: 'Feb 9', total: 467, passing: 467 },
      { date: 'Feb 10', total: 469, passing: 469 },
      { date: 'Feb 11', total: 469, passing: 469 },
    ];
    
    // Simulate async fetch
    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 300);
  }, []);

  const current = data[data.length - 1];
  const allPassing = current ? current.passing === current.total : false;

  return { data, loading, current, allPassing };
}
