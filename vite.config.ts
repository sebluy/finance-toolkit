import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "#src": __dirname + "/src",
    },
  },
  plugins: [
    vue(),
  ],
})

