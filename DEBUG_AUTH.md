# JWT Cookie Authentication - Debugging Guide

## Changes Made to Fix Authentication

### 1. Created Centralized API Client

**File:** [api.js](file:///c:/REACT/bSEARCHfront/vite-project/src/config/api.js)

Created a shared axios instance with:
- `withCredentials: true` - Ensures cookies are sent with ALL requests
- Request/Response interceptors for debugging
- Console logs showing all API requests and responses

### 2. Updated Both Services

**Files Updated:**
- [authService.js](file:///c:/REACT/bSEARCHfront/vite-project/src/apps/Auth/services/authService.js)
- [businessService.js](file:///c:/REACT/bSEARCHfront/vite-project/src/apps/HomePage/services/businessService.js)

Both now use the centralized `apiClient` instead of separate axios instances.

### 3. Improved Auth Context

**File:** [AuthContext.jsx](file:///c:/REACT/bSEARCHfront/vite-project/src/apps/Auth/context/AuthContext.jsx)

- Better response handling for different backend response formats
- Added console logging for debugging
- Handles `response.data`, `response.user`, or direct `response`

---

## How to Debug the "Authentication Required" Issue

### Step 1: Check Browser Console

Open Chrome DevTools (F12) and check the Console tab. You should see logs like:

```
[API Request] POST /user/login { withCredentials: true, params: undefined }
[API Response] /user/login { success: true, user: {...} }
[Auth] Login successful: { email: "...", role: "..." }

[API Request] GET /search { withCredentials: true, params: { area: "Delhi", type: "restaurant" } }
[API Response] /search { success: true, data: [...] }
```

### Step 2: Check Network Tab

1. Open DevTools → Network tab
2. Login to your application
3. Look for the `/user/login` request
4. Check the **Response Headers** for `Set-Cookie` header:
   ```
   Set-Cookie: jwt=YOUR_TOKEN; HttpOnly; Secure; SameSite=None
   ```

5. After login, make a search
6. Check the `/search` request
7. Check the **Request Headers** for `Cookie` header:
   ```
   Cookie: jwt=YOUR_TOKEN
   ```

### Step 3: Verify Backend CORS Configuration

Your backend needs these CORS settings:

```javascript
app.use(cors({
  origin: 'http://localhost:5174',  // Your React app URL
  credentials: true,                 // Allow credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Step 4: Verify Cookie Settings

The backend should set the JWT cookie with these attributes:

```javascript
res.cookie('jwt', token, {
  httpOnly: true,
  secure: false,           // Set to true in production with HTTPS
  sameSite: 'lax',         // or 'none' for cross-origin (requires secure: true)
  maxAge: 24 * 60 * 60 * 1000  // 24 hours
});
```

**Important:** 
- If frontend and backend are on different domains, use `sameSite: 'none'` and `secure: true`
- If on same domain (e.g., both localhost), use `sameSite: 'lax'` and `secure: false`

---

## Common Issues and Solutions

### Issue 1: Cookie Not Being Set

**Symptoms:** No cookie in browser after login

**Solutions:**
1. Check backend response includes `Set-Cookie` header
2. Verify backend CORS allows credentials
3. Check cookie domain matches request domain

### Issue 2: Cookie Not Being Sent

**Symptoms:** Cookie exists but not sent with requests

**Solutions:**
1. Verify `withCredentials: true` in axios config ✅ (Already done)
2. Check cookie `sameSite` attribute matches your setup
3. Verify cookie hasn't expired

### Issue 3: CORS Errors

**Symptoms:** CORS policy blocks requests

**Solutions:**
1. Backend must set:
   ```javascript
   Access-Control-Allow-Origin: http://localhost:5174
   Access-Control-Allow-Credentials: true
   ```
2. Don't use wildcard (`*`) origin when credentials are enabled
3. Ensure preflight OPTIONS requests are handled

### Issue 4: Different Response Formats

**Symptoms:** User data not properly set after login

**Solution:** ✅ Already handled - AuthContext now accepts:
- `response.data`
- `response.user`
- Direct `response` object

---

## Testing Steps

1. **Clear Browser Cookies**
   - DevTools → Application → Cookies → Clear all

2. **Restart Dev Server**
   ```bash
   npm run dev
   ```

3. **Login and Monitor Console**
   - Watch for `[Auth] Login successful:` log
   - Check that user object has `role` field

4. **Perform Search**
   - Enter location and type
   - Click Search
   - Watch for `[API Request] GET /search` log
   - Should show `withCredentials: true`

5. **Check Response**
   - If successful: Business cards should render
   - If error: Check console for error message

---

## Backend Checklist

Ensure your backend has:

- ✅ CORS middleware with `credentials: true`
- ✅ Cookie parser middleware
- ✅ JWT middleware that reads from cookies
- ✅ `/user/me` endpoint that returns user data
- ✅ Cookie set on login with proper attributes
- ✅ Protected routes verify JWT from cookie

Example Express.js setup:

```javascript
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// CORS - MUST be before routes
app.use(cors({
  origin: 'http://localhost:5174',
  credentials: true
}));

// Cookie parser
app.use(cookieParser());

// Your routes here...

// Login endpoint
app.post('/user/login', async (req, res) => {
  // ... verify credentials ...
  
  const token = jwt.sign({ userId: user._id }, SECRET);
  
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: false,  // true in production
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  });
  
  res.json({
    success: true,
    user: {
      email: user.email,
      name: user.name,
      role: user.role
    }
  });
});

// Auth middleware
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.jwt;
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = await User.findById(decoded.userId);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Protected routes
app.get('/search', authMiddleware, async (req, res) => {
  // ... search logic ...
});
```

---

## Quick Fix Commands

If browser cache is causing issues:

**Clear Storage:**
1. DevTools → Application → Storage → Clear site data

**Hard Reload:**
- Windows: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

**Test in Incognito:**
- Opens fresh session without cache/cookies
- Helps isolate issues

---

## Next Steps

1. Check browser console logs when you try to search
2. Share any error messages you see
3. Verify backend CORS and cookie settings
4. Check Network tab to confirm cookies are being sent

The frontend is now properly configured to send cookies with all requests. The issue is likely in the backend configuration or cookie settings.
