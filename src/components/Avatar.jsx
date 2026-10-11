function getInitials(user) {
  const words = (user.fullName || user.username).trim().split(/\s+/);
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : '';

  return (first + last).toUpperCase();
}

export default function Avatar({ user, className = 'size-10' }) {
  return (
    <span
      className={`relative flex shrink-0 items-center justify-center rounded-lg bg-card text-label-s font-semibold ${className}`}
    >
      {user.avatar ? (
        <img src={user.avatar} alt="" className="size-full rounded-lg object-cover" />
      ) : (
        getInitials(user)
      )}
      <span
        className={`absolute bottom-0 right-0 size-2 rounded-full ring-1 ring-page ${
          user.profileComplete ? 'bg-green' : 'bg-orange'
        }`}
      />
    </span>
  );
}
