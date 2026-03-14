import { ImageResponse } from 'next/og';

export const alt = 'Constitution of the Cayman Islands';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const romanNumerals: Record<number, string> = {
  1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V',
  6: 'VI', 7: 'VII', 8: 'VIII', 9: 'IX',
};

const chapterTitles: Record<number, string> = {
  1: 'Bill of Rights, Freedoms and Responsibilities',
  2: 'The Governor',
  3: 'The Executive',
  4: 'The Legislature',
  5: 'The Judicature',
  6: 'The Public Service',
  7: 'Finance',
  8: 'Institutions Supporting Democracy',
  9: 'Miscellaneous',
};

export default async function Image({ params }: { params: Promise<{ chapterNumber: string; articleNumber: string }> }) {
  const resolvedParams = await params;
  const chapterNum = parseInt(resolvedParams.chapterNumber, 10);
  const articleNum = parseInt(resolvedParams.articleNumber, 10);
  const chapterTitle = chapterTitles[chapterNum] || `Part ${romanNumerals[chapterNum] || chapterNum}`;

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #003DA5 0%, #001d52 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          fontFamily: 'serif',
          padding: '60px',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '40%',
            height: '100%',
            background: 'rgba(255, 255, 255, 0.06)',
            display: 'flex',
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', zIndex: 1 }}>
          <div
            style={{
              fontSize: 20,
              color: 'rgba(255, 255, 255, 0.7)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: 8,
              display: 'flex',
            }}
          >
            Constitution.ky
          </div>
          <div
            style={{
              fontSize: 18,
              color: 'rgba(255, 255, 255, 0.6)',
              marginBottom: 30,
              display: 'flex',
            }}
          >
            Part {romanNumerals[chapterNum] || chapterNum} — {chapterTitle}
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: 'white',
              lineHeight: 1.1,
              marginBottom: 16,
              display: 'flex',
            }}
          >
            Section {articleNum}
          </div>
          <div
            style={{ width: 60, height: 3, background: 'rgba(255,255,255,0.5)', display: 'flex' }}
          />
        </div>
        <div
          style={{
            fontSize: 16,
            color: 'rgba(255, 255, 255, 0.5)',
            display: 'flex',
            zIndex: 1,
          }}
        >
          Cayman Islands Constitution Order 2009
        </div>
      </div>
    ),
    { ...size }
  );
}
