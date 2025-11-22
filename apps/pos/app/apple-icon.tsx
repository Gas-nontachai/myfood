import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
    width: 180,
    height: 180,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
    return new ImageResponse(
        (
            // ImageResponse JSX element
            <div
                style={{
                    fontSize: 100,
                    background: '#F97316',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    borderRadius: '36px',
                    fontWeight: 800,
                    fontFamily: 'sans-serif',
                }}
            >
                M
            </div>
        ),
        // ImageResponse options
        {
            ...size,
        }
    )
}
