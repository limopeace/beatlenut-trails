# Server Troubleshooting Guide

This document provides solutions for common server issues encountered in the Beatlenuts-GR application.

## Common Issues and Solutions

### 1. Address Already in Use (EADDRINUSE)

**Problem**: When starting the server, you get an error like:
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution**:
1. Find the process using the port:
   ```bash
   lsof -i :3000
   ```

2. Kill the process:
   ```bash
   kill <PID>
   ```
   
   If that doesn't work, force kill:
   ```bash
   kill -9 <PID>
   ```

3. Verify the port is now free:
   ```bash
   lsof -i :3000
   ```

4. Start the server again:
   ```bash
   npm run dev
   ```

### 2. Cannot Set Headers After They Are Sent

**Problem**: The server crashes with an error like:
```
Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
```

**Cause**: This usually happens when the code tries to send a response more than once to the same request, or when trying to modify response headers after the response has been sent.

**Solution**:
1. Identify which middleware or route handler is causing the issue
2. For response time middleware, ensure headers are set before the response is sent:
   ```javascript
   // Correct implementation for setting response time header
   const responseTime = (req, res, next) => {
     const start = process.hrtime();
     
     // Store the original end method
     const originalEnd = res.end;
     
     // Override the end method
     res.end = function(chunk, encoding) {
       // Calculate response time
       const diff = process.hrtime(start);
       const time = diff[0] * 1e3 + diff[1] * 1e-6; // Convert to milliseconds
       
       // Set the header before calling the original end
       if (!res.headersSent) {
         res.setHeader('X-Response-Time', `${time.toFixed(2)}ms`);
       }
       
       // Call the original end method
       return originalEnd.call(this, chunk, encoding);
     };
     
     next();
   };
   ```

3. For route handlers, ensure you're not calling `res.send()`, `res.json()`, or `res.end()` more than once for a single request

### 3. Mongoose Warning: Duplicate Schema Index

**Problem**: When starting the server, you see a warning like:
```
[MONGOOSE] Warning: Duplicate schema index on {"orderNumber":1} found
```

**Solution**:
1. Locate the schema definition with the duplicate index
2. Remove one of the duplicate index definitions:
   - Either remove `index: true` from the field definition
   - Or remove the duplicate `schema.index()` call

## Troubleshooting Steps

1. **Check logs**: Look for error messages in the console
2. **Examine middleware**: Incorrect middleware can cause many issues
3. **Check for port conflicts**: Ensure no other process is using the same port
4. **Review recent changes**: Code that was recently changed is often the source of new problems
5. **Restart development environment**: Sometimes a clean restart resolves issues

## Preventive Measures

1. **Proper error handling**: Use try/catch blocks with async/await and pass errors to Express error middleware
2. **Middleware order**: Pay attention to the order in which middleware is applied
3. **Monitor memory usage**: Watch for memory leaks that can crash the server
4. **Validate inputs**: Ensure proper validation of all user inputs
5. **Linting and code reviews**: Use ESLint and code reviews to catch potential issues early