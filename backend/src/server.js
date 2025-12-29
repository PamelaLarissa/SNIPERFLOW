import express from 'express';
import cors from 'cors';
import {
  initDatabase,
  createLead, getLead, listLeads, updateLead, deleteLead,
  createCampaign, getCampaign, listCampaigns, updateCampaign, deleteCampaign,
  createUser, getUser, getUserByEmail, listUsers,
  createSchedule, getSchedule, listSchedules, updateSchedule, deleteSchedule,
  createProposal, getProposal, listProposals,
  getDashboardStats, getLeadsBySource, getScoreDistribution
} from './database.js';
import { seedDatabase } from './seed.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database on startup
initDatabase();

// Seed with initial data if empty
seedDatabase();

// ==================== HEALTH CHECK ====================
app.get('/health', (req, res) => {
  res.json({ status: 'ok', db: 'sqlite', timestamp: new Date().toISOString() });
});

// ==================== LEADS ROUTES ====================
app.get('/api/leads', (req, res) => {
  try {
    const filters = {
      campaignId: req.query.campaignId,
      status: req.query.status,
      minScore: req.query.minScore ? parseInt(req.query.minScore) : undefined,
      source: req.query.source,
      isVerified: req.query.isVerified === 'true' ? true : req.query.isVerified === 'false' ? false : undefined,
      limit: req.query.limit ? parseInt(req.query.limit) : undefined
    };
    const leads = listLeads(filters);
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/leads/:id', (req, res) => {
  try {
    const lead = getLead(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/leads', (req, res) => {
  try {
    const lead = createLead(req.body);
    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/leads/:id', (req, res) => {
  try {
    const lead = updateLead(req.params.id, req.body);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/leads/:id', (req, res) => {
  try {
    const deleted = deleteLead(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Lead not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== CAMPAIGNS ROUTES ====================
app.get('/api/campaigns', (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      workspaceId: req.query.workspaceId
    };
    const campaigns = listCampaigns(filters);
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/campaigns/:id', (req, res) => {
  try {
    const campaign = getCampaign(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/campaigns', (req, res) => {
  try {
    const campaign = createCampaign(req.body);
    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/campaigns/:id', (req, res) => {
  try {
    const campaign = updateCampaign(req.params.id, req.body);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/campaigns/:id', (req, res) => {
  try {
    const deleted = deleteCampaign(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Campaign not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== USERS ROUTES ====================
app.get('/api/users', (req, res) => {
  try {
    const users = listUsers({ workspaceId: req.query.workspaceId });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users/:id', (req, res) => {
  try {
    const user = getUser(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users/email/:email', (req, res) => {
  try {
    const user = getUserByEmail(req.params.email);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users', (req, res) => {
  try {
    const user = createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== SCHEDULES ROUTES ====================
app.get('/api/schedules', (req, res) => {
  try {
    const filters = {
      leadId: req.query.leadId,
      status: req.query.status,
      date: req.query.date
    };
    const schedules = listSchedules(filters);
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/schedules/:id', (req, res) => {
  try {
    const schedule = getSchedule(req.params.id);
    if (!schedule) return res.status(404).json({ error: 'Schedule not found' });
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/schedules', (req, res) => {
  try {
    const schedule = createSchedule(req.body);
    res.status(201).json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/schedules/:id', (req, res) => {
  try {
    const schedule = updateSchedule(req.params.id, req.body);
    if (!schedule) return res.status(404).json({ error: 'Schedule not found' });
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/schedules/:id', (req, res) => {
  try {
    const deleted = deleteSchedule(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Schedule not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== PROPOSALS ROUTES ====================
app.get('/api/proposals', (req, res) => {
  try {
    const filters = {
      leadId: req.query.leadId,
      status: req.query.status
    };
    const proposals = listProposals(filters);
    res.json(proposals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/proposals/:id', (req, res) => {
  try {
    const proposal = getProposal(req.params.id);
    if (!proposal) return res.status(404).json({ error: 'Proposal not found' });
    res.json(proposal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/proposals', (req, res) => {
  try {
    const proposal = createProposal(req.body);
    res.status(201).json(proposal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== STATS ROUTES ====================
app.get('/api/stats/dashboard', (req, res) => {
  try {
    const stats = getDashboardStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stats/leads-by-source', (req, res) => {
  try {
    const data = getLeadsBySource();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stats/score-distribution', (req, res) => {
  try {
    const data = getScoreDistribution();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 LeadScan365 Backend running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`💾 Database: SQLite (local, free, unlimited)`);
});
