import { defineConfig } from 'astro/config'
import vercel from '@astrojs/vercel/edge'
import unocss from 'unocss/astro'
import { presetUno } from 'unocss'
import presetAttributify from '@unocss/preset-attributify'
import presetTypography from '@unocss/preset-typography'
import solidJs from '@astrojs/solid-js'
import tailwindcss from 'tailwindcss'
import postcss from 'postcss'
import autoprefixer from 'autoprefixer'
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  integrations: [
    unocss({
      presets: [
        presetAttributify(),
        presetUno(),
        presetTypography(),
      ]
    }),
    solidJs()
  ],
  stylesheets: [
    {
      async transform(css) {
        return (await postcss([tailwindcss, autoprefixer]).process(css, { from: undefined })).css
      }
    }
  ],
  output: 'server',
  adapter: vercel()
});