import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import App from './App.jsx'

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000', 
    },
    secondary: {
      main: '#F5F5F5', 
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <ThemeProvider theme={theme}>
    
      <App />
  </ThemeProvider>
  </StrictMode>,
)
