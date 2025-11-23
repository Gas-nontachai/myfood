import type { SessionWithAuth } from '../lib/auth';

type AdminHeaderProfileProps = {
  currentUser: SessionWithAuth | null;
};

export function AdminHeaderProfile({ currentUser }: AdminHeaderProfileProps) {
  const profile = currentUser?.profile;
  if (!profile) return null;


  return (
    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
      <span className="text-xs text-slate-400">Logged in as</span>
      <p className="font-medium text-slate-900">{profile.full_name ?? profile.username}</p>
    </div>
  );
}
