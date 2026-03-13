import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Constitution of the Cayman Islands - Interactive Edition';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #003DA5 0%, #001d52 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'serif',
          position: 'relative',
        }}
      >
        {/* Accent stripe */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '50%',
            height: '100%',
            background: 'rgba(255, 255, 255, 0.08)',
            display: 'flex',
          }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: 28,
              color: 'rgba(255, 255, 255, 0.8)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: 20,
              display: 'flex',
            }}
          >
            Constitution.ky
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: 'white',
              textAlign: 'center',
              lineHeight: 1.2,
              marginBottom: 20,
              display: 'flex',
            }}
          >
            Constitution of the Cayman Islands
          </div>
          <div
            style={{
              width: 80,
              height: 4,
              background: 'white',
              marginBottom: 20,
              display: 'flex',
            }}
          />
          <div
            style={{
              fontSize: 24,
              color: 'rgba(255, 255, 255, 0.9)',
              textAlign: 'center',
              display: 'flex',
            }}
          >
            Interactive Digital Edition
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
