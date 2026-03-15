import Link from 'next/link';
import { Metadata } from 'next';
import { glossary } from '@/data/glossary';
import PageEntrance from '@/components/PageEntrance';

export const metadata: Metadata = {
  title: 'Constitutional Glossary | Cayman Islands Constitution Terms & Definitions',
  description: 'Definitions of key legal and constitutional terms used in the Cayman Islands Constitution Order 2009. Understand terms like Grand Court, Cabinet, Premier, Bill of Rights, and more.',
  alternates: { canonical: 'https://constitution.ky/glossary' },
};

export default function GlossaryIndex() {
  // Group terms alphabetically
  const grouped = glossary.reduce<Record<string, typeof glossary>>((acc, term) => {
    const letter = term.term[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(term);
    return acc;
  }, {});

  const letters = Object.keys(grouped).sort();

  return (
    <PageEntrance>
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-4">
        Constitutional Glossary
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
        Key terms and definitions from the Constitution of the Cayman Islands Order 2009.
      </p>

      {/* Letter navigation */}
      <nav className="flex flex-wrap gap-1.5 mb-8" aria-label="Glossary alphabet">
        {letters.map((letter) => (
          <a
            key={letter}
            href={`#letter-${letter}`}
            className="w-8 h-8 flex items-center justify-center rounded text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-DEFAULT hover:text-white transition-colors"
          >
            {letter}
          </a>
        ))}
      </nav>

      {/* Terms */}
      <div className="space-y-10">
        {letters.map((letter) => (
          <div key={letter} id={`letter-${letter}`}>
            <h2 className="text-2xl font-bold text-primary-DEFAULT dark:text-primary-400 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
              {letter}
            </h2>
            <div className="space-y-4">
              {grouped[letter].map((term) => (
                <div key={term.slug}>
                  <Link
                    href={`/glossary/${term.slug}`}
                    className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-primary-DEFAULT dark:hover:text-primary-400 transition-colors"
                  >
                    {term.term}
                  </Link>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {term.definition}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
    </PageEntrance>
  );
}
