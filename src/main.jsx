import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { FilterProvider } from './context/FilterContext'
import { LocaleProvider } from './context/LocaleContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* LocaleProvider (language/currency) wraps everything; FilterProvider
          sits above the router so filters persist across routes. */}
      <LocaleProvider>
        <FilterProvider>
          <App />
        </FilterProvider>
      </LocaleProvider>
    </BrowserRouter>
  </React.StrictMode>
)
