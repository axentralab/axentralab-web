// Shared status color map — used in AdminPage, DashboardPage, etc.
export const STATUS_COLORS = {
  pending:   '#F59E0B',
  paid:      '#22C55E',
  active:    '#3B82F6',
  completed: '#8B5CF6',
  cancelled: '#EF4444',
  new:       '#3B82F6',
  contacted: '#F59E0B',
  qualified: '#22C55E',
  closed:    '#8B5CF6',
};

// Blog tag / category colors — used in BlogPage, BlogPostPage, HomePage
export const TAG_COLORS = {
  Cybersecurity:  '#EF4444',
  'AI Automation':'#22C55E',
  DevOps:         '#8B5CF6',
  'SaaS Dev':     '#F59E0B',
  'Web Dev':      '#3B82F6',
  General:        '#06B6D4',
};

// Shared fallback blog posts — used in BlogPage AND BlogPostPage
export const BLOG_FALLBACK = [
  { _id:'1',  title:'OWASP Top 10: What Every Developer Must Know in 2025',                    category:'Cybersecurity',  excerpt:'Understanding the most critical web application security risks and how to protect against them.',                                          createdAt:'2025-02-28', views:1240 },
  { _id:'2',  title:'Building AI Agents with LangChain and Node.js',                          category:'AI Automation',  excerpt:'A practical guide to building production-ready AI agents using LangChain, Node.js and GPT-4.',                                           createdAt:'2025-02-20', views:980  },
  { _id:'3',  title:'Zero-Downtime Deployments with Docker & Nginx',                          category:'DevOps',         excerpt:'Step-by-step walkthrough for achieving zero-downtime deployments using Docker, Nginx and GitHub Actions.',                                createdAt:'2025-02-12', views:740  },
  { _id:'4',  title:'Multi-Tenant SaaS Architecture: Patterns & Pitfalls',                    category:'SaaS Dev',       excerpt:'Learn the key architectural patterns for building scalable multi-tenant SaaS products.',                                               createdAt:'2025-02-05', views:610  },
  { _id:'5',  title:'10 Most Common WordPress Security Mistakes (and How to Fix Them)',        category:'Cybersecurity',  excerpt:'Avoid the typical WordPress security pitfalls with practical solutions.',                                                            createdAt:'2025-03-01', views:320  },
  { _id:'6',  title:'How to Protect Your Business from Phishing Attacks in 2026',             category:'Cybersecurity',  excerpt:'Stay ahead of phishing threats with our latest strategies.',                                                                        createdAt:'2025-03-02', views:210  },
  { _id:'7',  title:'Step-by-Step Guide: Securing Your Website Like a Pro',                   category:'Cybersecurity',  excerpt:'A full walkthrough on locking down your site against common exploits.',                                                              createdAt:'2025-03-03', views:180  },
  { _id:'8',  title:'Top 5 Cyber Threats Facing Small Businesses',                            category:'Cybersecurity',  excerpt:'Discover the biggest risks for small companies and our preventive tactics.',                                                         createdAt:'2025-03-04', views:155  },
  { _id:'9',  title:'Understanding Ransomware: Prevention Tips for Companies',                 category:'Cybersecurity',  excerpt:'Key steps to protect your organization from costly ransomware attacks.',                                                             createdAt:'2025-03-05', views:140  },
  { _id:'10', title:'Why MERN Stack is the Future of Scalable Web Apps',                      category:'Web Dev',        excerpt:'An analysis of why MERN continues to dominate modern web development.',                                                             createdAt:'2025-03-06', views:290  },
  { _id:'11', title:'Building a Secure SaaS Product in 30 Days: A Complete Roadmap',          category:'SaaS Dev',       excerpt:'Timeline and tactics for launching a secure SaaS application fast.',                                                                 createdAt:'2025-03-07', views:270  },
  { _id:'12', title:'How to Optimize Your Website Speed for Google Core Web Vitals',          category:'Web Dev',        excerpt:'Performance tips to hit the latest Core Web Vitals benchmarks.',                                                                    createdAt:'2025-03-08', views:230  },
  { _id:'13', title:'Top 10 React Hooks Every Developer Should Know in 2026',                 category:'Web Dev',        excerpt:'A curated list of hooks that boost productivity and maintainability.',                                                               createdAt:'2025-03-09', views:200  },
  { _id:'14', title:'From Wireframe to Launch: How Axentralab Builds Client Websites',        category:'Web Dev',        excerpt:'See our process for taking a design from concept to live site.',                                                                    createdAt:'2025-03-10', views:185  },
  { _id:'15', title:'How AI is Changing Cybersecurity: A Beginner\'s Guide',                  category:'AI Automation',  excerpt:'Introduction to AI-powered defenses and what they mean for security professionals.',                                                 createdAt:'2025-03-11', views:310  },
  { _id:'16', title:'Machine Learning for Predicting Website Attacks',                        category:'AI Automation',  excerpt:'Using ML models to forecast and block malicious traffic.',                                                                          createdAt:'2025-03-12', views:175  },
  { _id:'17', title:'Using AI to Optimize UX on Your Website',                                category:'AI Automation',  excerpt:'Leverage artificial intelligence to personalize and improve user journeys.',                                                          createdAt:'2025-03-13', views:160  },
  { _id:'18', title:'Axentralab Case Study: How ML Helped Detect Vulnerabilities Faster',     category:'AI Automation',  excerpt:'A real-world example of machine learning accelerating our pentests.',                                                               createdAt:'2025-03-14', views:145  },
  { _id:'19', title:'The Future of Automated Threat Detection with AI',                       category:'AI Automation',  excerpt:'What next-generation AI systems will mean for threat hunting.',                                                                     createdAt:'2025-03-15', views:130  },
  { _id:'20', title:'How to Turn Your Idea into a SaaS Product in 6 Steps',                   category:'SaaS Dev',       excerpt:'A simple framework for going from concept to paying customers.',                                                                    createdAt:'2025-03-16', views:220  },
  { _id:'21', title:'Why Multi-Tier Subscription Models Work for Tech Startups',              category:'SaaS Dev',       excerpt:'Explore pricing strategies that maximize revenue and retention.',                                                                    createdAt:'2025-03-17', views:195  },
  { _id:'22', title:'The Complete Checklist for Launching a Web Security SaaS',               category:'SaaS Dev',       excerpt:'Everything you need before rolling out your security platform.',                                                                    createdAt:'2025-03-18', views:170  },
  { _id:'23', title:'Axentralab\'s Approach to Building Client-Focused SaaS',                 category:'SaaS Dev',       excerpt:'How we prioritize users when crafting subscription products.',                                                                     createdAt:'2025-03-19', views:150  },
  { _id:'24', title:'From Concept to Code: Launching a Cybersecurity Tool on a Budget',       category:'SaaS Dev',       excerpt:'Bootstrapping a security app with limited resources.',                                                                             createdAt:'2025-03-20', views:125  },
  { _id:'25', title:'How We Helped a Local Business Avoid a Cyberattack',                     category:'Cybersecurity',  excerpt:'A case study detailing our defense implementation for a small client.',                                                             createdAt:'2025-03-21', views:115  },
  { _id:'26', title:'Case Study: Migrating a Website to a Fully Secure MERN Stack',           category:'Web Dev',        excerpt:'Lessons learned migrating a client to a hardened MERN architecture.',                                                              createdAt:'2025-03-22', views:105  },
  { _id:'27', title:'Axentralab\'s Top 5 Security Wins in 2025',                              category:'Cybersecurity',  excerpt:'A roundup of our most impactful security projects from last year.',                                                               createdAt:'2025-03-23', views:98   },
  { _id:'28', title:'Before & After: Website Optimization that Boosted Conversions by 30%',   category:'Web Dev',        excerpt:'How performance tweaks translated into real revenue gains.',                                                                        createdAt:'2025-03-24', views:88   },
  { _id:'29', title:'Real Lessons from Client Projects: Security & Performance',              category:'General',        excerpt:'Hard-earned insights from working with diverse customers.',                                                                         createdAt:'2025-03-25', views:75   },
];