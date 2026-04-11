# 🎯 Axentralab AI Automation - Quick Start Guide

## 🚀 Deploy in 5 Steps

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Get API Keys (5 minutes)

**OpenAI** (For AI features)
- Go: https://platform.openai.com/api-keys
- Click: "Create new secret key"
- Copy key → Paste in `.env` as `OPENAI_API_KEY`

**SendGrid** (For emails)
- Go: https://sendgrid.com/settings/api_keys
- Click: "Create API Key"
- Give any name, Full Access
- Copy → Paste in `.env` as `SENDGRID_API_KEY`

**Telegram** (For admin alerts)
- Open Telegram
- Search: @BotFather
- Message: `/newbot`
- Name your bot: "Axentralab-AI"
- Copy token → Paste in `.env` as `TELEGRAM_BOT_TOKEN`
- Search: @userinfobot
- Copy your chat ID → Paste as `TELEGRAM_ADMIN_CHAT_ID`

### Step 3: Update .env
```bash
cp backend/.env.example backend/.env
# Edit backend/.env and add your API keys
```

**Required keys:**
```
OPENAI_API_KEY=sk-...
SENDGRID_API_KEY=SG....
TELEGRAM_BOT_TOKEN=123456:ABC...
TELEGRAM_ADMIN_CHAT_ID=12345678
EMAIL_FROM=noreply@axentralab.com
```

### Step 4: Start Backend
```bash
cd backend
npm run dev
```

You should see:
```
🚀 Server running on port 5000
🤖 Initializing AI Automation Scheduler...
✅ Automation Scheduler initialized
```

### Step 5: Add Components to Frontend

Edit `frontend/src/App.js`:
```jsx
import QuoteCalculator from './components/common/QuoteCalculator';
import AIChatbot from './components/common/AIChatbot';
import NewsletterSignup from './components/common/NewsletterSignup';

function App() {
  return (
    <>
      <Routes>
        {/* ... existing routes ... */}
        <Route path="/quote" element={<QuoteCalculator />} />
      </Routes>
      
      {/* Add these globally */}
      <AIChatbot />
      
      {/* Add in footer */}
      <NewsletterSignup />
    </>
  );
}
```

---

## 💰 Cost Breakdown

### OpenAI (Per Request)
| Action | Model | Cost |
|--------|-------|------|
| Chatbot | gpt-3.5-turbo | $0.001 |
| Quote | gpt-3.5-turbo | $0.001 |
| Proposal | gpt-4 | $0.03 |
| Blog Ideas | gpt-3.5-turbo | $0.001 |

**Monthly (100 leads)**: ~$5-10/month

### SendGrid
- Free tier: 100 emails/day
- Paid: $19/month (10k emails/day)
- Telegram: FREE

---

## 📊 What Happens When...

### Customer Fills Quote Form
```
1. AI calculates estimate (3 seconds)
2. Shows breakdown & tech stack
3. Customer clicks "Get Proposal"
4. Lead created + Auto-scored
5. Admin gets Telegram alert 🔔
6. System schedules auto-proposal (30 min delay)
7. Proposal auto-sent to customer 📧
```

### Customer Uses Chatbot
```
1. Types question
2. AI responds (ChatGPT) (2 seconds)
3. Customer can click to convert to lead
4. Lead created with chat summary
5. Admin notified
6. Follow-up workflow starts
```

### No Response After 24 Hours
```
1. System checks leads at 24h mark
2. Auto-sends follow-up email
3. Repeats at 72h if needed
4. Max 3 follow-ups per lead
5. Admin can view in dashboard
```

---

## 🎛️ Admin Dashboard Features

### View High-Priority Leads
```
GET /api/leads/admin/high-priority
```
Shows leads with score ≥80 (URGENT)

### Get Leads for Follow-up
```
GET /api/leads/admin/followup-candidates
```
Shows leads that need follow-ups (24h+ old, no response)

### View Analytics
```
GET /api/leads/admin/analytics
```
Shows:
- Sum mary by priority
- Proposals sent
- Conversion rate
- Total revenue

### Send Manual Follow-up
```
POST /api/leads/:id/send-followup
```
Triggers AI-generated personalized follow-up

### Generate Proposal
```
POST /api/leads/:id/auto-proposal
```
Creates professional PDF proposal

---

## 🔧 Customization

### Change Lead Score Thresholds
File: `backend/utils/leadScoringService.js`
```javascript
function determinePriority(score) {
  if (score >= 80) return 'urgent';    // ← Edit these
  if (score >= 60) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}
```

### Change Follow-up Delay
File: `backend/.env`
```
FOLLOWUP_DELAY_HOURS=24  # ← Change this (hours)
```

### Change Which AI Model
File: `backend/.env`
```
AI_PROPOSAL_MODEL=gpt-4           # Pro: Better quality | Con: Cost ~3x
AI_QUOTE_MODEL=gpt-3.5-turbo      # Pro: Fast, cheap | Con: Less detail
AI_CHAT_MODEL=gpt-3.5-turbo       # Pro: Real-time | Con: Limited context
```

### Disable Auto-Automation
File: `backend/.env`
```
ENABLE_AUTO_PROPOSALS=false   # Disable auto-proposals
ENABLE_AUTO_FOLLOWUP=false    # Disable auto-followups
```

---

## 🐛 Common Issues & Fixes

### "OpenAI API error"
→ Check key is correct and not revoked
→ Ensure you have credits in OpenAI account

### "Email not sending"
→ Is `SENDGRID_API_KEY` set? ✅
→ Is sender email verified in SendGrid? ✅
→ Check SendGrid Activity for bounces

### "Telegram not notifying"
→ Is `TELEGRAM_BOT_TOKEN` valid? ✅
→ Is `TELEGRAM_ADMIN_CHAT_ID` correct? ✅
→ Try sending test message: `POST /api/telegram/test`

### "Automation not running"
→ Check server logs: See "Automation Scheduler initialized"?
→ Is `ENABLE_AUTOMATION` not set to "false"?
→ Check database: Any documents in AutomationJob collection?

---

## 📊 Key Metrics to Monitor

### Lead Quality
```
Score Distribution:
├─ Urgent (80+): ____ leads
├─ High (60-80): ____ leads
├─ Medium (40-60): ____ leads
└─ Low (<40): ____ leads
```

### Conversion Metrics
```
Total Leads: ____
Proposals Sent: ____ (%)
Conversions: ____ (%)
Average Deal Value: $____
```

### Automation Health
```
Jobs Executed Today: ____
Job Success Rate: ____%
Email Delivery Rate: ____%
Response Time: __ seconds
```

---

## 🎓 Understanding Lead Scores

Lead Score = Budget (25%) + Company (20%) + Service (20%) + Email (15%) + Message (15%) + Recency (5%)

### Examples:

**Lead A: Score 85 (URGENT)**
- Enterprise company ($$$)
- Wants SaaS development
- Business email
- Detailed requirements
- Submitted today
→ Action: Send proposal immediately

**Lead B: Score 45 (MEDIUM)**
- Small business ($$)
- Wants website
- Personal email
- Vague about needs
- Submitted 2 weeks ago
→ Action: Send intro email, nurture

**Lead C: Score 20 (LOW)**
- Unknown company
- Just started inquiry
- Generic message
- No budget mentioned
→ Action: Add to newsletter, nurture

---

## 🚀 Pro Tips

1. **Test First**: Call `/api/health` to verify backend is running
2. **Monitor Costs**: Set OpenAI usage alerts at $5/month
3. **Email Verification**: Verify all SendGrid senders before going live
4. **Telegram Testing**: Send message to bot first to activate
5. **Lead Cleanup**: Archive old leads monthly to keep system fast
6. **Backup Database**: MongoDB backups should be automated
7. **Check Logs**: Always check server output for warnings

---

## 📧 Email Templates Included

System automatically sends:
- ✅ Lead confirmation email
- ✅ AI-generated proposal
- ✅ Personalized follow-ups
- ✅ Admin notifications (Telegram)
- ✅ Newsletter broadcasts
- ✅ Template emails (security tips, updates)

---

## 🎯 Success Metrics

After 1 month, you should see:
- 📈 Lead response time: < 1 minute
- 📈 Proposal generation: < 5 minutes
- 📈 Lead-to-proposal rate: 100%
- 📈 Admin time savings: 70%+
- 📈 Customer satisfaction: High (chatbot ratings)

---

## 📞 Need Help?

Check these files:
- Setup: `AI_AUTOMATION_SETUP.md`
- Overview: `AI_IMPLEMENTATION_SUMMARY.md`
- API Routes: Backend routes documentation
- Models: `backend/models/*`

---

**🎉 System Ready!**

Visit `/quote` on your website and test the flow end-to-end.
