import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

// Ensure data directory exists
const dataDir = path.resolve('./data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = process.env.DATABASE_PATH || path.join(dataDir, 'leadscan.db');

let db;

// Initialize database
export async function initDatabase() {
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Enable WAL mode for better performance
  await db.run('PRAGMA journal_mode = WAL');

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      password_hash TEXT,
      workspace_id TEXT,
      role TEXT DEFAULT 'user',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS workspaces (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS campaigns (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      niche TEXT,
      location TEXT,
      status TEXT DEFAULT 'active',
      leads_found INTEGER DEFAULT 0,
      leads_verified INTEGER DEFAULT 0,
      sources TEXT,
      filters TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      last_run TEXT,
      workspace_id TEXT,
      FOREIGN KEY (workspace_id) REFERENCES workspaces(id)
    );

    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      company TEXT,
      email TEXT,
      phone TEXT,
      whatsapp INTEGER DEFAULT 0,
      score INTEGER DEFAULT 0,
      is_verified INTEGER DEFAULT 0,
      source TEXT,
      website TEXT,
      employee_count TEXT,
      revenue_range TEXT,
      tech_stack TEXT,
      social_profiles TEXT,
      lat REAL,
      lng REAL,
      assigned_to TEXT,
      status TEXT DEFAULT 'new',
      invoice_due TEXT,
      avg_ticket REAL,
      rating REAL,
      campaign_id TEXT,
      capital_social REAL,
      natureza_juridica TEXT,
      partners TEXT,
      inicio_atividade TEXT,
      situacao TEXT,
      whatsapp_number TEXT,
      street TEXT,
      number_complement TEXT,
      neighborhood TEXT,
      zip_code TEXT,
      city_state TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
    );

    CREATE TABLE IF NOT EXISTS schedules (
      id TEXT PRIMARY KEY,
      lead_id TEXT NOT NULL,
      lead_name TEXT,
      date TEXT,
      hour TEXT,
      status TEXT DEFAULT 'pending',
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (lead_id) REFERENCES leads(id)
    );

    CREATE TABLE IF NOT EXISTS proposals (
      id TEXT PRIMARY KEY,
      lead_id TEXT NOT NULL,
      lead_name TEXT,
      products TEXT,
      discount REAL DEFAULT 0,
      total REAL,
      status TEXT DEFAULT 'draft',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (lead_id) REFERENCES leads(id)
    );

    CREATE TABLE IF NOT EXISTS message_variants (
      id TEXT PRIMARY KEY,
      campaign_id TEXT NOT NULL,
      name TEXT,
      text TEXT,
      sent INTEGER DEFAULT 0,
      opened INTEGER DEFAULT 0,
      is_winner INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
    );

    CREATE TABLE IF NOT EXISTS email_logs (
      id TEXT PRIMARY KEY,
      lead_id TEXT,
      lead_name TEXT,
      recipient TEXT NOT NULL,
      subject TEXT,
      status TEXT DEFAULT 'sent',
      error TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (lead_id) REFERENCES leads(id)
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_leads_campaign ON leads(campaign_id);
    CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
    CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(score);
    CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(score);
    CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
  `);

  // Migration: Add notes column if it doesn't exist (safe migration for SQLite)
  try {
    const tableInfo = await db.all("PRAGMA table_info(leads)");
    const hasNotes = tableInfo.some(col => col.name === 'notes');
    if (!hasNotes) {
      console.log('Migrating: Adding notes column to leads table...');
      await db.run("ALTER TABLE leads ADD COLUMN notes TEXT");
    }
  } catch (error) {
    console.error('Migration error (notes column):', error);
  }

  console.log('✅ Database initialized successfully');
}

// ==================== LEADS CRUD ====================

export async function createLead(lead) {
  const id = lead.id || uuidv4();
  await db.run(`
    INSERT INTO leads (id, name, company, email, phone, whatsapp, score, is_verified, source, website, employee_count, revenue_range, tech_stack, social_profiles, lat, lng, assigned_to, status, invoice_due, avg_ticket, rating, campaign_id, capital_social, natureza_juridica, partners, inicio_atividade, situacao, address, whatsapp_number, street, number_complement, neighborhood, zip_code, city_state, notes, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    id,
    lead.name,
    lead.company || null,
    lead.email || null,
    lead.phone || null,
    lead.whatsapp ? 1 : 0,
    lead.score || 0,
    lead.isVerified ? 1 : 0,
    lead.source || null,
    lead.website || null,
    lead.employeeCount || null,
    lead.revenueRange || null,
    JSON.stringify(lead.techStack || []),
    JSON.stringify(lead.socialProfiles || {}),
    lead.lat || null,
    lead.lng || null,
    lead.assignedTo || null,
    lead.status || 'new',
    lead.invoice_due || null,
    lead.avgTicket || null,
    lead.rating || null,
    lead.campaignId || null,
    lead.capitalSocial || null,
    lead.naturezaJuridica || null,
    lead.partners || null,
    lead.inicioAtividade || null,
    lead.situacao || null,
    lead.address || null,
    lead.whatsappNumber || null,
    lead.street || null,
    lead.numberComplement || null,
    lead.neighborhood || null,
    lead.zipCode || null,
    lead.cityState || null,
    lead.notes || null,
    lead.createdAt || new Date().toISOString()
  ]);

  return getLead(id);
}

export async function getLead(id) {
  const row = await db.get('SELECT * FROM leads WHERE id = ?', [id]);
  return row ? mapLeadFromDb(row) : null;
}

export async function listLeads(filters = {}) {
  let query = 'SELECT * FROM leads WHERE 1=1';
  const params = [];

  if (filters.campaignId) {
    query += ' AND campaign_id = ?';
    params.push(filters.campaignId);
  }
  if (filters.status) {
    query += ' AND status = ?';
    params.push(filters.status);
  }
  if (filters.minScore !== undefined) {
    query += ' AND score >= ?';
    params.push(filters.minScore);
  }
  if (filters.source) {
    query += ' AND source = ?';
    params.push(filters.source);
  }
  if (filters.isVerified !== undefined) {
    query += ' AND is_verified = ?';
    params.push(filters.isVerified ? 1 : 0);
  }

  query += ' ORDER BY created_at DESC';

  if (filters.limit) {
    query += ' LIMIT ?';
    params.push(filters.limit);
  }

  const rows = await db.all(query, params);
  return rows.map(mapLeadFromDb);
}

export async function updateLead(id, updates) {
  const fields = [];
  const values = [];

  if (updates.name !== undefined) { fields.push('name = ?'); values.push(updates.name); }
  if (updates.company !== undefined) { fields.push('company = ?'); values.push(updates.company); }
  if (updates.email !== undefined) { fields.push('email = ?'); values.push(updates.email); }
  if (updates.phone !== undefined) { fields.push('phone = ?'); values.push(updates.phone); }
  if (updates.whatsapp !== undefined) { fields.push('whatsapp = ?'); values.push(updates.whatsapp ? 1 : 0); }
  if (updates.score !== undefined) { fields.push('score = ?'); values.push(updates.score); }
  if (updates.isVerified !== undefined) { fields.push('is_verified = ?'); values.push(updates.isVerified ? 1 : 0); }
  if (updates.source !== undefined) { fields.push('source = ?'); values.push(updates.source); }
  if (updates.status !== undefined) { fields.push('status = ?'); values.push(updates.status); }
  if (updates.assignedTo !== undefined) { fields.push('assigned_to = ?'); values.push(updates.assignedTo); }
  if (updates.avgTicket !== undefined) { fields.push('avg_ticket = ?'); values.push(updates.avgTicket); }
  if (updates.techStack !== undefined) { fields.push('tech_stack = ?'); values.push(JSON.stringify(updates.techStack)); }
  if (updates.capitalSocial !== undefined) { fields.push('capital_social = ?'); values.push(updates.capitalSocial); }
  if (updates.naturezaJuridica !== undefined) { fields.push('natureza_juridica = ?'); values.push(updates.naturezaJuridica); }
  if (updates.partners !== undefined) { fields.push('partners = ?'); values.push(updates.partners); }
  if (updates.inicioAtividade !== undefined) { fields.push('inicio_atividade = ?'); values.push(updates.inicioAtividade); }
  if (updates.situacao !== undefined) { fields.push('situacao = ?'); values.push(updates.situacao); }
  if (updates.address !== undefined) { fields.push('address = ?'); values.push(updates.address); }
  if (updates.whatsappNumber !== undefined) { fields.push('whatsapp_number = ?'); values.push(updates.whatsappNumber); }
  if (updates.street !== undefined) { fields.push('street = ?'); values.push(updates.street); }
  if (updates.numberComplement !== undefined) { fields.push('number_complement = ?'); values.push(updates.numberComplement); }
  if (updates.neighborhood !== undefined) { fields.push('neighborhood = ?'); values.push(updates.neighborhood); }
  if (updates.zipCode !== undefined) { fields.push('zip_code = ?'); values.push(updates.zipCode); }
  if (updates.zipCode !== undefined) { fields.push('zip_code = ?'); values.push(updates.zipCode); }
  if (updates.cityState !== undefined) { fields.push('city_state = ?'); values.push(updates.cityState); }
  if (updates.notes !== undefined) { fields.push('notes = ?'); values.push(updates.notes); }

  if (fields.length === 0) return getLead(id);

  values.push(id);
  await db.run(`UPDATE leads SET ${fields.join(', ')} WHERE id = ?`, values);

  return getLead(id);
}

export async function deleteLead(id) {
  const result = await db.run('DELETE FROM leads WHERE id = ?', [id]);
  return result.changes > 0;
}

function mapLeadFromDb(row) {
  return {
    id: row.id,
    name: row.name,
    company: row.company,
    email: row.email,
    phone: row.phone,
    whatsapp: Boolean(row.whatsapp),
    score: row.score,
    isVerified: Boolean(row.is_verified),
    source: row.source,
    website: row.website,
    employeeCount: row.employee_count,
    revenueRange: row.revenue_range,
    techStack: JSON.parse(row.tech_stack || '[]'),
    socialProfiles: JSON.parse(row.social_profiles || '{}'),
    lat: row.lat,
    lng: row.lng,
    assignedTo: row.assigned_to,
    status: row.status,
    invoiceDue: row.invoice_due,
    avgTicket: row.avg_ticket,
    rating: row.rating,
    campaignId: row.campaign_id,
    capitalSocial: row.capital_social,
    naturezaJuridica: row.natureza_juridica,
    partners: row.partners,
    inicioAtividade: row.inicio_atividade,
    situacao: row.situacao,
    address: row.address,
    whatsappNumber: row.whatsapp_number,
    street: row.street,
    numberComplement: row.number_complement,
    neighborhood: row.neighborhood,
    zipCode: row.zip_code,
    zipCode: row.zip_code,
    cityState: row.city_state,
    notes: row.notes,
    createdAt: row.created_at
  };
}

// ==================== CAMPAIGNS CRUD ====================

export async function createCampaign(campaign) {
  const id = campaign.id || uuidv4();
  await db.run(`
    INSERT INTO campaigns (id, name, niche, location, status, leads_found, leads_verified, sources, filters, workspace_id, created_at, last_run)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    id,
    campaign.name,
    campaign.niche || null,
    campaign.location || null,
    campaign.status || 'active',
    campaign.leadsFound || 0,
    campaign.leadsVerified || 0,
    JSON.stringify(campaign.sources || []),
    JSON.stringify(campaign.filters || {}),
    campaign.workspaceId || null,
    campaign.createdAt || new Date().toISOString(),
    campaign.lastRun || null
  ]);

  return getCampaign(id);
}

export async function getCampaign(id) {
  const row = await db.get('SELECT * FROM campaigns WHERE id = ?', [id]);
  return row ? mapCampaignFromDb(row) : null;
}

export async function listCampaigns(filters = {}) {
  let query = 'SELECT * FROM campaigns WHERE 1=1';
  const params = [];

  if (filters.status) {
    query += ' AND status = ?';
    params.push(filters.status);
  }
  if (filters.workspaceId) {
    query += ' AND workspace_id = ?';
    params.push(filters.workspaceId);
  }

  query += ' ORDER BY created_at DESC';

  const rows = await db.all(query, params);
  return rows.map(mapCampaignFromDb);
}

export async function updateCampaign(id, updates) {
  const fields = [];
  const values = [];

  if (updates.name !== undefined) { fields.push('name = ?'); values.push(updates.name); }
  if (updates.niche !== undefined) { fields.push('niche = ?'); values.push(updates.niche); }
  if (updates.location !== undefined) { fields.push('location = ?'); values.push(updates.location); }
  if (updates.status !== undefined) { fields.push('status = ?'); values.push(updates.status); }
  if (updates.leadsFound !== undefined) { fields.push('leads_found = ?'); values.push(updates.leadsFound); }
  if (updates.leadsVerified !== undefined) { fields.push('leads_verified = ?'); values.push(updates.leadsVerified); }
  if (updates.sources !== undefined) { fields.push('sources = ?'); values.push(JSON.stringify(updates.sources)); }
  if (updates.filters !== undefined) { fields.push('filters = ?'); values.push(JSON.stringify(updates.filters)); }
  if (updates.lastRun !== undefined) { fields.push('last_run = ?'); values.push(updates.lastRun); }

  if (fields.length === 0) return getCampaign(id);

  values.push(id);
  await db.run(`UPDATE campaigns SET ${fields.join(', ')} WHERE id = ?`, values);

  return getCampaign(id);
}

export async function deleteCampaign(id) {
  const result = await db.run('DELETE FROM campaigns WHERE id = ?', [id]);
  return result.changes > 0;
}

function mapCampaignFromDb(row) {
  return {
    id: row.id,
    name: row.name,
    niche: row.niche,
    location: row.location,
    status: row.status,
    leadsFound: row.leads_found,
    leadsVerified: row.leads_verified,
    sources: JSON.parse(row.sources || '[]'),
    filters: JSON.parse(row.filters || '{}'),
    workspaceId: row.workspace_id,
    createdAt: row.created_at,
    lastRun: row.last_run
  };
}

// ==================== USERS CRUD ====================

export async function createUser(user) {
  const id = user.id || uuidv4();
  await db.run(`
    INSERT INTO users (id, email, name, password_hash, workspace_id, role)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [
    id,
    user.email,
    user.name || null,
    user.passwordHash || null,
    user.workspaceId || null,
    user.role || 'user'
  ]);

  return getUser(id);
}

export async function getUser(id) {
  const row = await db.get('SELECT * FROM users WHERE id = ?', [id]);
  return row ? mapUserFromDb(row) : null;
}

export async function getUserByEmail(email) {
  const row = await db.get('SELECT * FROM users WHERE email = ?', [email]);
  return row ? mapUserFromDb(row) : null;
}

export async function listUsers(filters = {}) {
  let query = 'SELECT * FROM users WHERE 1=1';
  const params = [];

  if (filters.workspaceId) {
    query += ' AND workspace_id = ?';
    params.push(filters.workspaceId);
  }

  const rows = await db.all(query, params);
  return rows.map(mapUserFromDb);
}

function mapUserFromDb(row) {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    workspaceId: row.workspace_id,
    role: row.role,
    createdAt: row.created_at
  };
}

// ==================== SCHEDULES CRUD ====================

export async function createSchedule(schedule) {
  const id = schedule.id || uuidv4();
  await db.run(`
    INSERT INTO schedules (id, lead_id, lead_name, date, hour, status, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [
    id,
    schedule.leadId,
    schedule.leadName || null,
    schedule.date,
    schedule.hour,
    schedule.status || 'pending',
    schedule.notes || null
  ]);

  return getSchedule(id);
}

export async function getSchedule(id) {
  const row = await db.get('SELECT * FROM schedules WHERE id = ?', [id]);
  return row ? mapScheduleFromDb(row) : null;
}

export async function listSchedules(filters = {}) {
  let query = 'SELECT * FROM schedules WHERE 1=1';
  const params = [];

  if (filters.leadId) {
    query += ' AND lead_id = ?';
    params.push(filters.leadId);
  }
  if (filters.status) {
    query += ' AND status = ?';
    params.push(filters.status);
  }
  if (filters.date) {
    query += ' AND date = ?';
    params.push(filters.date);
  }

  query += ' ORDER BY date ASC, hour ASC';

  const rows = await db.all(query, params);
  return rows.map(mapScheduleFromDb);
}

export async function updateSchedule(id, updates) {
  const fields = [];
  const values = [];

  if (updates.date !== undefined) { fields.push('date = ?'); values.push(updates.date); }
  if (updates.hour !== undefined) { fields.push('hour = ?'); values.push(updates.hour); }
  if (updates.status !== undefined) { fields.push('status = ?'); values.push(updates.status); }
  if (updates.notes !== undefined) { fields.push('notes = ?'); values.push(updates.notes); }

  if (fields.length === 0) return getSchedule(id);

  values.push(id);
  await db.run(`UPDATE schedules SET ${fields.join(', ')} WHERE id = ?`, values);

  return getSchedule(id);
}

export async function deleteSchedule(id) {
  const result = await db.run('DELETE FROM schedules WHERE id = ?', [id]);
  return result.changes > 0;
}

function mapScheduleFromDb(row) {
  return {
    id: row.id,
    leadId: row.lead_id,
    leadName: row.lead_name,
    date: row.date,
    hour: row.hour,
    status: row.status,
    notes: row.notes,
    createdAt: row.created_at
  };
}

// ==================== PROPOSALS CRUD ====================

export async function createProposal(proposal) {
  const id = proposal.id || uuidv4();
  await db.run(`
    INSERT INTO proposals (id, lead_id, lead_name, products, discount, total, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [
    id,
    proposal.leadId,
    proposal.leadName || null,
    JSON.stringify(proposal.products || []),
    proposal.discount || 0,
    proposal.total || 0,
    proposal.status || 'draft'
  ]);

  return getProposal(id);
}

export async function getProposal(id) {
  const row = await db.get('SELECT * FROM proposals WHERE id = ?', [id]);
  return row ? mapProposalFromDb(row) : null;
}

export async function listProposals(filters = {}) {
  let query = 'SELECT * FROM proposals WHERE 1=1';
  const params = [];

  if (filters.leadId) {
    query += ' AND lead_id = ?';
    params.push(filters.leadId);
  }
  if (filters.status) {
    query += ' AND status = ?';
    params.push(filters.status);
  }

  query += ' ORDER BY created_at DESC';

  const rows = await db.all(query, params);
  return rows.map(mapProposalFromDb);
}

export async function updateProposal(id, updates) {
  const fields = [];
  const values = [];

  if (updates.status !== undefined) { fields.push('status = ?'); values.push(updates.status); }
  if (updates.total !== undefined) { fields.push('total = ?'); values.push(updates.total); }
  if (updates.discount !== undefined) { fields.push('discount = ?'); values.push(updates.discount); }

  if (fields.length === 0) return getProposal(id);

  values.push(id);
  await db.run(`UPDATE proposals SET ${fields.join(', ')} WHERE id = ?`, values);

  return getProposal(id);
}

function mapProposalFromDb(row) {
  return {
    id: row.id,
    leadId: row.lead_id,
    leadName: row.lead_name,
    products: JSON.parse(row.products || '[]'),
    discount: row.discount,
    total: row.total,
    status: row.status,
    createdAt: row.created_at
  };
}

// ==================== MESSAGE VARIANTS CRUD ====================

export async function createMessageVariant(variant) {
  const id = variant.id || uuidv4();
  await db.run(`
    INSERT INTO message_variants (id, campaign_id, name, text, sent, opened, is_winner)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [
    id,
    variant.campaignId,
    variant.name || null,
    variant.text || null,
    variant.sent || 0,
    variant.opened || 0,
    variant.isWinner ? 1 : 0
  ]);

  return getMessageVariant(id);
}

export async function getMessageVariant(id) {
  const row = await db.get('SELECT * FROM message_variants WHERE id = ?', [id]);
  return row ? mapMessageVariantFromDb(row) : null;
}

export async function listMessageVariants(filters = {}) {
  let query = 'SELECT * FROM message_variants WHERE 1=1';
  const params = [];

  if (filters.campaignId) {
    query += ' AND campaign_id = ?';
    params.push(filters.campaignId);
  }

  query += ' ORDER BY created_at DESC';

  const rows = await db.all(query, params);
  return rows.map(mapMessageVariantFromDb);
}

export async function updateMessageVariant(id, updates) {
  const fields = [];
  const values = [];

  if (updates.name !== undefined) { fields.push('name = ?'); values.push(updates.name); }
  if (updates.text !== undefined) { fields.push('text = ?'); values.push(updates.text); }
  if (updates.sent !== undefined) { fields.push('sent = ?'); values.push(updates.sent); }
  if (updates.opened !== undefined) { fields.push('opened = ?'); values.push(updates.opened); }
  if (updates.isWinner !== undefined) { fields.push('is_winner = ?'); values.push(updates.isWinner ? 1 : 0); }

  if (fields.length === 0) return getMessageVariant(id);

  values.push(id);
  await db.run(`UPDATE message_variants SET ${fields.join(', ')} WHERE id = ?`, values);

  return getMessageVariant(id);
}

export async function deleteMessageVariant(id) {
  const result = await db.run('DELETE FROM message_variants WHERE id = ?', [id]);
  return result.changes > 0;
}

function mapMessageVariantFromDb(row) {
  return {
    id: row.id,
    campaignId: row.campaign_id,
    name: row.name,
    text: row.text,
    sent: row.sent,
    opened: row.opened,
    isWinner: Boolean(row.is_winner),
    createdAt: row.created_at
  };
}

// ==================== STATS ====================

export async function getDashboardStats() {
  const totalLeads = (await db.get('SELECT COUNT(*) as count FROM leads')).count;
  const verifiedLeads = (await db.get('SELECT COUNT(*) as count FROM leads WHERE is_verified = 1')).count;
  const avgScore = (await db.get('SELECT AVG(score) as avg FROM leads')).avg || 0;
  const activeCampaigns = (await db.get("SELECT COUNT(*) as count FROM campaigns WHERE status = 'active'")).count;

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const leadsThisWeek = (await db.get('SELECT COUNT(*) as count FROM leads WHERE created_at >= ?', [weekAgo.toISOString()])).count;

  const wonLeads = (await db.get("SELECT COUNT(*) as count FROM leads WHERE status = 'won'")).count;
  const totalWithStatus = (await db.get("SELECT COUNT(*) as count FROM leads WHERE status IS NOT NULL")).count;
  const conversionRate = totalWithStatus > 0 ? (wonLeads / totalWithStatus) * 100 : 0;

  const avgTicketResult = await db.get('SELECT AVG(avg_ticket) as avg FROM leads WHERE avg_ticket IS NOT NULL');
  const unansweredLeads = (await db.get("SELECT COUNT(*) as count FROM leads WHERE status = 'new'")).count;
  const moneyLeft = unansweredLeads * (avgTicketResult.avg || 0) * 0.67;

  // Credit calculation
  const planCreditsSetting = await getSetting('plan_credits', 1500);
  const planCredits = parseInt(planCreditsSetting) || 1500;
  const usedCredits = totalLeads;
  const remainingCredits = Math.max(0, planCredits - usedCredits);

  return {
    totalLeads,
    verifiedLeads,
    avgScore: Math.round(avgScore),
    activeCampaigns,
    leadsThisWeek,
    conversionRate: Math.round(conversionRate * 10) / 10,
    moneyLeft: Math.round(moneyLeft),
    planCredits,
    usedCredits,
    remainingCredits
  };
}

export async function getLeadsBySource() {
  const query = `
    SELECT source, COUNT(*) as count 
    FROM leads 
    WHERE source IS NOT NULL 
    GROUP BY source 
    ORDER BY count DESC
  `;
  return db.all(query);
}

export async function getScoreDistribution() {
  const ranges = [
    { range: '0-20', min: 0, max: 20 },
    { range: '21-40', min: 21, max: 40 },
    { range: '41-60', min: 41, max: 60 },
    { range: '61-80', min: 61, max: 80 },
    { range: '81-100', min: 81, max: 100 }
  ];

  const results = [];
  for (const r of ranges) {
    const count = (await db.get('SELECT COUNT(*) as count FROM leads WHERE score >= ? AND score <= ?', [r.min, r.max])).count;
    results.push({ range: r.range, count });
  }
  return results;
}

export async function getLeadsTrend() {
  const query = `
    SELECT strftime('%Y-%m-%d', created_at) as date, COUNT(*) as count
    FROM leads
    GROUP BY date
    ORDER BY date ASC
    LIMIT 30
  `;
  return db.all(query);
}


// ==================== EMAIL LOGS ====================

export async function createEmailLog(log) {
  const id = log.id || uuidv4();
  await db.run(`
    INSERT INTO email_logs (id, lead_id, lead_name, recipient, subject, status, error)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [
    id,
    log.leadId || null,
    log.leadName || null,
    log.recipient,
    log.subject || null,
    log.status || 'sent',
    log.error || null
  ]);
  return id;
}

export async function listEmailLogs(limit = 50) {
  const rows = await db.all('SELECT * FROM email_logs ORDER BY created_at DESC LIMIT ?', [limit]);
  return rows.map(row => ({
    id: row.id,
    leadId: row.lead_id,
    leadName: row.lead_name,
    recipient: row.recipient,
    subject: row.subject,
    status: row.status,
    error: row.error,
    createdAt: row.created_at
  }));
}

// ==================== LEAD DETAILS ====================

export async function getLeadWithDetails(id) {
  const lead = await getLead(id);
  if (!lead) return null;

  const schedules = await listSchedules({ leadId: id });
  const proposals = await listProposals({ leadId: id });
  const emailLogs = await db.all('SELECT * FROM email_logs WHERE lead_id = ? ORDER BY created_at DESC', [id]);

  return {
    ...lead,
    schedules,
    proposals,
    emailLogs: emailLogs.map(row => ({
      id: row.id,
      recipient: row.recipient,
      subject: row.subject,
      status: row.status,
      createdAt: row.created_at
    }))
  };
}

// ==================== SETTINGS ====================

export async function getSetting(key, defaultValue = null) {
  const row = await db.get('SELECT value FROM settings WHERE key = ?', [key]);
  if (!row) return defaultValue;
  try {
    return JSON.parse(row.value);
  } catch (e) {
    return row.value;
  }
}

export async function setSetting(key, value) {
  const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
  await db.run(`
    INSERT INTO settings (key, value)
    VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `, [key, stringValue]);
  return value;
}

export async function listSettings() {
  const rows = await db.all('SELECT * FROM settings');
  const settings = {};
  rows.forEach(row => {
    try {
      settings[row.key] = JSON.parse(row.value);
    } catch (e) {
      settings[row.key] = row.value;
    }
  });
  return settings;
}

export default db;
