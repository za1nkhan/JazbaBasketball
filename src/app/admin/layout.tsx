import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminSidebar from './components/AdminSidebar';

export const metadata = {
  title: 'Admin | Jazba Basketball',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Not logged in → redirect to account page
  if (!session?.user) {
    redirect('/account');
  }

  // Not admin → show unauthorized
  if (session.user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Unauthorized</h1>
          <p className="text-gray-500 mb-6">
            You don&apos;t have permission to access the admin dashboard.
          </p>
          <a
            href="/"
            className="inline-block bg-brand-deep text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-deep/90 transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  // Authorized admin → render layout
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar
        userName={session.user.name}
        userEmail={session.user.email}
      />

      {/* Main content area — offset by sidebar width */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
