import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analytics Dashboard | Constitution of the Cayman Islands',
  description: 'Real-time analytics and insights into how the Constitution of the Cayman Islands is being accessed and explored by users.',
  alternates: {
    canonical: 'https://constitution.ky/analytics',
  },
};

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
