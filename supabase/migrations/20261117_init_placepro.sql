-- ==============================================================================
-- PLACEPRO - MIGRATION INITIALE SUPABASE (POSTGRESQL)
-- Projet Supabase : https://ibrdiprqzubyoismmwkr.supabase.co
-- Date : 17 Novembre 2026
-- Auteur : PlacePro CI
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. CRÉATION DES TABLES
-- ------------------------------------------------------------------------------

-- Table des Agences de placement
CREATE TABLE IF NOT EXISTS public.agencies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  manager_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  neighborhood TEXT,
  city TEXT DEFAULT 'Abidjan, Côte d''Ivoire',
  logo_initials TEXT,
  currency TEXT DEFAULT 'FCFA',
  plan TEXT DEFAULT 'Pro',
  password TEXT DEFAULT '1234',
  monthly_fee NUMERIC(12, 0) DEFAULT 39000,
  subscription_status TEXT DEFAULT 'trial',
  subscription_expiry DATE,
  payment_method TEXT DEFAULT 'Wave Business',
  last_payment_date DATE,
  total_paid_to_admin NUMERIC(12, 0) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des Candidats (Personnel de maison)
CREATE TABLE IF NOT EXISTS public.candidates (
  id TEXT PRIMARY KEY,
  agency_id TEXT NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  job TEXT NOT NULL,
  neighborhood TEXT,
  phone TEXT NOT NULL,
  desired_salary NUMERIC(12, 0) DEFAULT 0,
  status TEXT DEFAULT 'disponible',
  trust_score INTEGER DEFAULT 70,
  id_card_ref TEXT,
  guarantor JSONB DEFAULT '{}'::jsonb,
  "references" TEXT,
  data_consent BOOLEAN DEFAULT TRUE,
  score_history JSONB DEFAULT '[]'::jsonb,
  current_placement_id TEXT,
  disappearance_details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des Clients (Familles et Entreprises)
CREATE TABLE IF NOT EXISTS public.clients (
  id TEXT PRIMARY KEY,
  agency_id TEXT NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT NOT NULL,
  neighborhood TEXT,
  type TEXT DEFAULT 'Famille',
  placed_staff_count INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des Placements (Contrats mensuels)
CREATE TABLE IF NOT EXISTS public.placements (
  id TEXT PRIMARY KEY,
  agency_id TEXT NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  candidate_id TEXT NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  client_id TEXT NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  monthly_salary NUMERIC(12, 0) NOT NULL,
  total_commission NUMERIC(12, 0) NOT NULL,
  status TEXT DEFAULT 'actif',
  installments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des Paiements et Reçus d'agence
CREATE TABLE IF NOT EXISTS public.payments (
  id TEXT PRIMARY KEY,
  agency_id TEXT NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  placement_id TEXT REFERENCES public.placements(id) ON DELETE SET NULL,
  installment_id TEXT,
  candidate_name TEXT,
  payer_name TEXT,
  amount NUMERIC(12, 0) NOT NULL,
  payment_date DATE NOT NULL,
  payment_method TEXT NOT NULL,
  receipt_number TEXT NOT NULL,
  remaining_amount NUMERIC(12, 0) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des Notifications et Signalements d'urgence
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  agency_id TEXT NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  source TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_phone TEXT NOT NULL,
  title TEXT NOT NULL,
  urgency_type TEXT NOT NULL,
  details TEXT NOT NULL,
  target_id TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des Règlements d'abonnements Super Admin (Cyrille)
CREATE TABLE IF NOT EXISTS public.super_admin_payments (
  id TEXT PRIMARY KEY,
  agency_id TEXT NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  agency_name TEXT NOT NULL,
  amount NUMERIC(12, 0) NOT NULL,
  plan TEXT NOT NULL,
  method TEXT NOT NULL,
  payment_date DATE NOT NULL,
  reference TEXT,
  status TEXT DEFAULT 'validé',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. INDEX DE PERFORMANCE SUR LES CLÉS ÉTRANGÈRES
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_candidates_agency_id ON public.candidates(agency_id);
CREATE INDEX IF NOT EXISTS idx_clients_agency_id ON public.clients(agency_id);
CREATE INDEX IF NOT EXISTS idx_placements_agency_id ON public.placements(agency_id);
CREATE INDEX IF NOT EXISTS idx_placements_candidate_id ON public.placements(candidate_id);
CREATE INDEX IF NOT EXISTS idx_placements_client_id ON public.placements(client_id);
CREATE INDEX IF NOT EXISTS idx_payments_agency_id ON public.payments(agency_id);
CREATE INDEX IF NOT EXISTS idx_payments_placement_id ON public.payments(placement_id);
CREATE INDEX IF NOT EXISTS idx_notifications_agency_id ON public.notifications(agency_id);
CREATE INDEX IF NOT EXISTS idx_super_admin_payments_agency_id ON public.super_admin_payments(agency_id);

-- ------------------------------------------------------------------------------
-- 3. SÉCURITÉ ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------------------------
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.super_admin_payments ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'agencies_policy_all') THEN
    CREATE POLICY agencies_policy_all ON public.agencies FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'candidates_policy_all') THEN
    CREATE POLICY candidates_policy_all ON public.candidates FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'clients_policy_all') THEN
    CREATE POLICY clients_policy_all ON public.clients FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'placements_policy_all') THEN
    CREATE POLICY placements_policy_all ON public.placements FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'payments_policy_all') THEN
    CREATE POLICY payments_policy_all ON public.payments FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'notifications_policy_all') THEN
    CREATE POLICY notifications_policy_all ON public.notifications FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'super_admin_payments_policy_all') THEN
    CREATE POLICY super_admin_payments_policy_all ON public.super_admin_payments FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 4. INSERTION DES DONNÉES INITIALES (SEED DATA)
-- ------------------------------------------------------------------------------

-- Agences
INSERT INTO public.agencies (id, name, manager_name, phone, neighborhood, city, logo_initials, plan, password, monthly_fee, subscription_status, subscription_expiry, payment_method, last_payment_date, total_paid_to_admin)
VALUES 
  ('AG_ABJ_DEMO', 'Agence Démo Abidjan', 'Mme Fatou Touré', '+225 07 00 00 00 01', 'Cocody Deux-Plateaux', 'Abidjan, Côte d''Ivoire', 'AD', 'Pro', '1234', 39000, 'active', CURRENT_DATE + INTERVAL '28 days', 'Wave Business', '2026-11-15', 117000),
  ('AG_IVOIRE_NOUNOU', 'Ivoire Nounou Services', 'Mme Clarisse Bédié', '+225 07 55 66 77 88', 'Marcory Zone 4', 'Abidjan, Côte d''Ivoire', 'IN', 'Starter', '1234', 19000, 'warning', CURRENT_DATE + INTERVAL '3 days', 'Orange Money', '2026-10-20', 38000),
  ('AG_PRESTIGE_DOM', 'Prestige Domestic Abidjan', 'M. Jean-Marc Kouadio', '+225 01 22 33 44 55', 'Plateau Immeuble Trade Center', 'Abidjan, Côte d''Ivoire', 'PD', 'Pro', '1234', 39000, 'expired', CURRENT_DATE - INTERVAL '4 days', 'Wave Business', '2026-08-13', 117000),
  ('AG_YOPOUGON_AIDE', 'Yopougon Aide & Ménage', 'Mme Suzanne Kassi', '+225 05 99 88 77 66', 'Yopougon Siporex', 'Abidjan, Côte d''Ivoire', 'YA', 'Essai Gratuit (14j)', '1234', 0, 'trial', CURRENT_DATE + INTERVAL '5 days', 'En attente', NULL, 0)
ON CONFLICT (id) DO NOTHING;

-- Candidats
INSERT INTO public.candidates (id, agency_id, first_name, last_name, job, neighborhood, phone, desired_salary, status, trust_score, id_card_ref, guarantor, "references", data_consent, score_history, current_placement_id)
VALUES
  ('cand-001', 'AG_ABJ_DEMO', 'Awa', 'Koné', 'Nounou', 'Cocody Angré', '+225 07 11 22 33 44', 80000, 'placé', 90, 'CI-0029381-X (Fictif)', '{"name":"Bakayoko Idriss","relation":"Oncle","phone":"+225 05 22 33 44 55","neighborhood":"Abobo"}'::jsonb, 'Ex-nounou chez Famille Touré pendant 2 ans (recommandée)', TRUE, '[{"id":"sh-1","date":"2026-09-01","change":0,"reason":"Création du profil","newScore":70},{"id":"sh-2","date":"2026-09-05","change":10,"reason":"Placement réussi","newScore":80}]'::jsonb, 'plc-001'),
  ('cand-002', 'AG_ABJ_DEMO', 'Moussa', 'Traoré', 'Chauffeur', 'Marcory Zone 4', '+225 05 33 44 55 66', 150000, 'placé', 60, 'CI-0084729-B (Fictif)', '{"name":"Traoré Seydou","relation":"Grand frère","phone":"+225 07 88 99 00 11","neighborhood":"Treichville"}'::jsonb, 'Chauffeur de direction chez une PME locale pendant 3 ans', TRUE, '[{"id":"sh-4","date":"2026-09-15","change":0,"reason":"Création du profil","newScore":70}]'::jsonb, 'plc-002'),
  ('cand-in-001', 'AG_IVOIRE_NOUNOU', 'Aminata', 'Diarra', 'Nounou & Garde d''enfants', 'Koumassi Remblais', '+225 07 88 12 34 56', 90000, 'disponible', 92, 'CI-0089123-N (Fictif)', '{"name":"Diarra Bakary","relation":"Oncle","phone":"+225 05 11 22 33 44","neighborhood":"Koumassi"}'::jsonb, '3 ans d''expérience garde d''enfants', TRUE, '[{"id":"sh-in-1","date":"2026-10-15","change":0,"reason":"Inscription validée","newScore":92}]'::jsonb, NULL)
ON CONFLICT (id) DO NOTHING;

-- Clients
INSERT INTO public.clients (id, agency_id, name, contact_person, phone, neighborhood, type, placed_staff_count, notes)
VALUES
  ('cli-001', 'AG_ABJ_DEMO', 'Famille Bamba', 'Mme Bamba Fatou', '+225 07 00 11 22 33', 'Cocody Riviera Palmeraie', 'Famille', 1, 'Bon payeur, règlements par Wave.'),
  ('cli-002', 'AG_ABJ_DEMO', 'Société Ivoire Logistique', 'M. Coulibaly (DRH)', '+225 01 22 33 44 55', 'Plateau, Immeuble Trade Center', 'Entreprise', 1, 'Factures nécessaires pour leur comptabilité.'),
  ('cli-in-001', 'AG_IVOIRE_NOUNOU', 'Famille Konan', 'Mme Konan Estelle', '+225 07 22 33 44 55', 'Marcory Biétry', 'Famille', 0, 'Recherche activement une nounou expérimentée.')
ON CONFLICT (id) DO NOTHING;

-- Placements
INSERT INTO public.placements (id, agency_id, candidate_id, client_id, start_date, end_date, monthly_salary, total_commission, status, installments)
VALUES
  ('plc-001', 'AG_ABJ_DEMO', 'cand-001', 'cli-001', '2026-11-01', '2026-11-30', 85000, 85000, 'actif', '[{"id":"inst-001","label":"Tranche 1","amount":42500,"dueDate":"2026-11-05","status":"payé","paymentMethod":"Wave","receiptNumber":"REC-2026-001"}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Paiements
INSERT INTO public.payments (id, agency_id, placement_id, installment_id, candidate_name, payer_name, amount, payment_date, payment_method, receipt_number, remaining_amount, notes)
VALUES
  ('pay-001', 'AG_ABJ_DEMO', 'plc-001', 'inst-001', 'Awa Koné', 'Mme Bamba Fatou (Famille Bamba)', 42500, '2026-11-05', 'Wave', 'REC-2026-001', 42500, 'Règlement 1ère tranche')
ON CONFLICT (id) DO NOTHING;

-- Notifications
INSERT INTO public.notifications (id, agency_id, source, author_name, author_phone, title, urgency_type, details, target_id, read)
VALUES
  ('notif-1', 'AG_ABJ_DEMO', 'family', 'Mme Bamba Fatou (Famille Bamba)', '+225 07 00 11 22 33', 'Signalement Famille : Retard répété le matin', 'Retards répétés / Horaires non respectés', 'Awa Koné arrive souvent après 8h30 alors que le contrat prévoit 7h30 pour la garde du bébé.', 'cand-001', false),
  ('notif-2', 'AG_ABJ_DEMO', 'worker', 'Moussa Traoré (Chauffeur)', '+225 05 33 44 55 66', 'Urgence Employé : Heures supplémentaires non réglées', 'Non-paiement / Retard sur salaire', 'L''employeur Société Ivoire Logistique me demande de conduire jusqu''à 22h sans payer les heures sup promises.', 'cand-002', false)
ON CONFLICT (id) DO NOTHING;

-- Historique Abonnements Super Admin (Cyrille)
INSERT INTO public.super_admin_payments (id, agency_id, agency_name, amount, plan, method, payment_date, reference, status, notes)
VALUES
  ('subpay-001', 'AG_ABJ_DEMO', 'Agence Démo Abidjan', 25000, 'Mensuel Pro', 'Wave Business', '2026-11-15', 'WAV-2026-9481', 'validé', 'Abonnement PlacePro Novembre-Décembre 2026'),
  ('subpay-002', 'AG_IVOIRE_NOUNOU', 'Ivoire Nounou Services', 25000, 'Mensuel Pro', 'Orange Money', '2026-10-20', 'OM-2026-8812', 'validé', 'Abonnement PlacePro Octobre-Novembre 2026')
ON CONFLICT (id) DO NOTHING;
