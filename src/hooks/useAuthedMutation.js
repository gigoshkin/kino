import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../context/useAuth';

export default function useAuthedMutation(options) {
  const { requireAuth, runAfterLogin } = useAuth();

  const mutation = useMutation({
    ...options,
    onError: (error, variables, ...rest) => {
      if (error.status === 401) {
        runAfterLogin(() => mutation.mutate(variables));
      }

      options.onError?.(error, variables, ...rest);
    },
  });

  return { ...mutation, run: (variables) => requireAuth(() => mutation.mutate(variables)) };
}
