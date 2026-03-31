import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-6">
      <p className="text-6xl mb-4">🔍</p>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
      <p className="text-gray-500 mb-6">This page doesn&apos;t exist or has been removed.</p>
      <Link href="/feed" className="text-indigo-600 font-semibold hover:underline">
        Go to feed →
      </Link>
    </div>
  );
}
