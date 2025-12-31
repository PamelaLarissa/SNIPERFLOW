import { createLead, createCampaign, createUser, createSchedule, createProposal, listLeads } from './database.js';

export async function seedDatabase() {
  // Check if data already exists
  const existingLeads = await listLeads({ limit: 1 });
  if (existingLeads.length > 0) {
    console.log('📦 Database already has data, skipping seed');
    return;
  }

  console.log('🌱 Seeding database with initial data...');

  // Create admin user
  await createUser({
    id: 'admin-1',
    email: 'admin@leadscan365.com',
    name: 'Admin',
    role: 'admin'
  });

  // Create campaigns
  const campaigns = [
    {
      id: 'campaign-1',
      name: 'Agências de Marketing SP',
      niche: 'Agências de Marketing Digital',
      location: 'São Paulo, SP',
      status: 'active',
      leadsFound: 324,
      leadsVerified: 287,
      sources: ['Google', 'LinkedIn', 'Instagram'],
      filters: { minScore: 60, verifiedOnly: true }
    },
    {
      id: 'campaign-2',
      name: 'E-commerces Brasil',
      niche: 'Lojas Virtuais',
      location: 'Brasil',
      status: 'active',
      leadsFound: 512,
      leadsVerified: 445,
      sources: ['Google', 'Maps', 'YouTube'],
      filters: { minScore: 50 }
    },
    {
      id: 'campaign-3',
      name: 'Startups Tech RJ',
      niche: 'Startups de Tecnologia',
      location: 'Rio de Janeiro, RJ',
      status: 'paused',
      leadsFound: 156,
      leadsVerified: 134,
      sources: ['LinkedIn', 'TikTok']
    },
    {
      id: 'campaign-4',
      name: 'Consultorias Financeiras',
      niche: 'Consultoria Financeira',
      location: 'Brasil',
      status: 'completed',
      leadsFound: 89,
      leadsVerified: 78,
      sources: ['Google', 'LinkedIn']
    }
  ];

  for (const c of campaigns) {
    await createCampaign(c);
  }

  // Create leads
  const leads = [
    {
      id: 'lead-1',
      name: 'Carlos Silva',
      company: 'TechBR Soluções',
      email: 'carlos@techbr.com.br',
      phone: '+55 11 98765-4321',
      whatsapp: true,
      score: 87,
      isVerified: true,
      source: 'Google',
      website: 'techbr.com.br',
      employeeCount: '50-100',
      revenueRange: 'R$ 5M - R$ 10M',
      techStack: ['WordPress', 'WooCommerce', 'Google Analytics'],
      socialProfiles: { linkedin: 'linkedin.com/company/techbr', instagram: '@techbr_oficial' },
      lat: -23.5505,
      lng: -46.6333,
      status: 'qualified',
      avgTicket: 5000,
      assignedTo: 'seller1',
      campaignId: 'campaign-1'
    },
    {
      id: 'lead-2',
      name: 'Ana Rodrigues',
      company: 'Marketing Digital Pro',
      email: 'ana@mkdigitalpro.com',
      phone: '+55 21 99876-5432',
      whatsapp: true,
      score: 92,
      isVerified: true,
      source: 'LinkedIn',
      website: 'mkdigitalpro.com',
      employeeCount: '10-25',
      revenueRange: 'R$ 1M - R$ 5M',
      techStack: ['HubSpot', 'Salesforce', 'Meta Ads'],
      socialProfiles: { linkedin: 'linkedin.com/company/mkdigitalpro', instagram: '@mkdigitalpro', facebook: 'facebook.com/mkdigitalpro' },
      lat: -22.9068,
      lng: -43.1729,
      status: 'proposal',
      avgTicket: 8000,
      assignedTo: 'seller2',
      campaignId: 'campaign-1'
    },
    {
      id: 'lead-3',
      name: 'Roberto Almeida',
      company: 'E-commerce Express',
      email: 'roberto@ecomexpress.com.br',
      phone: '+55 31 98765-1234',
      whatsapp: false,
      score: 73,
      isVerified: true,
      source: 'Google Maps',
      website: 'ecomexpress.com.br',
      employeeCount: '100-200',
      revenueRange: 'R$ 10M - R$ 30M',
      techStack: ['Shopify', 'Klaviyo', 'Google Ads'],
      lat: -19.9167,
      lng: -43.9345,
      status: 'new',
      avgTicket: 12000,
      assignedTo: 'seller1',
      campaignId: 'campaign-2'
    },
    {
      id: 'lead-4',
      name: 'Fernanda Costa',
      company: 'Consultoria FC',
      email: 'fernanda@consultoriafc.com',
      phone: '+55 41 99887-6655',
      whatsapp: true,
      score: 65,
      isVerified: false,
      source: 'Instagram',
      website: 'consultoriafc.com',
      employeeCount: '5-10',
      revenueRange: 'R$ 500K - R$ 1M',
      socialProfiles: { instagram: '@consultoriafc' },
      lat: -25.4284,
      lng: -49.2733,
      status: 'new',
      avgTicket: 3000,
      campaignId: 'campaign-4'
    },
    {
      id: 'lead-5',
      name: 'Paulo Mendes',
      company: 'Startup Lab Brasil',
      email: 'paulo@startuplab.com.br',
      phone: '+55 51 98765-9876',
      whatsapp: true,
      score: 45,
      isVerified: true,
      source: 'TikTok',
      website: 'startuplab.com.br',
      employeeCount: '25-50',
      revenueRange: 'R$ 2M - R$ 5M',
      techStack: ['React', 'Node.js', 'AWS'],
      socialProfiles: { linkedin: 'linkedin.com/company/startuplab', instagram: '@startuplabbr' },
      lat: -30.0346,
      lng: -51.2177,
      status: 'won',
      avgTicket: 6000,
      assignedTo: 'seller2',
      campaignId: 'campaign-3'
    },
    {
      id: 'lead-6',
      name: 'Juliana Torres',
      company: 'Agência Impulso',
      email: 'juliana@agenciaimpulso.com',
      phone: '+55 11 97654-3210',
      whatsapp: true,
      score: 88,
      isVerified: true,
      source: 'YouTube',
      website: 'agenciaimpulso.com',
      employeeCount: '15-30',
      revenueRange: 'R$ 3M - R$ 8M',
      techStack: ['RD Station', 'WordPress', 'Facebook Ads'],
      socialProfiles: { linkedin: 'linkedin.com/company/agenciaimpulso', instagram: '@agenciaimpulso', facebook: 'facebook.com/agenciaimpulso' },
      lat: -23.5505,
      lng: -46.6333,
      status: 'lost',
      avgTicket: 7500,
      assignedTo: 'seller1',
      campaignId: 'campaign-1'
    },
    // Freelance Platform Leads
    {
      id: 'lead-7',
      name: 'Marcos Developer',
      company: 'Freelancer Autônomo',
      email: 'marcos.dev@gmail.com',
      phone: '+55 11 99999-1234',
      whatsapp: true,
      score: 72,
      isVerified: true,
      source: 'Workana',
      website: 'workana.com/freelancer/marcosdev',
      employeeCount: '1',
      revenueRange: 'R$ 50K - R$ 150K',
      techStack: ['React', 'Node.js', 'TypeScript'],
      lat: -23.5505,
      lng: -46.6333,
      status: 'new',
      avgTicket: 2500,
      rating: 3.8
    },
    {
      id: 'lead-8',
      name: 'Carla Designer',
      company: 'Design Studio Carla',
      email: 'carla.ux@hotmail.com',
      phone: '+55 21 98888-5678',
      whatsapp: true,
      score: 68,
      isVerified: true,
      source: '99Freelas',
      website: '99freelas.com.br/carladesigner',
      employeeCount: '1-5',
      revenueRange: 'R$ 80K - R$ 200K',
      techStack: ['Figma', 'Adobe XD', 'Photoshop'],
      lat: -22.9068,
      lng: -43.1729,
      status: 'new',
      avgTicket: 1800,
      rating: 3.5
    },
    {
      id: 'lead-9',
      name: 'Rafael Marketing',
      company: 'Rafa Digital',
      email: 'rafael.mkt@gmail.com',
      phone: '+55 31 97777-4321',
      whatsapp: true,
      score: 75,
      isVerified: false,
      source: 'GetNinjas',
      website: 'getninjas.com.br/rafael-marketing',
      employeeCount: '1',
      revenueRange: 'R$ 60K - R$ 120K',
      techStack: ['Google Ads', 'Meta Ads', 'SEO'],
      lat: -19.9167,
      lng: -43.9345,
      status: 'qualified',
      avgTicket: 2000,
      rating: 4.2
    },
    {
      id: 'lead-10',
      name: 'Luciana Copywriter',
      company: 'Copy Pro BR',
      email: 'luciana.copy@outlook.com',
      phone: '+55 41 96666-8765',
      whatsapp: true,
      score: 70,
      isVerified: true,
      source: 'Fiverr',
      website: 'fiverr.com/lucianacopy',
      employeeCount: '1',
      revenueRange: 'R$ 40K - R$ 100K',
      techStack: ['Copywriting', 'Email Marketing', 'Content'],
      lat: -25.4284,
      lng: -49.2733,
      status: 'new',
      avgTicket: 1500,
      rating: 3.9
    },
    {
      id: 'lead-11',
      name: 'Thiago Fullstack',
      company: 'TDev Solutions',
      email: 'thiago.full@gmail.com',
      phone: '+55 51 95555-2345',
      whatsapp: true,
      score: 78,
      isVerified: true,
      source: 'Upwork',
      website: 'upwork.com/freelancers/thiagodev',
      employeeCount: '1-3',
      revenueRange: 'R$ 100K - R$ 250K',
      techStack: ['Python', 'Django', 'React', 'AWS'],
      lat: -30.0346,
      lng: -51.2177,
      status: 'proposal',
      avgTicket: 4000,
      rating: 3.2
    },
    {
      id: 'lead-12',
      name: 'Amanda VideoMaker',
      company: 'AM Produções',
      email: 'amanda.video@gmail.com',
      phone: '+55 11 94444-6789',
      whatsapp: true,
      score: 65,
      isVerified: false,
      source: 'Freelancer',
      website: 'freelancer.com/amandavideo',
      employeeCount: '1-2',
      revenueRange: 'R$ 70K - R$ 180K',
      techStack: ['Premiere', 'After Effects', 'DaVinci'],
      lat: -23.5505,
      lng: -46.6333,
      status: 'new',
      avgTicket: 3500,
      rating: 3.7
    }
  ];

  for (const l of leads) {
    await createLead(l);
  }

  // Create schedules
  const schedules = [
    { id: 'sched-1', leadId: 'lead-1', leadName: 'Carlos Silva', date: '2024-01-20', hour: '10:00', status: 'pending', notes: 'Primeira reunião' },
    { id: 'sched-2', leadId: 'lead-2', leadName: 'Ana Rodrigues', date: '2024-01-20', hour: '14:00', status: 'pending', notes: 'Apresentar proposta' },
    { id: 'sched-3', leadId: 'lead-3', leadName: 'Roberto Almeida', date: '2024-01-21', hour: '09:00', status: 'pending' },
    { id: 'sched-4', leadId: 'lead-4', leadName: 'Fernanda Costa', date: '2024-01-22', hour: '11:00', status: 'pending' },
    { id: 'sched-5', leadId: 'lead-5', leadName: 'Paulo Mendes', date: '2024-01-18', hour: '15:00', status: 'completed' }
  ];

  for (const s of schedules) {
    await createSchedule(s);
  }

  // Create proposals
  const proposals = [
    {
      id: 'prop-1',
      leadId: 'lead-1',
      leadName: 'Carlos Silva - TechBR',
      products: [
        { name: 'Plano Pro', price: 197, quantity: 1 },
        { name: 'Setup Inicial', price: 500, quantity: 1 }
      ],
      discount: 10,
      total: 627.30,
      status: 'sent'
    },
    {
      id: 'prop-2',
      leadId: 'lead-2',
      leadName: 'Ana Rodrigues - MK Digital',
      products: [
        { name: 'Plano Enterprise', price: 497, quantity: 1 },
        { name: 'Treinamento', price: 800, quantity: 1 }
      ],
      discount: 15,
      total: 1102.45,
      status: 'accepted'
    }
  ];

  for (const p of proposals) {
    await createProposal(p);
  }

  console.log('✅ Database seeded successfully');
  console.log(`   - ${campaigns.length} campaigns`);
  console.log(`   - ${leads.length} leads`);
  console.log(`   - ${schedules.length} schedules`);
  console.log(`   - ${proposals.length} proposals`);
}

