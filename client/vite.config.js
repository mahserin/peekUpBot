import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // server : {
  //   proxy : {

  //     '/socket' : {
  //       target : 'http://localhost:5830',
  //       changeOrigin: true,
  //       rewrite : path => {
  //         console.log('connected to ' + path)
  //         path.replace(/\/socket/ , '')
  //       }
  //     }
  //   }
  // }
})
