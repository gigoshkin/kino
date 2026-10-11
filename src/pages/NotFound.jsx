import { Link } from 'react-router-dom';
import Button from '../components/Button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-3 px-12.75 py-20">
      <h1 className="text-h1 font-extrabold">Page not found</h1>
      <p className="text-body-m text-muted">The page you are looking for does not exist.</p>
      <Button as={Link} to="/" variant="transparent">
        Back to home
      </Button>
    </div>
  );
}
