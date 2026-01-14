# URGENT: Fix Cookie SameSite Issue

## The Problem

Your backend cookie has `SameSite=None` but **no `Secure` flag**. Browsers require:
- `SameSite=None` → MUST have `Secure=true` → REQUIRES HTTPS
- Since you're on HTTP (`http://127.0.0.1:4000`), the cookie is being **rejected**

## The Fix (Backend)

Change your backend cookie configuration from:

```javascript
// ❌ CURRENT (BROKEN)
res.cookie('token', token, {
  httpOnly: true,
  sameSite: 'none',  // ← This requires Secure=true
  // No secure flag = cookie rejected!
  maxAge: 86400000,
  path: '/'
});
```

To:

```javascript
// ✅ FIXED (for localhost/HTTP)
res.cookie('token', token, {
  httpOnly: true,
  secure: false,       // ← false for HTTP
  sameSite: 'lax',     // ← Changed from 'none' to 'lax'
  maxAge: 86400000,
  path: '/'
});
```

## Why This Works

- `SameSite=Lax` allows cookies between same-site requests
- Both `localhost:5174` and `127.0.0.1:4000` are considered localhost (same-site)
- No `Secure` flag needed for HTTP

## For Production (HTTPS)

When you deploy to production with HTTPS:

```javascript
// ✅ PRODUCTION (with HTTPS)
res.cookie('token', token, {
  httpOnly: true,
  secure: true,        // ← true for HTTPS
  sameSite: 'none',    // ← 'none' for cross-origin
  maxAge: 86400000,
  path: '/'
});
```

## Test After Fixing

1. **Clear all cookies**: DevTools → Application → Cookies → Delete "token"
2. **Login again**
3. **Check cookie in DevTools**: Should see `token=...` with `SameSite=Lax`
4. **Try search again**: Cookie should be sent automatically

## Frontend is Already Fixed ✅

Your frontend has:
- `withCredentials: true` ✅
- Proper axios configuration ✅  
- Cookie debugging in console ✅

**The issue is 100% on the backend cookie settings.**
