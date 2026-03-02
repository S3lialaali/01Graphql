export default function Login({ onSuccess }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100">
      <div className="w-full max-w-sm rounded-2xl bg-zinc-900 p-6 shadow">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="mt-1 text-sm text-zinc-400">
          We’ll connect the real API next.
        </p>

        <button
          className="mt-6 w-full rounded-xl bg-white/10 px-4 py-2 hover:bg-white/15"
          onClick={() => onSuccess("FAKE_JWT")}
        >
          Fake login (temporary)
        </button>
      </div>
    </div>
  );
}