'use server';

import { loadCurrentUser } from '../lib/auth';
import { createAdminClient } from '../lib/supabaseAdmin';

async function fetchRoleName(roleId: number | null) {
  if (!roleId) return null;
  const admin = createAdminClient();
  const { data } = await admin.from('roles').select('name').eq('id', roleId).maybeSingle();
  return data?.name ?? null;
}

export async function AdminHeaderProfile() {
  const session = await loadCurrentUser();
  const profile = session?.profile;
  if (!profile) return null;
  const roleLabel = (await fetchRoleName(profile.role_primary)) ?? `Primary role #${profile.role_primary ?? 'N/A'}`;

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
