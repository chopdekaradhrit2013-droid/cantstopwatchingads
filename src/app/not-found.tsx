import Link from "next/link";
export default function NotFound() {
  return (
    <div className="rounded-3xl border border-dashed border-neutral-300 bg-white px-6 py-16 text-center">
      <p className="text-sm text-neutral-500">404</p>
      <h1 className="mt-2 text-2xl font-semibold">This page could not be found</h1>
      <p className="mt-2 text-sm text-neutral-500">There are no ads on this URL. Go back home or explore published ads.</p>
      <div className="mt-6 flex justify-center gap-2">
        <Link href="/" className="rounded-full bg-neutral-900 px-4 py-2 text-sm text-white">Home</Link>
        <Link href="/explore" className="rounded-full border border-neutral-200 px-4 py-2 text-sm">Explore</Link>
      </div>
    </div>
  );
}
