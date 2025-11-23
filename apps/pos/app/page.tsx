import { redirect } from 'next/navigation';
import { loadCurrentUser } from '../lib/auth';
import { DashboardHome } from '../components/DashboardHome';

export default async function DashboardPage() {
  const currentUser = await loadCurrentUser();
  if (!currentUser) {
    redirect('/login');
  }

  if (currentUser.profile?.status === 'inactive') {
    redirect('/account-disabled');
  }

  return <DashboardHome currentUser={currentUser} />;
}
