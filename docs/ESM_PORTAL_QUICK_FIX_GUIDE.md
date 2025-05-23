# ESM Portal Quick Fix Guide

## 🚀 Immediate Actions (Do First!)

### 1. Restart Services
```bash
# Kill all existing services
pm2 kill

# Start backend
cd /Users/kashishkumar/Documents/G_drive/beatlenuts-gr
npm run dev

# Start frontend (new terminal)
cd frontend
npm run dev
```

### 2. Quick API Connection Fix
```bash
# Create .env file in frontend
cd frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:4000/api" > .env.local
```

### 3. Test Connection
```bash
# Test API endpoint
curl http://localhost:4000/api/esm/products

# If fails, check MongoDB
mongosh
> use beatlenuts-gr
> db.esmproducts.find()
```

## 🔧 Common Issues & Solutions

### API Not Working
```javascript
// Quick fix in frontend/src/app/esm-portal/products/page.tsx
useEffect(() => {
  // Temporary mock data if API fails
  if (!products.length) {
    setProducts(mockProducts);
  }
}, []);
```

### Missing ESM Service Model
```bash
# Already fixed! File exists at:
# /src/models/mongoose/esmServiceModel.js
```

### Login Form Not Working
```javascript
// Quick fix - check console for errors
console.log('Login attempt:', formData);
// Check network tab for API response
```

### Search Not Working
- Already implemented in products page
- Check if state is updating: Add console.log in handleSearch

## 📋 Testing Checklist

### After Each Fix
1. [ ] Restart the service
2. [ ] Clear browser cache
3. [ ] Check console for errors
4. [ ] Run specific test

### Quick Test Commands
```bash
# Visual test only
node tests/esm-portal-quick-test.js

# Just API tests
curl http://localhost:4000/api/esm/products
curl http://localhost:4000/api/esm/services

# Full test suite
node tests/esm-portal-comprehensive-test.js
```

## 🎯 Priority Order

### Day 1 (Monday)
1. **Morning**
   - Fix API connection (2 hrs)
   - Test with real data (1 hr)
   
2. **Afternoon**
   - Add loading states (2 hrs)
   - Implement error handling (2 hrs)

### Day 2 (Tuesday)
1. **Morning**
   - Form validation (3 hrs)
   
2. **Afternoon**  
   - Auth flow completion (3 hrs)

### Day 3 (Wednesday)
1. **Morning**
   - Update tests (2 hrs)
   - Performance optimization (2 hrs)
   
2. **Afternoon**
   - Security review (2 hrs)
   - Documentation (1 hr)

## 💡 Quick Wins

### 1. Add Loading Spinner
```typescript
// In any component
{loading && <div className="spinner">Loading...</div>}
```

### 2. Add Error Message
```typescript
{error && <div className="error">{error.message}</div>}
```

### 3. Add Success Toast
```typescript
{success && <div className="success">Operation successful!</div>}
```

## 🐛 Debug Commands

### Check Services
```bash
# See what's running
ps aux | grep node
lsof -i :3000
lsof -i :4000

# Check logs
pm2 logs
```

### Database Issues
```bash
# Check MongoDB
brew services list | grep mongodb
brew services restart mongodb-community

# Check collections
mongosh
> use beatlenuts-gr
> show collections
```

### Frontend Issues
```bash
# Clear Next.js cache
rm -rf .next
npm run dev

# Check for type errors
npm run type-check
```

## 🔑 Environment Variables

### Backend (.env)
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/beatlenuts-gr
JWT_SECRET=your-secret-key
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 📞 Contact for Help

### When Stuck
1. Check error logs first
2. Try the quick fix guide
3. Check documentation
4. Ask team lead

### Useful Resources
- [Next.js Docs](https://nextjs.org/docs)
- [Express Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- Project Docs: `/docs` folder

## ✅ Definition of Done

### For Each Issue
- [ ] Code written
- [ ] Error handling added
- [ ] Loading state implemented
- [ ] Tested locally
- [ ] Test passes
- [ ] Documentation updated

### Before Moving On
- [ ] All console errors resolved
- [ ] API calls working
- [ ] UI responsive
- [ ] No TypeScript errors
- [ ] Commit message clear

---

*Quick Fix Guide v1.0*
*Last Updated: May 19, 2025*