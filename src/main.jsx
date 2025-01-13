import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './Redux/store.js'
import { BrowserRouter as Router } from 'react-router-dom'
createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <Router>
      <Provider store={store}>
        <App />
      </Provider>
    </Router>,
  // </StrictMode>,
)
