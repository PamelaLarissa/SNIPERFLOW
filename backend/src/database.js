import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

// Ensure data directory exists
const dataDir = path.resolve('./data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = process.env.DATABASE_PATH || path.join(dataDir, 'leadscan.db');
const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Initialize tables
export function initDatabase() {
  db.exec(`
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

    CREATE INDEX IF NOT EXISTS idx_leads_campaign ON leads(campaign_id);
    CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
    CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(score);
    CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
  `);

  console.log('✅ Database initialized successfully');
}

// ==================== LEADS CRUD ====================

export function createLead(lead) {
  const id = lead.id || uuidv4();
  const stmt = db.prepare(`
    INSERT INTO leads (id, name, company, email, phone, whatsapp, score, is_verified, source, website, employee_count, revenue_range, tech_stack, social_profiles, lat, lng, assigned_to, status, invoice_due, avg_ticket, rating, campaign_id, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(
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
    lead.invoiceDue || null,
    lead.avgTicket || null,
    lead.rating || null,
    lead.campaignId || null,
    lead.createdAt || new Date().toISOString()
  );
  
  return getLead(id);
}

export function getLead(id) {
  const stmt = db.prepare('SELECT * FROM leads WHERE id = ?');
  const row = stmt.get(id);
  return row ? mapLeadFromDb(row) : null;
}

export function listLeads(filters = {}) {
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
  
  const stmt = db.prepare(query);
  const rows = stmt.all(...params);
  return rows.map(mapLeadFromDb);
}

export function updateLead(id, updates) {
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
  
  if (fields.length === 0) return getLead(id);
  
  values.push(id);
  const stmt = db.prepare(`UPDATE leads SET ${fields.join(', ')} WHERE id = ?`);
  stmt.run(...values);
  
  return getLead(id);
}

export function deleteLead(id) {
  const stmt = db.prepare('DELETE FROM leads WHERE id = ?');
  const result = stmt.run(id);
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
    createdAt: row.created_at
  };
}

// ==================== CAMPAIGNS CRUD ====================

export function createCampaign(campaign) {
  const id = campaign.id || uuidv4();
  const stmt = db.prepare(`
    INSERT INTO campaigns (id, name, niche, location, status, leads_found, leads_verified, sources, filters, workspace_id, created_at, last_run)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(
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
  );
  
  return getCampaign(id);
}

export function getCampaign(id) {
  const stmt = db.prepare('SELECT * FROM campaigns WHERE id = ?');
  const row = stmt.get(id);
  return row ? mapCampaignFromDb(row) : null;
}

export function listCampaigns(filters = {}) {
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
  
  const stmt = db.prepare(query);
  const rows = stmt.all(...params);
  return rows.map(mapCampaignFromDb);
}

export function updateCampaign(id, updates) {
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
  const stmt = db.prepare(`UPDATE campaigns SET ${fields.join(', ')} WHERE id = ?`);
  stmt.run(...values);
  
  return getCampaign(id);
}

export function deleteCampaign(id) {
  const stmt = db.prepare('DELETE FROM campaigns WHERE id = ?');
  const result = stmt.run(id);
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

export function createUser(user) {
  const id = user.id || uuidv4();
  const stmt = db.prepare(`
    INSERT INTO users (id, email, name, password_hash, workspace_id, role)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    id,
    user.email,
    user.name || null,
    user.passwordHash || null,
    user.workspaceId || null,
    user.role || 'user'
  );
  
  return getUser(id);
}

export function getUser(id) {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  const row = stmt.get(id);
  return row ? mapUserFromDb(row) : null;
}

export function getUserByEmail(email) {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  const row = stmt.get(email);
  return row ? mapUserFromDb(row) : null;
}

export function listUsers(filters = {}) {
  let query = 'SELECT * FROM users WHERE 1=1';
  const params = [];
  
  if (filters.workspaceId) {
    query += ' AND workspace_id = ?';
    params.push(filters.workspaceId);
  }
  
  const stmt = db.prepare(query);
  const rows = stmt.all(...params);
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

export function createSchedule(schedule) {
  const id = schedule.id || uuidv4();
  const stmt = db.prepare(`
    INSERT INTO schedules (id, lead_id, lead_name, date, hour, status, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    id,
    schedule.leadId,
    schedule.leadName || null,
    schedule.date,
    schedule.hour,
    schedule.status || 'pending',
    schedule.notes || null
  );
  
  return getSchedule(id);
}

export function getSchedule(id) {
  const stmt = db.prepare('SELECT * FROM schedules WHERE id = ?');
  const row = stmt.get(id);
  return row ? mapScheduleFromDb(row) : null;
}

export function listSchedules(filters = {}) {
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
  
  const stmt = db.prepare(query);
  const rows = stmt.all(...params);
  return rows.map(mapScheduleFromDb);
}

export function updateSchedule(id, updates) {
  const fields = [];
  const values = [];
  
  if (updates.date !== undefined) { fields.push('date = ?'); values.push(updates.date); }
  if (updates.hour !== undefined) { fields.push('hour = ?'); values.push(updates.hour); }
  if (updates.status !== undefined) { fields.push('status = ?'); values.push(updates.status); }
  if (updates.notes !== undefined) { fields.push('notes = ?'); values.push(updates.notes); }
  
  if (fields.length === 0) return getSchedule(id);
  
  values.push(id);
  const stmt = db.prepare(`UPDATE schedules SET ${fields.join(', ')} WHERE id = ?`);
  stmt.run(...values);
  
  return getSchedule(id);
}

export function deleteSchedule(id) {
  const stmt = db.prepare('DELETE FROM schedules WHERE id = ?');
  const result = stmt.run(id);
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

export function createProposal(proposal) {
  const id = proposal.id || uuidv4();
  const stmt = db.prepare(`
    INSERT INTO proposals (id, lead_id, lead_name, products, discount, total, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    id,
    proposal.leadId,
    proposal.leadName || null,
    JSON.stringify(proposal.products || []),
    proposal.discount || 0,
    proposal.total || 0,
    proposal.status || 'draft'
  );
  
  return getProposal(id);
}

export function getProposal(id) {
  const stmt = db.prepare('SELECT * FROM proposals WHERE id = ?');
  const row = stmt.get(id);
  return row ? mapProposalFromDb(row) : null;
}

export function listProposals(filters = {}) {
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
  
  const stmt = db.prepare(query);
  const rows = stmt.all(...params);
  return rows.map(mapProposalFromDb);
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

// ==================== STATS ====================

export function getDashboardStats() {
  const totalLeads = db.prepare('SELECT COUNT(*) as count FROM leads').get().count;
  const verifiedLeads = db.prepare('SELECT COUNT(*) as count FROM leads WHERE is_verified = 1').get().count;
  const avgScore = db.prepare('SELECT AVG(score) as avg FROM leads').get().avg || 0;
  const activeCampaigns = db.prepare("SELECT COUNT(*) as count FROM campaigns WHERE status = 'active'").get().count;
  
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const leadsThisWeek = db.prepare('SELECT COUNT(*) as count FROM leads WHERE created_at >= ?').get(weekAgo.toISOString()).count;
  
  const wonLeads = db.prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'won'").get().count;
  const totalWithStatus = db.prepare("SELECT COUNT(*) as count FROM leads WHERE status IS NOT NULL").get().count;
  const conversionRate = totalWithStatus > 0 ? (wonLeads / totalWithStatus) * 100 : 0;
  
  const avgTicketResult = db.prepare('SELECT AVG(avg_ticket) as avg FROM leads WHERE avg_ticket IS NOT NULL').get();
  const unansweredLeads = db.prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'new'").get().count;
  const moneyLeft = unansweredLeads * (avgTicketResult.avg || 0) * 0.67;
  
  return {
    totalLeads,
    verifiedLeads,
    avgScore: Math.round(avgScore),
    activeCampaigns,
    leadsThisWeek,
    conversionRate: Math.round(conversionRate * 10) / 10,
    moneyLeft: Math.round(moneyLeft)
  };
}

export function getLeadsBySource() {
  const stmt = db.prepare(`
    SELECT source, COUNT(*) as count 
    FROM leads 
    WHERE source IS NOT NULL 
    GROUP BY source 
    ORDER BY count DESC
  `);
  return stmt.all();
}

export function getScoreDistribution() {
  const ranges = [
    { range: '0-20', min: 0, max: 20 },
    { range: '21-40', min: 21, max: 40 },
    { range: '41-60', min: 41, max: 60 },
    { range: '61-80', min: 61, max: 80 },
    { range: '81-100', min: 81, max: 100 }
  ];
  
  return ranges.map(r => {
    const count = db.prepare('SELECT COUNT(*) as count FROM leads WHERE score >= ? AND score <= ?').get(r.min, r.max).count;
    return { range: r.range, count };
  });
}

export default db;
