import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { rapTheme, rapGlobalStyles } from './styles'
import { MainLayout } from './layouts'
import { Home, Releases, About, Contact, ReleaseDetailPage, NotFound, ApiTest } from './pages'
import './App.css'

function App() {
  return (
    <ThemeProvider theme={rapTheme}>
      <CssBaseline />
      {rapGlobalStyles}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="releases" element={<Releases />} />
            <Route path="releases/:slug" element={<ReleaseDetailPage />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="api-test" element={<ApiTest />} />
            <Route path="404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App