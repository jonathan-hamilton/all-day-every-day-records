# 🚀 Development Scripts

This folder contains PowerShell scripts to manage the different development environments.

## 📁 Available Scripts

### 🖥️ **Local Development**
```powershell
# Start local development (npm run dev + production API)
.\scripts\start-local.ps1
```
- Frontend: `npm run dev` on localhost:5173
- Backend: Production API at alldayeverydayrecords.com
- Database: Production database
- **Use this once CORS issues are resolved**

### 🐳 **Container Development**  
```powershell
# Start containerized development (Docker + production DB)
.\scripts\start-container.ps1
```
- Frontend + Backend: Single Docker container on localhost:8080
- Database: Production database
- **Use this for debugging CORS issues** (now eliminated!)
- **Stop via**: Docker Desktop UI or `docker-compose down` in docker/ folder

### 🌐 **Production Deployment**
```powershell
# Build for production deployment
.\scripts\deploy-production.ps1
```
- Builds frontend for production
- Prepares backend files
- Sets up production environment configuration

## 🔧 **Environment Configuration**

Each script automatically sets up the correct `.env` configuration:

- **start-local.ps1** → copies `.env.local`
- **start-container.ps1** → copies `.env.local-container` 
- **deploy-production.ps1** → copies `.env.production`

## 🎯 **Quick Start**

1. **For CORS debugging**: `.\scripts\start-container.ps1`
2. **For normal development**: `.\scripts\start-local.ps1` (after CORS is fixed)
3. **For deployment**: `.\scripts\deploy-production.ps1`

## ⚡ **PowerShell Execution Policy**

If you get execution errors, run this once:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```