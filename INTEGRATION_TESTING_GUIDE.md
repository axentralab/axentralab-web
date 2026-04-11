# Backend-Frontend Integration Testing Guide

## 🚀 Quick Start

### Prerequisites
- Backend running on `http://localhost:5000`
- Frontend running on `http://localhost:3000`
- MongoDB connected
- Environment variables configured

---

## 📝 Test Scenarios

### 1. Authentication Flow ✅
```bash
# Register
POST http://localhost:5000/api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "company": "ACME Corp"
}

# Login
POST http://localhost:5000/api/auth/login
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
# Response includes token

# Get Current User
GET http://localhost:5000/api/auth/me
Authorization: Bearer <token>

# Update Profile
PUT http://localhost:5000/api/auth/profile
Authorization: Bearer <token>
{
  "name": "John Smith",
  "company": "New Corp"
}

# Change Password
POST http://localhost:5000/api/auth/change-password
Authorization: Bearer <token>
{
  "currentPassword": "SecurePass123",
  "newPassword": "NewPass456"
}
```

### 2. Orders Management ✅
```bash
# Create Order
POST http://localhost:5000/api/orders
Authorization: Bearer <user_token>
{
  "items": [
    { "serviceId": "60d5ec49c1234567890abcde", "quantity": 1, "price": 99.99 }
  ],
  "total": 99.99
}

# Get My Orders
GET http://localhost:5000/api/orders/my-orders
Authorization: Bearer <user_token>

# Get Specific Order
GET http://localhost:5000/api/orders/<order_id>
Authorization: Bearer <user_token>

# Admin: Get All Orders
GET http://localhost:5000/api/orders
Authorization: Bearer <admin_token>

# Admin: Update Order Status
PUT http://localhost:5000/api/orders/<order_id>/status
Authorization: Bearer <admin_token>
{
  "status": "completed"
}
```

### 3. Services Management ✅
```bash
# Get All Services
GET http://localhost:5000/api/services

# Get Service by Slug
GET http://localhost:5000/api/services/web-design

# Get Service by MongoDB ID
GET http://localhost:5000/api/services/60d5ec49c1234567890abcde

# Create Service (Admin)
POST http://localhost:5000/api/services
Authorization: Bearer <admin_token>
{
  "title": "UI/UX Design",
  "slug": "ui-ux-design",
  "category": "design",
  "description": "Professional UI/UX design services",
  "features": ["Wireframing", "Prototyping"],
  "plans": [{ "name": "Basic", "price": 299 }]
}

# Update Service (Admin)
PUT http://localhost:5000/api/services/<service_id>
Authorization: Bearer <admin_token>
{ "title": "Updated Title" }

# Delete Service (Admin)
DELETE http://localhost:5000/api/services/<service_id>
Authorization: Bearer <admin_token>
```

### 4. Payment Processing ✅
```bash
# Create Checkout Session
POST http://localhost:5000/api/payments/checkout
Authorization: Bearer <user_token>
{
  "items": [{ "serviceTitle": "Web Dev", "plan": "Pro", "price": 499, "quantity": 1 }],
  "orderId": "<order_id>"
}

# Create Payment Intent
POST http://localhost:5000/api/payments/intent
Authorization: Bearer <user_token>
{ "amount": 99.99 }

# Confirm Payment
POST http://localhost:5000/api/payments/confirm
Authorization: Bearer <user_token>
{ "sessionId": "cs_test_xxx" }

# Get Payment History
GET http://localhost:5000/api/payments/history
Authorization: Bearer <user_token>

# Refund Payment (Admin)
POST http://localhost:5000/api/payments/<payment_intent_id>/refund
Authorization: Bearer <admin_token>
```

### 5. Lead Management ✅
```bash
# Create Lead (Public)
POST http://localhost:5000/api/leads
{
  "name": "Jane Smith",
  "email": "jane@company.com",
  "company": "Tech Company",
  "service": "Web Development",
  "budget": 5000,
  "message": "We need a new website"
}

# Get All Leads (Admin)
GET http://localhost:5000/api/leads
Authorization: Bearer <admin_token>

# Get Specific Lead (Admin)
GET http://localhost:5000/api/leads/<lead_id>
Authorization: Bearer <admin_token>

# Update Lead (Admin)
PUT http://localhost:5000/api/leads/<lead_id>
Authorization: Bearer <admin_token>
{ "status": "qualified", "priority": "high" }

# Generate Proposal (Admin)
POST http://localhost:5000/api/leads/<lead_id>/auto-proposal
Authorization: Bearer <admin_token>

# Send Proposal (Admin)
POST http://localhost:5000/api/leads/<lead_id>/send-proposal
Authorization: Bearer <admin_token>

# Send Follow-up (Admin)
POST http://localhost:5000/api/leads/<lead_id>/send-followup
Authorization: Bearer <admin_token>

# Get High Priority Leads (Admin)
GET http://localhost:5000/api/leads/admin/high-priority
Authorization: Bearer <admin_token>

# Get Analytics (Admin)
GET http://localhost:5000/api/leads/admin/analytics
Authorization: Bearer <admin_token>
```

### 6. Quotes Management ✅
```bash
# Calculate Quote (Public)
POST http://localhost:5000/api/quotes
{
  "serviceType": "web-design",
  "scope": "full-website",
  "timeline": "3-months"
}

# Get Quote
GET http://localhost:5000/api/quotes/<quote_id>

# List All Quotes (Admin)
GET http://localhost:5000/api/quotes
Authorization: Bearer <admin_token>

# Convert to Lead (Admin)
POST http://localhost:5000/api/quotes/<quote_id>/convert
Authorization: Bearer <admin_token>

# Get Analytics (Admin)
GET http://localhost:5000/api/quotes/admin/analytics
Authorization: Bearer <admin_token>
```

### 7. Newsletter ✅
```bash
# Subscribe
POST http://localhost:5000/api/newsletter/subscribe
{ "email": "user@example.com" }

# Unsubscribe
POST http://localhost:5000/api/newsletter/unsubscribe
{ "email": "user@example.com" }

# Get Subscribers (Admin)
GET http://localhost:5000/api/newsletter
Authorization: Bearer <admin_token>

# Send Newsletter (Admin)
POST http://localhost:5000/api/newsletter/send
Authorization: Bearer <admin_token>
{ "subject": "Monthly Update", "content": "..." }

# Update Preferences
PUT http://localhost:5000/api/newsletter/user@example.com/preferences
{ "frequency": "weekly", "categories": ["news", "deals"] }
```

### 8. Chatbot ✅
```bash
# Send Message
POST http://localhost:5000/api/chatbot/message
{ "sessionId": "abc123", "message": "Hello, I need help" }

# Get Chat History
GET http://localhost:5000/api/chatbot/history/abc123

# Rate Response
POST http://localhost:5000/api/chatbot/abc123/rate
{ "rating": 5 }

# Convert to Lead
POST http://localhost:5000/api/chatbot/convert/abc123
{ "email": "user@example.com", "name": "John" }
```

---

## ✅ Integration Verification Checklist

### Backend Routes
- [x] All routes defined correctly
- [x] All middleware properly configured
- [x] All endpoints match frontend expectations
- [x] CORS enabled for frontend origin
- [x] Rate limiting configured
- [x] Error handling in place

### Frontend Services
- [x] API base URL configured
- [x] JWT interceptor working
- [x] Error handling functional
- [x] All service methods calling correct endpoints
- [x] Token storage and retrieval working
- [x] Logout clearing token

### Data Flow
- [x] Request headers include Authorization token
- [x] Responses include proper status codes
- [x] Error messages are descriptive
- [x] Data serialization/deserialization working
- [x] Pagination working (if applicable)
- [x] Filtering and sorting working

---

## 🔍 Troubleshooting

### Issue: 404 Not Found
**Solution:** Verify endpoint matches exactly:
- Check for trailing slashes
- Verify HTTP method (GET, POST, PUT, etc.)
- Check parameter names
- Ensure base URL is correct

### Issue: 401 Unauthorized
**Solution:** Check authentication:
- Verify token is in localStorage
- Check token format: `Bearer <token>`
- Verify Authorization header present
- Check if route requires admin role

### Issue: CORS Error
**Solution:** Check CORS configuration:
- Verify `CLIENT_URL` in backend `.env`
- Check if credentials are needed
- Verify request origin matches allowed origin

### Issue: Timeout
**Solution:** Check server status:
- Verify backend is running on port 5000
- Check network connectivity
- Verify firewall isn't blocking

---

## 📊 Expected Response Formats

### Success Response (2xx)
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response (4xx/5xx)
```json
{
  "success": false,
  "message": "Error description",
  "details": "Additional context"
}
```

---

## 🎯 Summary

All endpoints are now properly integrated:
✅ Authentication working
✅ Orders management functional
✅ Services/Products operational
✅ Payment processing ready
✅ Leads management integrated
✅ Supporting features active

Frontend and backend are now fully synchronized and ready for production use.

