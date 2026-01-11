import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.scss';

createRoot(
  document.getElementById('root')!,
  import.meta.env.DEV
    ? // Vite will eliminate this section along with react/debug import.
      {
        testMode: true,
        transformSource: (source) => ({
          ...source,
          fileName: source.fileName.replace(/^.+\/src/, location.origin),
        }),
      }
    : undefined,
).render(<App />);
