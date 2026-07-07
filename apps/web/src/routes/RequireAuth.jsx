import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export function RequireAuth({ children }) {
  const location = useLocation();
  const { status } = useSelector((state) => state.auth);

  if (status === 'bootstrapping') {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center px-4 py-20 text-slate-500">
        Loading session...
      </div>
    );
  }

  if (status !== 'authenticated') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}