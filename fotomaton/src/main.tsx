import { createRoot } from 'react-dom/client'

import Application from './application/components/application'

import "./application/assets/styles/index.css"

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<Application />);
