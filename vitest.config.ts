import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    include: ['**/*.spec.tsx'],
    globals: true,
    environment: 'jsdom',
  },
});
