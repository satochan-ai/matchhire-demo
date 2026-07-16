import Link from "next/link";

interface NotFoundStateProps {
  title: string;
  message: string;
  backHref: string;
  backLabel: string;
}

export function NotFoundState({ title, message, backHref, backLabel }: NotFoundStateProps) {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-lg font-bold text-gray-900">{title}</h1>
          <p className="mt-2 text-sm text-gray-500">{message}</p>
          <Link
            href={backHref}
            className="mt-6 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
          >
            {backLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
