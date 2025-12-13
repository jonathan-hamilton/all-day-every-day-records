import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { rapTheme, rapGlobalStyles } from './styles'
import { MainLayout } from './layouts'
import { Home, Releases, Videos, VideoDetailPage, About, Contact, ReleaseDetailPage, NotFound, Login, ApiTest } from './pages'
import AdminDashboard from './pages/AdminDashboard'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import './App.css'

function App() {
  return (
    <ThemeProvider theme={rapTheme}>
      <CssBaseline />
      {rapGlobalStyles}
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Login route outside of MainLayout */}
            <Route path="/login" element={<Login />} />
            
            {/* Main site routes with layout */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="releases" element={<Releases />} />
              <Route path="releases/:id" element={<ReleaseDetailPage />} />
              <Route path="videos" element={<Videos />} />
              <Route path="videos/:id" element={<VideoDetailPage />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              
              {/* Admin routes now inside MainLayout */}
              <Route path="admin/dashboard" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              {/* Catch-all for other admin routes */}
              <Route path="admin/*" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="api-test" element={<ApiTest />} />
              <Route path="404" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App