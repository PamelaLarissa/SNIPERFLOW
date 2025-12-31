import express from 'express';
import cors from 'cors';
import {
  initDatabase,
  createLead, getLead, listLeads, updateLead, deleteLead,
  createCampaign, getCampaign, listCampaigns, updateCampaign, deleteCampaign,
  createUser, getUser, getUserByEmail, listUsers,
  createSchedule, getSchedule, listSchedules, updateSchedule, deleteSchedule,
  createProposal, getProposal, listProposals, updateProposal,
  createMessageVariant, getMessageVariant, listMessageVariants, updateMessageVariant, deleteMessageVariant,
  getDashboardStats, getLeadsBySource, getScoreDistribution, getLeadsTrend,
  listEmailLogs, createEmailLog, getLeadWithDetails,
  getSetting, setSetting, listSettings
} from './database.js';
import { seedDatabase } from './seed.js';
import { emailService } from './emailService.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database on startup
async function startServer() {
  await initDatabase();
  await seedDatabase();

  // ==================== HEALTH CHECK ====================
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', db: 'sqlite', timestamp: new Date().toISOString() });
  });

  // ==================== LEADS ROUTES ====================
  app.get('/api/leads', async (req, res) => {
    try {
      const filters = {
        campaignId: req.query.campaignId,
        status: req.query.status,
        minScore: req.query.minScore ? parseInt(req.query.minScore) : undefined,
        source: req.query.source,
        isVerified: req.query.isVerified === 'true' ? true : req.query.isVerified === 'false' ? false : undefined,
        limit: req.query.limit ? parseInt(req.query.limit) : undefined
      };
      const leads = await listLeads(filters);
      res.json(leads);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/leads/:id', async (req, res) => {
    try {
      const lead = await getLead(req.params.id);
      if (!lead) return res.status(404).json({ error: 'Lead not found' });
      res.json(lead);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/leads', async (req, res) => {
    try {
      const lead = await createLead(req.body);
      res.status(201).json(lead);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/leads/:id', async (req, res) => {
    try {
      const lead = await updateLead(req.params.id, req.body);
      if (!lead) return res.status(404).json({ error: 'Lead not found' });
      res.json(lead);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/leads/:id', async (req, res) => {
    try {
      const deleted = await deleteLead(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Lead not found' });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/leads/:id/details', async (req, res) => {
    try {
      const lead = await getLeadWithDetails(req.params.id);
      if (!lead) return res.status(404).json({ error: 'Lead not found' });
      res.json(lead);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== CAMPAIGNS ROUTES ====================
  app.get('/api/campaigns', async (req, res) => {
    try {
      const filters = {
        status: req.query.status,
        workspaceId: req.query.workspaceId
      };
      const campaigns = await listCampaigns(filters);
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/campaigns/:id', async (req, res) => {
    try {
      const campaign = await getCampaign(req.params.id);
      if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/campaigns', async (req, res) => {
    try {
      const campaign = await createCampaign(req.body);
      res.status(201).json(campaign);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/campaigns/:id', async (req, res) => {
    try {
      const campaign = await updateCampaign(req.params.id, req.body);
      if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/campaigns/:id', async (req, res) => {
    try {
      const deleted = await deleteCampaign(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Campaign not found' });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== USERS ROUTES ====================
  app.get('/api/users', async (req, res) => {
    try {
      const users = await listUsers({ workspaceId: req.query.workspaceId });
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/users/:id', async (req, res) => {
    try {
      const user = await getUser(req.params.id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/users/email/:email', async (req, res) => {
    try {
      const user = await getUserByEmail(req.params.email);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/users', async (req, res) => {
    try {
      const user = await createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== SCHEDULES ROUTES ====================
  app.get('/api/schedules', async (req, res) => {
    try {
      const filters = {
        leadId: req.query.leadId,
        status: req.query.status,
        date: req.query.date
      };
      const schedules = await listSchedules(filters);
      res.json(schedules);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/schedules/:id', async (req, res) => {
    try {
      const schedule = await getSchedule(req.params.id);
      if (!schedule) return res.status(404).json({ error: 'Schedule not found' });
      res.json(schedule);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/schedules', async (req, res) => {
    try {
      const schedule = await createSchedule(req.body);
      res.status(201).json(schedule);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/schedules/:id', async (req, res) => {
    try {
      const schedule = await updateSchedule(req.params.id, req.body);
      if (!schedule) return res.status(404).json({ error: 'Schedule not found' });
      res.json(schedule);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/schedules/:id', async (req, res) => {
    try {
      const deleted = await deleteSchedule(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Schedule not found' });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== PROPOSALS ROUTES ====================
  app.get('/api/proposals', async (req, res) => {
    try {
      const filters = {
        leadId: req.query.leadId,
        status: req.query.status
      };
      const proposals = await listProposals(filters);
      res.json(proposals);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/proposals/:id', async (req, res) => {
    try {
      const proposal = await getProposal(req.params.id);
      if (!proposal) return res.status(404).json({ error: 'Proposal not found' });
      res.json(proposal);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/proposals', async (req, res) => {
    try {
      const proposal = await createProposal(req.body);
      res.status(201).json(proposal);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/proposals/:id', async (req, res) => {
    try {
      const proposal = await updateProposal(req.params.id, req.body);
      if (!proposal) return res.status(404).json({ error: 'Proposal not found' });
      res.json(proposal);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== MESSAGE VARIANTS ROUTES ====================
  app.get('/api/variants', async (req, res) => {
    try {
      const variants = await listMessageVariants({ campaignId: req.query.campaignId });
      res.json(variants);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/variants', async (req, res) => {
    try {
      const variant = await createMessageVariant(req.body);
      res.status(201).json(variant);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/variants/:id', async (req, res) => {
    try {
      const variant = await updateMessageVariant(req.params.id, req.body);
      if (!variant) return res.status(404).json({ error: 'Variant not found' });
      res.json(variant);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/variants/:id', async (req, res) => {
    try {
      const deleted = await deleteMessageVariant(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Variant not found' });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== STATS ROUTES ====================
  app.get('/api/stats/dashboard', async (req, res) => {
    try {
      const stats = await getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/stats/leads-by-source', async (req, res) => {
    try {
      const data = await getLeadsBySource();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/stats/score-distribution', async (req, res) => {
    try {
      const data = await getScoreDistribution();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/stats/leads-trend', async (req, res) => {
    try {
      const data = await getLeadsTrend();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== SETTINGS ROUTES ====================
  app.get('/api/settings', async (req, res) => {
    try {
      const settings = await listSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/settings', async (req, res) => {
    try {
      const { key, value } = req.body;
      await setSetting(key, value);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== WEBHOOK ROUTES ====================
  app.post('/api/webhooks/leads', async (req, res) => {
    try {
      const { name, company, email, phone, source, score, campaignId } = req.body;

      if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
      }

      const lead = await createLead({
        name,
        company: company || '',
        email,
        phone: phone || '',
        whatsapp: !!phone,
        score: score || Math.floor(Math.random() * 40) + 60,
        isVerified: false,
        source: source || 'webhook',
        campaignId: campaignId || null,
        status: 'new',
        createdAt: new Date().toISOString(),
      });

      console.log(`📥 Webhook: New lead received - ${lead.name} (${lead.email})`);
      res.status(201).json({ success: true, lead });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/webhooks/leads/bulk', async (req, res) => {
    try {
      const { leads: leadsData } = req.body;

      if (!Array.isArray(leadsData) || leadsData.length === 0) {
        return res.status(400).json({ error: 'leads array is required' });
      }

      const createdLeads = [];
      const errors = [];

      for (const leadData of leadsData) {
        try {
          if (!leadData.name || !leadData.email) {
            errors.push({ data: leadData, error: 'Name and email are required' });
            continue;
          }

          const lead = await createLead({
            name: leadData.name,
            company: leadData.company || '',
            email: leadData.email,
            phone: leadData.phone || '',
            whatsapp: !!leadData.phone,
            score: leadData.score || Math.floor(Math.random() * 40) + 60,
            isVerified: false,
            source: leadData.source || 'webhook',
            campaignId: leadData.campaignId || null,
            status: 'new',
            createdAt: new Date().toISOString(),
          });
          createdLeads.push(lead);
        } catch (err) {
          errors.push({ data: leadData, error: err.message });
        }
      }

      console.log(`📥 Bulk Webhook: ${createdLeads.length} leads created, ${errors.length} errors`);
      res.status(201).json({
        success: true,
        created: createdLeads.length,
        errors: errors.length,
        leads: createdLeads,
        errorDetails: errors
      });
    } catch (error) {
      console.error('Bulk webhook error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== ENRICHMENT ROUTES ====================
  app.get('/api/enrich/cnpj/:cnpj', async (req, res) => {
    try {
      const { cnpj } = req.params;
      const cleanCNPJ = cnpj.replace(/\D/g, '');

      if (cleanCNPJ.length !== 14) {
        return res.status(400).json({ error: 'Invalid CNPJ format' });
      }

      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCNPJ}`, {
        headers: {
          'User-Agent': 'LeadScan365/1.0.0 (https://github.com/your-repo/prospect-engine)'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`BrasilAPI Error (${response.status}):`, errorText);
        if (response.status === 404) return res.status(404).json({ error: 'CNPJ not found' });
        throw new Error(`Failed to fetch data from BrasilAPI: ${response.status}`);
      }

      const data = await response.json();

      const leadData = {
        name: data.razao_social,
        company: data.nome_fantasia || data.razao_social,
        email: data.email,
        phone: data.ddd_telefone_1,
        location: `${data.municipio} - ${data.uf}`,
        niche: data.cnae_fiscal_descricao,
        address: `${data.logradouro}, ${data.numero} - ${data.bairro}, ${data.cep}`,
        // Additional info
        capital_social: data.capital_social,
        natureza_juridica: data.natureza_juridica,
        porte: data.porte,
        inicio_atividade: data.data_inicio_atividade,
        situacao: data.descricao_situacao_cadastral,
        data_situacao: data.data_situacao_cadastral,
        partners: data.qsa ? data.qsa.map(s => s.nome_socio).join(', ') : '',
        street: data.logradouro,
        number: data.numero,
        complement: data.complemento,
        neighborhood: data.bairro,
        zip_code: data.cep,
        city: data.municipio,
        state: data.uf
      };

      res.json(leadData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== EMAIL ROUTES ====================
  app.post('/api/email/config', async (req, res) => {
    try {
      const config = req.body;
      emailService.configure(config);
      await emailService.verifyConnection();

      // Persist settings
      await setSetting('smtp_config', config);

      res.json({ success: true, message: 'SMTP Configured Successfully' });
    } catch (error) {
      res.status(400).json({ error: 'SMTP Connection Failed: ' + error.message });
    }
  });

  app.get('/api/email/logs', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 50;
      const logs = await listEmailLogs(limit);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/email/send', async (req, res) => {
    try {
      const { to, subject, html, leadId, leadName } = req.body;
      const result = await emailService.sendEmail(to, subject, html);

      // Record log
      await createEmailLog({
        leadId,
        leadName,
        recipient: to,
        subject,
        status: 'sent'
      });

      res.json({ success: true, messageId: result.messageId });
    } catch (error) {
      // Record failed log
      try {
        const { to, subject, leadId, leadName } = req.body;
        await createEmailLog({
          leadId,
          leadName,
          recipient: to,
          subject,
          status: 'failed',
          error: error.message
        });
      } catch (logError) {
        console.error('Failed to record email error log:', logError);
      }

      res.status(500).json({ error: error.message });
    }
  });

  // Start server
  app.listen(PORT, () => {
    console.log(`🚀 LeadScan365 Backend running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`📥 Webhook: POST http://localhost:${PORT}/api/webhooks/leads`);
    console.log(`💾 Database: SQLite (local, free, unlimited)`);
  });
}

startServer().catch(err => {
  console.error('❌ Failed to start server:', err);
});

