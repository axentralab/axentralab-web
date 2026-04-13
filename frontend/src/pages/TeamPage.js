import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HERO_BG_IMAGE = process.env.REACT_APP_TEAM_HERO_BG_IMAGE || '/images/team-hero-bg.png';

const TEAM = [
  {
    name:'Nazat Hossain',
    role:'Founder & CEO',
    bio:'Visionary behind Axentralab. Leads strategy, client relationships and overall direction.',
    photo:'/images/team/nazat.jpg',
    color:'#8B5CF6',
    skills:['Leadership','Strategy','Business'],
    social:{ linkedin:'#' },
    badge:'Founder',
  },

  {
    name:'Shoumo Shahriar Araf',
    role:'Full-Stack Developer',
    bio:'Builds scalable apps with clean architecture.',
    photo:'/images/team/shoumo.jpg',
    color:'#3B82F6',
    skills:['React','Node.js'],
    social:{ github:'#', linkedin:'#' },
  },

  {
    name:'Mazharul Islam Sourabh',
    role:'Full-Stack Developer',
    bio:'Expert in SaaS & system design.',
    photo:'/images/team/sourabh.jpg',
    color:'#A855F7',
    skills:['React','PostgreSQL'],
    social:{ github:'#', linkedin:'#' },
  },

  {
    name:'Asadujjaman Atik',
    role:'Full-Stack Developer',
    bio:'Focused on eCommerce systems.',
    photo:'/images/team/atik.jpg',
    color:'#F59E0B',
    skills:['React','MongoDB'],
    social:{ github:'#', linkedin:'#' },
  },

  {
    name:'Kazi Md Jonayed',
    role:'UI/UX Designer',
    bio:'Designs high-converting interfaces.',
    photo:'/images/team/jonayed.jpg',
    color:'#EC4899',
    skills:['Figma','UX'],
    social:{ linkedin:'#' },
  },

  {
    name:'Shoshanto Chandra Das',
    role:'Frontend Developer',
    bio:'Handles UI implementation and fixes.',
    photo:'/images/team/shoshanto.jpg',
    color:'#06B6D4',
    skills:['React','CSS'],
    social:{ github:'#' },
  },

  {
    name:'F. R. Md. Ali Nabi',
    role:'Sales Executive',
    bio:'Handles client acquisition.',
    photo:'/images/team/alinabi.jpg',
    color:'#22D3EE',
    skills:['Sales','Negotiation'],
    social:{ linkedin:'#' },
  },

  {
    name:'Snehashis Nag',
    role:'Sales Executive',
    bio:'Manages outreach and deals.',
    photo:'/images/team/snehashis.jpg',
    color:'#F97316',
    skills:['Sales','Marketing'],
    social:{ linkedin:'#' },
  },

  // 🔥 ADDING NEW 17 MEMBERS

  { name:'Rakib Hasan', role:'Backend Developer', bio:'API & server expert.', photo:'/images/team/user1.jpg', color:'#6366F1', skills:['Node','API'], social:{ github:'#' } },
  { name:'Tanvir Ahmed', role:'Frontend Developer', bio:'UI builder.', photo:'/images/team/user2.jpg', color:'#14B8A6', skills:['React'], social:{ github:'#' } },
  { name:'Mehedi Hasan', role:'WordPress Developer', bio:'WP specialist.', photo:'/images/team/user3.jpg', color:'#F43F5E', skills:['WordPress'], social:{ } },
  { name:'Sakib Rahman', role:'QA Engineer', bio:'Testing & bug fixing.', photo:'/images/team/user4.jpg', color:'#EAB308', skills:['Testing'], social:{ } },
  { name:'Arif Hossain', role:'DevOps Engineer', bio:'Deploy & CI/CD.', photo:'/images/team/user5.jpg', color:'#0EA5E9', skills:['Docker'], social:{ } },
  { name:'Nusrat Jahan', role:'UI Designer', bio:'Modern UI creator.', photo:'/images/team/user6.jpg', color:'#D946EF', skills:['Figma'], social:{ } },
  { name:'Imran Khan', role:'SEO Specialist', bio:'Ranks websites.', photo:'/images/team/user7.jpg', color:'#84CC16', skills:['SEO'], social:{ } },
  { name:'Rifat Mahmud', role:'Content Writer', bio:'Writes conversion content.', photo:'/images/team/user8.jpg', color:'#F97316', skills:['Writing'], social:{ } },
  { name:'Jahidul Islam', role:'Support Engineer', bio:'Client support expert.', photo:'/images/team/user9.jpg', color:'#8B5CF6', skills:['Support'], social:{ } },
  { name:'Hasan Mahmud', role:'Security Analyst', bio:'Handles vulnerabilities.', photo:'/images/team/user10.jpg', color:'#EF4444', skills:['Security'], social:{ } },
  { name:'Sabbir Hossain', role:'Mobile App Dev', bio:'Builds mobile apps.', photo:'/images/team/user11.jpg', color:'#3B82F6', skills:['React Native'], social:{ } },
  { name:'Farhan Ahmed', role:'Project Manager', bio:'Manages delivery.', photo:'/images/team/user12.jpg', color:'#8B5CF6', skills:['Management'], social:{ } },
  { name:'Tariq Islam', role:'Data Analyst', bio:'Analyzes data.', photo:'/images/team/user13.jpg', color:'#06B6D4', skills:['Data'], social:{ } },
  { name:'Mariam Akter', role:'HR Manager', bio:'Handles recruitment.', photo:'/images/team/user14.jpg', color:'#F472B6', skills:['HR'], social:{ } },
  { name:'Omar Faruk', role:'Marketing Manager', bio:'Growth strategist.', photo:'/images/team/user15.jpg', color:'#10B981', skills:['Marketing'], social:{ } },
  { name:'Shakil Ahmed', role:'Automation Engineer', bio:'Builds automation.', photo:'/images/team/user16.jpg', color:'#F59E0B', skills:['Automation'], social:{ } },
  { name:'Nayeem Islam', role:'Intern Developer', bio:'Learning & contributing.', photo:'/images/team/user17.jpg', color:'#9CA3AF', skills:['Learning'], social:{ } },
];


const STATS = [
  { value: '25',   label: 'Core Team Members',   color: '#8B5CF6' },
  { value: '15+',  label: 'Projects Completed',   color: '#3B82F6' },
  { value: '5+',   label: 'Ongoing Projects',     color: '#A855F7' },
  { value: '7+',  label: 'Happy Clients',        color: '#F59E0B' },
];

const EXPERTISE = [
  { area: 'Web Development',      tags: ['React', 'Node.js', 'MERN', 'Business Sites', 'Corporate Portals'],    color: '#3B82F6' },
  { area: 'E-commerce',           tags: ['Custom Shops', 'Product Management', 'Payment Integration', 'POS'],   color: '#8B5CF6' },
  { area: 'Custom Web Systems',   tags: ['POS Systems', 'Courier Platforms', 'SaaS Apps', 'Dashboards'],        color: '#F59E0B' },
  { area: 'UI/UX Design',         tags: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],            color: '#A855F7' },
  { area: 'Cybersecurity',        tags: ['Basic Security Audit', 'HTTPS Setup', 'Vulnerability Check', 'OWASP'],color: '#EF4444' },
  { area: 'Digital Marketing',    tags: ['Sales Funnel', 'SEO', 'Social Media', 'Lead Generation'],             color: '#06B6D4' },
];

function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .322.218.694.825.576C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}
function LinkedinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}
function TwitterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function MemberCard({ member, index }) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20,
        overflow: 'hidden',
        transition: 'all 0.3s',
        animation: `fadeUp 0.5s ${index * 0.08}s ease both`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `${member.color}40`;
        e.currentTarget.style.transform   = 'translateY(-6px)';
        e.currentTarget.style.boxShadow   = `0 20px 48px ${member.color}14`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
        e.currentTarget.style.transform   = 'none';
        e.currentTarget.style.boxShadow   = 'none';
      }}
    >
      <div style={{ height: 3, background: `linear-gradient(90deg,${member.color},transparent)` }} />
      <div style={{ position: 'relative', height: 220, background: `${member.color}10`, overflow: 'hidden' }}>
        {!imgErr ? (
          <img
            src={member.photo}
            alt={member.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
            onError={() => setImgErr(true)}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg,${member.color}20,${member.color}08)` }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: `${member.color}25`, border: `2px solid ${member.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 28, color: member.color }}>
              {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
          </div>
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(6,8,15,0.7) 100%)' }} />
        {member.badge && (
          <div style={{ position: 'absolute', top: 14, left: 14 }}>
            <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 6, background: member.color, color: ['#8B5CF6','#F59E0B'].includes(member.color) ? '#000' : '#fff', fontSize: 9, fontFamily: "'Space Mono',monospace", fontWeight: 900, letterSpacing: 1 }}>
              {member.badge.toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <div style={{ padding: '20px 22px 22px' }}>
        <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 17, fontWeight: 900, color: '#fff', margin: '0 0 4px', letterSpacing: -0.3 }}>
          {member.name}
        </h3>
        <p style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: member.color, margin: '0 0 12px', fontWeight: 700, letterSpacing: 0.5 }}>
          {member.role}
        </p>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, margin: '0 0 16px' }}>
          {member.bio}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
          {member.skills.map((skill, i) => (
            <span key={i} style={{ padding: '3px 9px', borderRadius: 6, background: `${member.color}10`, border: `1px solid ${member.color}25`, color: member.color, fontSize: 10, fontFamily: "'Space Mono',monospace", fontWeight: 600 }}>
              {skill}
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {member.social.github && (
            <a href={member.social.github} target="_blank" rel="noopener noreferrer"
              style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.45)', textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}>
              <GithubIcon />
            </a>
          )}
          {member.social.linkedin && (
            <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer"
              style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.45)', textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.15)'; e.currentTarget.style.color = '#3B82F6'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}>
              <LinkedinIcon />
            </a>
          )}
          {member.social.twitter && (
            <a href={member.social.twitter} target="_blank" rel="noopener noreferrer"
              style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.45)', textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}>
              <TwitterIcon />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TeamPage() {
  const { t } = useTranslation();
  return (
    <>
      <div style={{ padding: '108px 5% 0', minHeight: '100vh' }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:none; } }
        @keyframes pulse  { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.08)} }
        @keyframes marquee{ from{transform:translateX(0)} to{transform:translateX(-50%)} }

        .team-responsive {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .expertise-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          max-width: 900px;
          margin: 0 auto;
        }
        @media (max-width: 700px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .stats-grid > div { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.06); }
          .stats-grid > div:nth-child(odd) { border-right: 1px solid rgba(255,255,255,0.06) !important; }
        }
        @media (max-width: 480px) {
          .team-responsive { grid-template-columns: 1fr !important; }
          .expertise-grid  { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* HERO */}
      <section style={{ position: 'relative', overflow: 'hidden', borderRadius: 20, marginBottom: 64, padding: '72px 20px' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${HERO_BG_IMAGE})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(100deg, rgba(5,10,20,0.9) 0%, rgba(5,10,20,0.72) 48%, rgba(5,10,20,0.9) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', animation: 'fadeUp 0.6s ease both' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 16px', borderRadius: 999, border: '1px solid rgba(139,92,246,0.3)', background: 'rgba(139,92,246,0.07)', marginBottom: 24 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#8B5CF6', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#8B5CF6', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>The People Behind the Work</span>
          </div>
          <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: 'clamp(32px,5.5vw,68px)', fontWeight: 900, color: '#fff', margin: '0 0 20px', letterSpacing: -2.5, lineHeight: 1.04 }}>
            Meet the{' '}
            <span style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(255,255,255,0.3)' }}>Team</span>
            <span style={{ color: '#8B5CF6' }}>.</span>
          </h1>
          <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 'clamp(14px,1.8vw,18px)', color: 'rgba(255,255,255,0.42)', maxWidth: 520, margin: '0 auto 32px', lineHeight: 1.75 }}>
            A tight-knit crew of engineers, security specialists and designers — united by one goal: shipping software that just works.
          </p>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['🌏 Remote-first','⚡ Async by default','🔒 Security-obsessed','🚢 Ship fast, fix faster'].map((v, i) => (
              <span key={i} style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)', fontFamily: "'Space Mono',monospace" }}>{v}</span>
            ))}
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 80 }}>
        <div className="stats-grid" style={{ background: 'rgba(255,255,255,0.01)' }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '28px 20px', borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
              <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 34, fontWeight: 900, color: s.color, letterSpacing: -1, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.32)', marginTop: 6, fontFamily: "'Space Mono',monospace", letterSpacing: 0.5, textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TEAM MEMBER CARDS */}
      <section style={{ marginBottom: 96 }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <span style={{ display: 'inline-block', padding: '3px 12px', borderRadius: 999, border: '1px solid #3B82F640', background: '#3B82F612', color: '#3B82F6', fontSize: 10, fontFamily: "'Space Mono',monospace", letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>Our People</span>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 'clamp(24px,3.5vw,42px)', fontWeight: 900, color: '#fff', marginTop: 14, letterSpacing: -1 }}>The Core Team</h2>
          <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 14, maxWidth: 400, margin: '12px auto 0' }}>
            Small enough to move fast. Experienced enough to get it right.
          </p>
        </div>
        <div className="team-responsive">
          {TEAM.map((member, i) => (
            <MemberCard key={member.name} member={member} index={i} />
          ))}
        </div>
      </section>

      {/* SHARED EXPERTISE */}
      <section style={{ marginBottom: 96, padding: '72px 0', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <span style={{ display: 'inline-block', padding: '3px 12px', borderRadius: 999, border: '1px solid #8B5CF640', background: '#8B5CF612', color: '#8B5CF6', fontSize: 10, fontFamily: "'Space Mono',monospace", letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>Skills</span>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 'clamp(24px,3.5vw,42px)', fontWeight: 900, color: '#fff', marginTop: 14, letterSpacing: -1 }}>Our Collective Expertise</h2>
          <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 14, maxWidth: 420, margin: '12px auto 0' }}>
            Across 6 specialisations — every project is covered end to end.
          </p>
        </div>
        <div className="expertise-grid">
          {EXPERTISE.map((e, i) => (
            <div key={i}
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '24px 22px', transition: 'all 0.25s' }}
              onMouseEnter={el => { el.currentTarget.style.borderColor = `${e.color}35`; el.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={el => { el.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; el.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: e.color, flexShrink: 0 }} />
                <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 800, color: '#fff', margin: 0 }}>{e.area}</h3>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {e.tags.map((tag, j) => (
                  <span key={j} style={{ padding: '4px 10px', borderRadius: 7, background: `${e.color}0e`, border: `1px solid ${e.color}22`, color: `${e.color}cc`, fontSize: 11, fontFamily: "'Space Mono',monospace" }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HIRING CTA */}
      <section style={{ maxWidth: 1100, margin: '0 auto', paddingBottom: 100 }}>
        <div style={{ position: 'relative', background: 'linear-gradient(135deg,rgba(139,92,246,0.09) 0%,rgba(59,130,246,0.06) 100%)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 24, padding: 'clamp(40px,6vw,72px) clamp(24px,5%,64px)', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-30%', right: '-10%', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,92,246,0.08),transparent 65%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-20%', left: '10%',  width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle,rgba(59,130,246,0.07),transparent 65%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 40, alignItems: 'center' }}>
            <div>
              <span style={{ display: 'inline-block', padding: '3px 12px', borderRadius: 999, border: '1px solid #8B5CF640', background: '#8B5CF610', color: '#8B5CF6', fontSize: 10, fontFamily: "'Space Mono',monospace", letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600, marginBottom: 18 }}>
                We're Hiring
              </span>
              <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 900, color: '#fff', margin: '0 0 16px', letterSpacing: -1, lineHeight: 1.15 }}>
                Want to build<br />
                <span style={{ color: '#8B5CF6' }}>great things with us?</span>
              </h2>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, margin: '0 0 28px', maxWidth: 400 }}>
                We're always looking for sharp engineers, security researchers, and designers who care deeply about their craft. Remote-friendly. Async-first.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link to="/contact" className="btn-primary" style={{ padding: '13px 28px', background: '#8B5CF6', color: '#000', borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
                  Send Your CV →
                </Link>
                <Link to="/contact" className="btn-outline" style={{ padding: '13px 24px', fontSize: 14, borderRadius: 12, textDecoration: 'none', display: 'inline-block' }}>
                  Learn More
                </Link>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: "'Space Mono',monospace", letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 }}>Open Roles</div>
              {[
                { role: 'React / Node.js Developer',   type: 'Remote · Full-time',  color: '#3B82F6' },
                { role: 'UI/UX Designer',              type: 'Remote · Part-time',  color: '#A855F7' },
                { role: 'Sales Executive',             type: 'Remote · Full-time',  color: '#8B5CF6' },
                { role: 'Digital Marketing Specialist',type: 'Remote · Part-time',  color: '#F59E0B' },
              ].map((job, i) => (
                <div key={i}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, gap: 12, transition: 'all 0.2s', cursor: 'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${job.color}35`; e.currentTarget.style.background = `${job.color}08`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                >
                  <div>
                    <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 3 }}>{job.role}</div>
                    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,0.32)' }}>{job.type}</div>
                  </div>
                  <span style={{ color: job.color, fontSize: 16, flexShrink: 0 }}>→</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
    </>
  );
}