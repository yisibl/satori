import { it, describe, expect } from 'vitest'

import { initFonts, toImage } from './utils'
import satori from '../src'

describe('Emojis', () => {
  let fonts
  initFonts((f) => (fonts = f))

  it('should detect emojis correctly', async () => {
    const emojis = []
    await satori(<div>⛷👨‍👩‍👧❤️‍🔥🏳️‍🌈㊗️🛠👶🏾</div>, {
      width: 100,
      height: 100,
      fonts,
      loadAdditionalAsset: async (languageCode, segment) => {
        if (languageCode === 'emoji') {
          emojis.push(segment)
        }
        return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwADBwIAMCbHYQAAAABJRU5ErkJggg=='
      },
    })
    expect(emojis).toMatchInlineSnapshot(`
      [
        "⛷",
        "👨‍👩‍👧",
        "❤️‍🔥",
        "🏳️‍🌈",
        "㊗️",
        "🛠",
        "👶🏾",
      ]
    `)
  })

  // https://github.com/vercel/satori/issues/302
  it('should render emojis correctly', async () => {
    const svg = await satori(<div>Hello🦺</div>, {
      width: 100,
      height: 100,
      fonts,
      graphemeImages: {
        '🦺': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwADBwIAMCbHYQAAAABJRU5ErkJggg==',
      },
    })

    expect(await toImage(svg)).toMatchImageSnapshot()
  })
})
