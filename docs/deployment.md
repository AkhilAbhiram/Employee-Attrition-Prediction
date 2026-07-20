# 🌐 Deployment Guide

This guide details the deployment of the Employee Attrition Prediction System to cloud hosting platforms.

---

## 1. Database Deployment (Supabase)

1. Sign up for a free account at [Supabase.com](https://supabase.com).
2. Create a new project.
3. Once provisioned, navigate to **Project Settings -> Database**.
4. Under **Connection string**, select **URI** and copy the Postgres connection string.
5. Replace the `[PASSWORD]` placeholder in the URI string with your project's database password.
6. Paste this URI under the `SUPABASE_DATABASE_URL` environment variable inside your production hosting configurations.

---

## 2. Backend Deployment (Render / Heroku)

1. Create a Web Service on [Render.com](https://render.com) linked to your project repository.
2. Set the following options:
   - **Root Directory**: `backend`
   - **Runtime**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app` (Make sure to add `gunicorn` to your requirements if deploying to Render, or run it through waitresses/other WSGI servers).
3. In **Environment Variables**, add:
   - `SUPABASE_DATABASE_URL` = (Your Supabase connection string URI)
   - `FLASK_ENV` = `production`

---

## 3. Frontend Deployment (Vercel / Netlify)

1. Create a new site on [Vercel.com](https://vercel.com) linked to your repository.
2. Set the following options:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. In **Environment Variables**, add:
   - `VITE_API_URL` = (The public URL of your deployed Flask backend, e.g. `https://your-backend.onrender.com`)
