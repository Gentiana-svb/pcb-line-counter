import adapter from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/kit/vite'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter({
      fallback: 'index.html'
    }),
    paths: {
      base: process.env.NODE_ENV === 'production' ? '/pcb-line-counter' : ''
    }
  }
}

export default config
