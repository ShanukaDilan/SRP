import useSWR from 'swr';
import { me } from './api';

export function useUser(initialUser = null) {
  const { data, error, isLoading, mutate } = useSWR('me', me, {
    fallbackData: initialUser,
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  return {
    user: data || null,
    loading: isLoading,
    error: error || null,
    refresh: mutate,
  };
}

