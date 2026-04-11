const { OpenAI } = require('openai');
const { LLMChain } = require('langchain/chains');
const { ChatOpenAI } = require('@langchain/openai');
const { PromptTemplate } = require('langchain/prompts');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const chatModel = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: process.env.AI_CHAT_MODEL || 'gpt-3.5-turbo',
  temperature: 0.7,
});

/**
 * Generate AI Quote Estimate
 * Input: projectType, pages, features, security, deadline, budget
 * Output: estimated cost, timeline, tech stack
 */
exports.generateQuoteEstimate = async (formData) => {
  const prompt = `You are an expert project estimator for a digital agency. Analyze the following project requirements and provide a professional estimate.

Project Type: ${formData.projectType}
Number of Pages: ${formData.pages || 'Not specified'}
Features Required: ${formData.features?.join(', ') || 'Not specified'}
Security Level: ${formData.security || 'Standard'}
Desired Timeline: ${formData.deadline || 'ASAP'}
Budget Range: ${formData.budget || 'Not specified'}

Please provide a detailed JSON response with:
{
  "estimatedCost": "$X - $Y",
  "costBreakdown": {
    "backend": "$X",
    "frontend": "$X",
    "infrastructure": "$X",
    "testing": "$X"
  },
  "timeline": "X weeks",
  "phases": ["Phase 1", "Phase 2", ...],
  "recommendedTechStack": ["React", "Node.js", "MongoDB", ...],
  "securityMeasures": ["..."],
  "riskFactors": ["..."],
  "confidence": "X%"
}

Be specific and professional.`;

  try {
    const response = await openai.chat.completions.create({
      model: process.env.AI_QUOTE_MODEL || 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
    });

    const content = response.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : { error: 'Failed to parse AI response', raw: content };
  } catch (error) {
    console.error('AI Quote Generation Error:', error);
    throw error;
  }
};

/**
 * Generate Professional Proposal
 */
exports.generateProposal = async (lead, quoteEstimate) => {
  const prompt = `Generate a professional project proposal for a client. Use this format and make it engaging:

Client Name: ${lead.name}
Company: ${lead.company}
Service: ${lead.service}
Requirements: ${lead.message}

---

Subject: Project Proposal for ${lead.company} - ${lead.service}

Dear ${lead.name},

Thank you for considering Axentralab for your ${lead.service} project. Based on your requirements, here's our comprehensive proposal:

**Executive Summary**
[One paragraph summary of the solution]

**Proposed Solution**
[Detailed description of what we'll build]

**Technology Stack**
${quoteEstimate.recommendedTechStack?.join(', ') || 'Custom selected'}

**Project Timeline**
${quoteEstimate.timeline || '4-8 weeks'}

**Investment**
${quoteEstimate.estimatedCost || 'Custom quote'}

**Deliverables**
- [List key deliverables]

**Security & Compliance**
${quoteEstimate.securityMeasures?.join('\n') || 'Industry standards'}

**Next Steps**
1. Review proposal
2. Schedule kickoff meeting
3. Sign contract
4. Begin development

We're excited to help bring your vision to life. Please let us know if you have any questions.

Best regards,
Axentralab Team

---`;

  try {
    const response = await openai.chat.completions.create({
      model: process.env.AI_PROPOSAL_MODEL || 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
    });

    return {
      proposal: response.choices[0].message.content,
      generatedAt: new Date(),
      model: process.env.AI_PROPOSAL_MODEL,
    };
  } catch (error) {
    console.error('AI Proposal Generation Error:', error);
    throw error;
  }
};

/**
 * AI Chatbot Response
 */
exports.generateChatbotResponse = async (userMessage, context = {}) => {
  const systemPrompt = `You are an AI assistant for Axentralab, a digital agency specializing in:
- Web Development (React, Node.js)
- SaaS Platform Development
- Security Audits
- AI Integration
- Cloud Infrastructure

Be helpful, professional, and when appropriate, suggest scheduling a consultation.
You can help with:
1. Service information
2. Project estimates
3. Technology recommendations
4. General tech questions

Keep responses concise (2-3 paragraphs max).`;

  try {
    const response = await openai.chat.completions.create({
      model: process.env.AI_CHAT_MODEL || 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return {
      message: response.choices[0].message.content,
      timestamp: new Date(),
      usage: {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens,
      },
    };
  } catch (error) {
    console.error('AI Chatbot Error:', error);
    throw error;
  }
};

/**
 * Generate Blog Content Ideas
 */
exports.generateBlogIdeas = async (topic = 'digital agency services') => {
  const prompt = `Generate 5 blog post ideas for a digital agency called Axentralab. 
Topic: ${topic}

Format as JSON array with: title, description, keywords, targetAudience

Make them SEO-friendly and engaging.`;

  try {
    const response = await openai.chat.completions.create({
      model: process.env.AI_CHAT_MODEL || 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
    });

    const content = response.choices[0].message.content;
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : { error: 'Failed to parse', raw: content };
  } catch (error) {
    console.error('Blog Ideas Generation Error:', error);
    throw error;
  }
};

/**
 * Generate Personalized Follow-up Email
 */
exports.generateFollowupEmail = async (lead, proposal = null) => {
  const prompt = `Generate a personalized follow-up email for this lead:

Name: ${lead.name}
Company: ${lead.company}
Service Interested In: ${lead.service}
Days Since Contact: ${Math.floor((new Date() - new Date(lead.createdAt)) / (1000 * 60 * 60 * 24))}
Proposal Sent: ${proposal ? 'Yes' : 'No'}

The email should:
- Be friendly and professional
- Reference their specific interest (${lead.service})
- Call to action (schedule meeting, ask questions, etc.)
- Not be too pushy
- Include a link to book consultation

Return as plain text email body.`;

  try {
    const response = await openai.chat.completions.create({
      model: process.env.AI_CHAT_MODEL || 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    return {
      emailBody: response.choices[0].message.content,
      generatedAt: new Date(),
    };
  } catch (error) {
    console.error('Followup Email Generation Error:', error);
    throw error;
  }
};

module.exports = exports;
