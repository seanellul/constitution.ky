import Link from 'next/link';
import { getChapters } from '@/lib/constitution';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Chapter } from '@/types/constitution';
import { toRomanNumeral } from '@/lib/utils';
import ConstitutionContent from './ConstitutionContent';

export const metadata = {
  title: 'Constitution of the Cayman Islands - Parts',
  description: 'Browse all parts of the Constitution of the Cayman Islands',
};

export default async function ConstitutionPage() {
  const chapters = await getChapters();

  return (
    <>
      <Breadcrumbs
        items={[
          {
            label: 'Constitution',
            href: '/constitution',
            active: true,
          },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-4xl font-bold font-serif text-primary-DEFAULT mb-2">Constitution of the Cayman Islands</h1>
        <p className="text-gray-600 text-lg">
          Explore the parts and sections of the Cayman Islands Constitution in an interactive format.
        </p>
      </div>

      <ConstitutionContent chapters={chapters} />
    </>
  );
} 