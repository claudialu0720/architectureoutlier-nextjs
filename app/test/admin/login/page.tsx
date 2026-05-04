import { LoginForm } from '@/components/admin/LoginForm';

export const metadata = {
  title: 'Admin Login — Architect Career Test',
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return <LoginForm nextPath={typeof next === 'string' ? next : '/test/admin'} />;
}
