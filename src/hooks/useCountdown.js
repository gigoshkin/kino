import { useEffect, useState } from 'react';

export default function useCountdown(expiresAt) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!expiresAt) return undefined;

    const timer = setInterval(() => setNow(Date.now()), 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  if (!expiresAt) return null;

  return Math.max(0, Math.ceil((new Date(expiresAt).getTime() - now) / 1000));
}
