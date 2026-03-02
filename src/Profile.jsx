export default function Profile({ token, onLogout }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="mx-auto max-w-3xl rounded-2xl bg-zinc-900 p-6 shadow">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold ">Profile</h1>
          <button
            className="rounded-xl bg-white/10 px-4 py-2 hover:bg-white/15"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>

        <p className="mt-4 text-sm text-zinc-400 break-all">
          Token: <span className="text-zinc-200">{token}</span>
        </p>
      </div>
    </div>
  );
}