import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function useCourseProgress(courseId) {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourseProgress = async () => {
    if (!courseId) return;

    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/lesson/progress/course/${courseId}`,
        {
          credentials: 'include',
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProgress(data.data);
      } else {
        throw new Error('Failed to fetch course progress');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching course progress:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  return {
    progress,
    loading,
    error,
    refetchProgress: fetchCourseProgress,
  };
}