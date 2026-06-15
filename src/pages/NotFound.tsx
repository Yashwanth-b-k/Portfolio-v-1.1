import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-7xl font-bold text-light-accent dark:text-dark-accent">404</p>
      <h1 className="mt-4 text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-light-text/60 dark:text-dark-text/60">
        The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="btn-primary mt-8">
        Back to home
      </Link>
    </main>
  );
}
