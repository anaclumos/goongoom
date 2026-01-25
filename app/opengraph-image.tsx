import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const alt = 'Goongoom'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const logoPromise = readFile(join(process.cwd(), 'assets/logo.png'))

export default async function Image() {
  const gradientFrom = '#E8368F'
  const gradientTo = '#F8A035'

  const logoData = await logoPromise
  const logoBase64 = `data:image/png;base64,${logoData.toString('base64')}`

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
      }}
    >
      <img alt="Goongoom" height={600} src={logoBase64} style={{ borderRadius: '60px' }} width={600} />
    </div>,
    { ...size }
  )
}
