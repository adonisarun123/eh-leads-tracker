-- Index for performance filtering
CREATE INDEX IF NOT EXISTS idx_leads_filters ON leads (status, city, source, service_required, assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_dates ON leads (created_at, next_followup_at);

-- Settings table for dynamic configuration
CREATE TABLE IF NOT EXISTS settings (
  key text PRIMARY KEY,
  value jsonb
);

-- Initial settings data
INSERT INTO settings (key, value) VALUES 
('lead_sources', '["Website", "WhatsApp", "Referral", "Ads", "Walk-in"]'::jsonb),
('lead_statuses', '["New", "Contacted", "Qualified", "Trial Scheduled", "Converted", "Lost"]'::jsonb),
('services', '["Maid", "Cook", "Nanny", "Elder care"]'::jsonb)
ON CONFLICT (key) DO NOTHING;
