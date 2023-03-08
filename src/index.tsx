import React from 'react'
import ReactDOM from 'react-dom/client'
import { Settings } from './components/settings/Settings'
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
    <React.StrictMode>
        <Settings />
    </React.StrictMode>
)
