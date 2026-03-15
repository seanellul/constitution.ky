import { Metadata } from 'next';
import AnalyticsClient from './AnalyticsClient';
import PageEntrance from '@/components/PageEntrance';

export const metadata: Metadata = {
  title: 'Analytics | Constitution.ky',
  description: 'See what people are reading and searching for in the Cayman Islands Constitution. Open, transparent civic engagement data.',
};

export default function AnalyticsPage() {
  return <PageEntrance><AnalyticsClient /></PageEntrance>;
}
