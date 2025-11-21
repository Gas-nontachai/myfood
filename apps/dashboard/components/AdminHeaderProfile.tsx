import type { SessionWithAuth } from '../lib/auth';

type AdminHeaderProfileProps = {
  currentUser: SessionWithAuth | null;
  roleName: string | null;
};

export function AdminHeaderProfile({ currentUser, roleName }: AdminHeaderProfileProps) {
  const profile = currentUser?.profile;
  if (!profile) return null;

  const roleLabel = roleName ?? `Primary role #${profile.role_primary ?? 'N/A'}`;

  return (
    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
      <span className="text-xs text-slate-400">Logged in as</span>
      <p className="font-medium text-slate-900">{profile.full_name ?? profile.username}</p>
      <span
        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
          profile.status === 'inactive' ? 'bg-amber-50 text-amber-800' : 'bg-emerald-50 text-emerald-700'
        }`}
      >
        {profile.status === 'inactive' ? 'Inactive' : 'Active'}
      </span>
      <span className="text-xs text-slate-500">{roleLabel}</span>
    </div>
  );
}
