/**
 * Seed script — run once to populate DB with services and admin user
 * Usage:  node backend/seed.js
 */

require('dotenv').config({ path: __dirname + '/../backend/.env' });
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) { console.error('❌  Set MONGO_URI in backend/.env'); process.exit(1); }

const userSchema = new mongoose.Schema({ name:String, email:{ type:String, unique:true }, password:{ type:String, select:false }, role:{ type:String, default:'client' }, company:String, phone:String, isActive:{ type:Boolean, default:true } }, { timestamps:true });
const serviceSchema = new mongoose.Schema({ title:String, slug:{ type:String, unique:true }, category:String, icon:String, color:String, description:String, features:[String], plans:[{ name:String, price:Number, billing:String, features:[String] }], isActive:{ type:Boolean, default:true }, order:Number }, { timestamps:true });

const User    = mongoose.models.User    || mongoose.model('User',    userSchema);
const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);

const SERVICES = [
  { title:'AI Automation',    slug:'ai-automation',    category:'Automation', icon:'⚡', color:'#22C55E', order:1, description:'Chatbots, workflow automation, CRM integration, and intelligent AI agents.', features:['AI chatbots','Workflow automation','CRM integration','AI agents'], plans:[{ name:'Starter', price:499, billing:'one-time', features:['1 chatbot','Basic workflow','Email support'] },{ name:'Pro', price:999, billing:'one-time', features:['5 chatbots','Advanced workflows','Priority support','CRM integration'] },{ name:'Enterprise', price:2499, billing:'one-time', features:['Unlimited bots','Custom AI agents','Dedicated support','Full CRM suite'] }] },
  { title:'Web Development',  slug:'web-development',  category:'Development', icon:'🌐', color:'#3B82F6', order:2, description:'MERN apps, SaaS platforms, dashboards, and enterprise-grade websites.', features:['React/Next.js','Node.js backend','MongoDB','Deployment'], plans:[{ name:'Landing Page', price:799, billing:'one-time', features:['5 sections','Responsive','SEO ready','1 month support'] },{ name:'Web App', price:2999, billing:'one-time', features:['Full MERN stack','Auth system','Dashboard','3 months support'] },{ name:'SaaS Platform', price:7999, billing:'one-time', features:['Multi-tenant','Stripe billing','Admin panel','6 months support'] }] },
  { title:'Cybersecurity',    slug:'cybersecurity',    category:'Security', icon:'🛡️', color:'#EF4444', order:3, description:'Vulnerability scanning, penetration testing, malware removal, security audits.', features:['Pen testing','Vuln scanning','Security audit','Malware removal'], plans:[{ name:'Basic Audit', price:399, billing:'one-time', features:['Surface scan','Report','Fix recommendations'] },{ name:'Full Pentest', price:1499, billing:'one-time', features:['Deep pen test','OWASP coverage','Detailed report','Fix support'] },{ name:'Ongoing Monitor', price:299, billing:'monthly', features:['24/7 monitoring','Instant alerts','Monthly reports','Incident response'] }] },
  { title:'DevOps & Cloud',   slug:'devops-cloud',     category:'Infrastructure', icon:'☁️', color:'#8B5CF6', order:4, description:'CI/CD pipelines, cloud automation, containerization, infrastructure monitoring.', features:['CI/CD','Docker/K8s','Cloud setup','Monitoring'], plans:[{ name:'Setup', price:699, billing:'one-time', features:['CI/CD pipeline','Docker setup','Basic monitoring'] },{ name:'Full DevOps', price:1999, billing:'one-time', features:['Full infra setup','Auto-scaling','Advanced monitoring','Runbooks'] },{ name:'Managed', price:499, billing:'monthly', features:['Ongoing management','24/7 support','Scaling','Incident response'] }] },
  { title:'SaaS Development', slug:'saas-development', category:'Development', icon:'📦', color:'#F59E0B', order:5, description:'Full-cycle SaaS product design, development, and deployment.', features:['Full dev cycle','Subscription billing','Multi-tenant','Analytics'], plans:[{ name:'MVP', price:4999, billing:'one-time', features:['Core features','Auth & billing','Basic analytics','3 months support'] },{ name:'Full SaaS', price:14999, billing:'one-time', features:['All features','Admin dashboard','Advanced analytics','6 months support','Dedicated PM'] }] },
  { title:'IT Consulting',    slug:'it-consulting',    category:'Consulting', icon:'💡', color:'#06B6D4', order:6, description:'Architecture planning, digital transformation, tech stack advisory.', features:['Architecture','Digital transformation','Tech stack advice','Roadmapping'], plans:[{ name:'1-hour Call', price:149, billing:'one-time', features:['60 min consultation','Written summary','Action items'] },{ name:'Deep Dive', price:799, billing:'one-time', features:['Full day workshop','Architecture doc','Tech roadmap','Follow-up call'] },{ name:'Retainer', price:999, billing:'monthly', features:['10 hours/month','Priority access','Ongoing guidance','Slack access'] }] },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅  Connected to MongoDB');

    // Services
    await Service.deleteMany({});
    await Service.insertMany(SERVICES);
    console.log(`✅  Seeded ${SERVICES.length} services`);

    // Admin user
    const exists = await User.findOne({ email: 'admin@axentralab.com' });
    if (!exists) {
      const hash = await bcrypt.hash('admin123!', 12);
      await User.create({ name:'Admin User', email:'admin@axentralab.com', password: hash, role:'admin', company:'Axentralab' });
      console.log('✅  Admin user created  →  admin@axentralab.com / admin123!');
    } else {
      console.log('ℹ️   Admin user already exists');
    }

    console.log('\n🎉  Seed complete!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌  Seed error:', err.message);
    process.exit(1);
  }
}

seed();
