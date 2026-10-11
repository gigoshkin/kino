import { useAuth } from '../context/useAuth';

export default function useAgeGate(movie) {
  const { user } = useAuth();
  const minAge = movie.ageRating.minAge;
  const isBlocked = Boolean(user?.age != null && user.age < minAge);

  return {
    isBlocked,
    message: `This film is rated ${movie.ageRating.code}. You cannot buy tickets for it with this account.`,
  };
}
