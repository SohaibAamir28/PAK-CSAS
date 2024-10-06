import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: './index.html',
                learn_page: './learn-page.html',
            }
        }
    }
})