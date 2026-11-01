import { createRoot } from 'react-dom/client'

import Application from '@app/components/application'

import '@app/assets/styles/index.css'

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<Application />);
