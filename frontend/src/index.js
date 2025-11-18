import React from 'react';
import { createRoot } from 'react-dom/client';
import AppRoot from './App';
import './index.css';


const root = createRoot(document.getElementById('root'));
root.render(<AppRoot />);