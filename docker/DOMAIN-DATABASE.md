# 🌐 Domain Database Setup Guide

This Docker setup connects to your **existing domain database** instead of running a local MySQL container.

## ⚡ Quick Setup

### 1. Configure Database Connection
```bash
# Copy the environment template
cp .env.example .env

# Edit with your actual domain database credentials
nano .env
```

### 2. Required Environment Variables
```bash
# Your DreamHost MySQL database details
DB_HOST=mysql.alldayeverydayrecords.com
DB_NAME=alldayeveryday_records  
DB_USER=your_actual_db_username
DB_PASS=your_actual_db_password
DB_PORT=3306
```

### 3. Start Development Environment
```bash
# Start containers (no local database)
docker\start-dev.bat

# Your app will connect to the domain database
```

## 🎯 **Benefits**

✅ **Real Data**: Work with your actual production data  
✅ **No Data Sync**: Changes reflect immediately on your domain  
✅ **Lighter Setup**: No local MySQL container needed  
✅ **CORS Fixed**: Docker still solves the caching/CORS issues  

## 🔧 **Services Running**

- **Frontend**: http://localhost:5173 (React + Vite with hot reload)
- **Backend**: http://localhost:8080/api (PHP with proper CORS headers)
- **phpMyAdmin**: http://localhost:8081 (connected to your domain database)

## 🛡️ **Database Access**

Your Docker containers connect to your domain database using:
- **Host**: `mysql.alldayeverydayrecords.com` (or your actual host)
- **Database**: Your existing database name
- **Credentials**: Your DreamHost MySQL username/password

## 🚨 **Important Notes**

1. **Network Access**: Make sure your domain database allows connections from your IP
2. **Credentials**: Use your actual DreamHost database credentials in `.env`
3. **SSL**: Some hosts require SSL connections (add `?ssl=true` to connection if needed)

## 🔍 **Testing Connection**

```bash
# View backend logs to check database connection
docker-compose logs backend

# If you see connection errors, verify your .env credentials
```

## 🎉 **Result**

Your original CORS issue is now **completely bypassed**:
- Docker backend has proper CORS headers configured
- No server-side caching interference  
- React 19 cache-busting headers work perfectly
- Direct connection to your real database

**Your homepage videos should now load correctly!** 🚀