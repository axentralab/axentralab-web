# 🤖 Axentralab AI Automation System - Complete Implementation Guide

## ✅ What's Been Implemented

### 1. **Smart Quote Calculator** ✨
- **File**: `frontend/src/components/common/QuoteCalculator.js`
- **Features**:
  - AI-powered cost estimation
  - Project customization (pages, features, security level, timeline)
  - Real-time cost breakdown
  - Tech stack recommendations
  - Converts quotes to leads with lead scoring
- **API**: `POST /api/quotes`

### 2. **AI Proposal Generator** 📄
- **File**: `backend/utils/proposalPDFGenerator.js`
- **Features**:
  - Auto-generates professional proposals from lead data
  - Creates PDF files automatically
  - Includes cost breakdown, timeline, tech stack, security measures
  - Sends proposals via email
- **API**: `POST /api/leads/:id/auto-proposal`

### 3. **AI Chatbot Assistant** 💬
- **File**: `frontend/src/components/common/AIChatbot.js` + `backend/controllers/chatbotController.js`
- **Features**:
  - Floating chat widget on website
  - Answers service questions using OpenAI GPT
  - Collects leads from chat
  - Conversion from chat session to lead
  - User ratings/feedback system
- **API**: `POST /api/chatbot/message`, `/api/chatbot/convert/:sessionId`

### 4. **Lead Scoring System** 🎯
- **File**: `backend/utils/leadScoringService.js`
- **Features**:
  - Automatic lead prioritization (urgent, high, medium, low)
  - Scores based on: budget, company type, service interest, email quality
  - Identifies high-value leads automatically
  - Recommendation engine for follow-up actions
- **Score Factors**:
  - Budget (0-100): $10k+ = 100 points
  - Company type: Enterprise = 100, Startup = 30
  - Email quality: Business email = +15 points
  - Message quality: Detailed message = +20 points

### 5. **Automated Follow-up System** 📧
- **Features**:
  - Auto-generates personalized follow-up emails
  - Sends after 24 hours if no response
  - Follows up max 3 times
  - Tracks follow-up history
- **API**: `POST /api/leads/:id/send-followup`

### 6. **Email Automation Service** 📮
- **File**: `backend/utils/emailService.js`
- **Supports**:
  - SendGrid (primary)
  - Resend (fallback)
  - Email templates for different scenarios
  - Newsletter bulk send
- **Features**:
  - Lead confirmation emails
  - Proposal delivery
  - Follow-up emails
  - Admin notifications
  - Newsletter broadcasts

### 7. **Telegram Bot Notifications** 📱
- **File**: `backend/utils/telegramService.js`
- **Features**:
  - Real-time alerts on high-value leads
  - Proposal sent notifications
  - Lead conversion alerts
  - Daily summary reports
- **Setup**: Requires `TELEGRAM_BOT_TOKEN` and `TELEGRAM_ADMIN_CHAT_ID` in .env

### 8. **AI Automation Engine** 🔄
- **File**: `backend/utils/automationService.js`
- **Features**:
  - Scheduled job execution
  - Auto-proposal generation for high-score leads
  - Auto-follow-up emails
  - Lead scoring
  - Newsletter automation
- **Runs Every**:
  - 5 minutes: Execute scheduled jobs
  - 30 minutes: Schedule auto-proposals for high-score leads
  - 1 hour: Schedule follow-ups for qualified leads

### 9. **Newsletter/Marketing Automation** 📬
- **File**: `frontend/src/components/common/NewsletterSignup.js`
- **Features**:
  - Newsletter subscriptions with preferences
  - Bulk email sending
  - Email templates (welcome, security tips, updates)
  - Engagement tracking
  - Admin broadcast system
- **API**: `/api/newsletter/*`

### 10. **Database Models** 💾
- **Quote**: Stores quote calculations with AI estimates
- **ChatMessage**: Tracks all chatbot conversations
- **Lead**: Enhanced with AI scoring, proposals, automation history
- **Newsletter**: Subscriber management with preferences
- **AutomationJob**: Scheduled automation task tracking

---

## 🚀 Setup & Configuration

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

This installs:
- `openai` - ChatGPT & proposal generation
- `langchain` - AI chain management
- `@sendgrid/mail` - Email delivery
- `node-telegram-bot-api` - Telegram notifications
- `pdf-lib` / `pdfkit` - PDF generation
- `bull` - Job queue (ready for future use)

### Step 2: Update .env File

```bash
# AI Services (REQUIRED)
OPENAI_API_KEY=sk-your_openai_api_key
LANGCHAIN_API_KEY=ls_your_langchain_api_key

# Email Service (choose one or both)
SENDGRID_API_KEY=SG.your_sendgrid_api_key
RESEND_API_KEY=re_your_resend_api_key
EMAIL_FROM=noreply@axentralab.com

# Telegram Bot
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_ADMIN_CHAT_ID=your_chat_id

# AI Models
AI_PROPOSAL_MODEL=gpt-4              # For proposals (more expensive, better quality)
AI_QUOTE_MODEL=gpt-3.5-turbo         # For quotes (faster, cheaper)
AI_CHAT_MODEL=gpt-3.5-turbo          # For chatbot

# Automation Settings
ENABLE_AUTO_PROPOSALS=true            # Auto-generate proposals for high-score leads
ENABLE_AUTO_FOLLOWUP=true             # Auto-send follow-ups
FOLLOWUP_DELAY_HOURS=24               # When to send first follow-up
```

### Step 3: Get API Keys

#### OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Create new secret key
3. Copy and paste into `.env`

#### SendGrid (Recommended for Email)
1. Sign up at https://sendgrid.com
2. Create API key in Settings → API Keys
3. Set `SENDGRID_API_KEY` in .env
4. Configure `EMAIL_FROM` address (must be verified)

#### Telegram Bot
1. Chat with [@BotFather](https://t.me/botfather) on Telegram
2. Create new bot: `/newbot`
3. Copy bot token to `.env`
4. Get your chat ID:
   - Chat with [@userinfobot](https://t.me/userinfobot)
   - Copy ID from response
5. Add TELEGRAM_ADMIN_CHAT_ID to .env

---

## 📊 Lead Flow & Automation

### Customer Journey:
```
Website Visitor
    ↓
Fills Quote Form / Uses Chatbot / Submits Contact Form
    ↓
Lead Created + Auto-Scored (0-100 points)
    ↓
[Scoring System]
├─ Score ≥ 80 → URGENT (Send proposal immediately)
├─ Score 60-80 → HIGH (Send proposal same day)
├─ Score 40-60 → MEDIUM (Send intro email)
└─ Score < 40 → LOW (Nurture sequence)
    ↓
[Admin Notified via Telegram] 🔔
    ↓
AI Auto-Generates Proposal & Sends Email
    ↓
[If no response after 24 hours]
    ↓
Auto-Sends Follow-up Email
    ↓
Admin Reviews in Dashboard
    ↓
Manual Follow-up or Conversion
    ↓
Deal Won! 🎉
```

---

## 🎮 Using the System

### For Customers:

#### 1. Quote Calculator
```
Website → "Get Quote" → Select Project Type → Customize → Get Instant Estimate → Convert to Lead
```

#### 2. AI Chatbot
```
Click 💬 button → Ask about services → Get instant answers → Book call or get proposal
```

#### 3. Newsletter
```
Enter email → Select preferences → Get weekly updates + exclusive offers
```

### For Admin:

#### View All Leads
```
Admin Dashboard → Leads → See all leads with scores & status
```

#### View High-Priority Leads
```
/api/leads/admin/high-priority → Get urgent leads (≥80 score)
```

#### Auto-Generate Proposal
```
Click "Generate Proposal" → AI creates professional PDF → Auto-sent to customer
```

#### Send Follow-up
```
Click "Send Follow-up" → AI generates personalized email → Sent automatically
```

#### View Analytics
```
/api/leads/admin/analytics → See lead stats, conversion rates, deal values
```

---

## 🔧 API Endpoints Reference

### Quotes
```
POST   /api/quotes                    → Calculate AI quote
GET    /api/quotes/:id                → Get quote details
GET    /api/quotes                    → List all quotes (admin)
POST   /api/quotes/:id/convert        → Convert quote to lead
DELETE /api/quotes/:id                → Delete quote
```

### Leads (Enhanced with AI)
```
POST   /api/leads                           → Create lead (auto-scored)
GET    /api/leads                           → Get all leads (admin)
GET    /api/leads/:id                       → Get lead details
PUT    /api/leads/:id                       → Update lead
DELETE /api/leads/:id                       → Delete lead
POST   /api/leads/:id/auto-proposal         → Generate proposal
POST   /api/leads/:id/send-proposal         → Send proposal email
POST   /api/leads/:id/send-followup         → Send follow-up email
GET    /api/leads/admin/high-priority       → Get high-priority leads
GET    /api/leads/admin/followup-candidates → Get leads to follow up
GET    /api/leads/admin/analytics           → Get analytics
```

### Chatbot
```
POST   /api/chatbot/message               → Send message to bot
GET    /api/chatbot/history/:sessionId    → Get chat history
POST   /api/chatbot/:chatId/rate          → Rate response
POST   /api/chatbot/convert/:sessionId    → Convert chat to lead
GET    /api/chatbot/admin/analytics       → Chat analytics
```

### Newsletter
```
POST   /api/newsletter/subscribe                → Subscribe to newsletter
POST   /api/newsletter/unsubscribe              → Unsubscribe
GET    /api/newsletter                          → List subscribers (admin)
POST   /api/newsletter/send                     → Send newsletter (admin)
POST   /api/newsletter/send-template            → Send template email (admin)
PUT    /api/newsletter/:email/preferences       → Update preferences
GET    /api/newsletter/admin/analytics          → Subscriber analytics
```

---

## 📈 AI Cost Estimates & Models

### Model Selection (in .env):

**For Quotes** - Use `gpt-3.5-turbo` (cheaper, fast)
- ~$0.001 per request
- Good for quick estimates

**For Proposals** - Use `gpt-4` (more accurate, professional)
- ~$0.03 per request
- Better for final proposals

**For Chatbot** - Use `gpt-3.5-turbo` (balanced)
- Fast response, natural language
- Good for real-time interactions

### Estimated Monthly Costs (100 leads/month):
- Quote generation: ~$0.10
- Proposal generation: ~$3.00
- Chatbot interactions (100 messages): ~$0.10
- **Total**: ~$3.20/month for AI

---

## 🚨 Troubleshooting

### "OpenAI API key not found"
→ Check `.env` file has `OPENAI_API_KEY` set correctly

### "Email not sending"
→ Check `SENDGRID_API_KEY` is valid and email is verified in SendGrid
→ Or set `RESEND_API_KEY` as fallback

### "Telegram bot not notifying"
→ Check `TELEGRAM_BOT_TOKEN` format (should start with numbers)
→ Verify `TELEGRAM_ADMIN_CHAT_ID` is correct (get from @userinfobot)

### "Automation jobs not running"
→ Check server logs: `npm run dev`
→ Ensure `ENABLE_AUTO_PROPOSALS=true` in .env
→ MongoDB connection must be working

---

## 💻 Frontend Components to Add

Add these to your `App.js` routes:

```jsx
import QuoteCalculator from './components/common/QuoteCalculator';
import AIChatbot from './components/common/AIChatbot';
import NewsletterSignup from './components/common/NewsletterSignup';

<Route path="/quote" element={<QuoteCalculator />} />
<AIChatbot />  {/* Add globally */}
<NewsletterSignup /> {/* Add in footer or separate page */}
```

---

## 🎯 Next Steps to Complete

1. **Update UI routes** - Add Quote, Chatbot, Newsletter components
2. **Test API endpoints** - Verify all endpoints are working
3. **Setup email service** - Verify SendGrid/Resend keys
4. **Setup Telegram** - Get bot token and admin chat ID
5. **Deploy backend** - Push to production server
6. **Monitor automation jobs** - Check scheduler is running every 5 minutes
7. **Setup AI models cost budget** - Monitor OpenAI usage

---

## 📞 Support

For issues or questions:
- Check logs: `npm run dev` output
- Test endpoints with Postman
- Verify environment variables are set
- Check MongoDB connection

---

**🎉 Your AI Automation System is Ready!**

Start collecting leads, generating proposals, and automating your agency workflow!
