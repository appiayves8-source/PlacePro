// PlacePro - Service d'accès exclusif à Supabase PostgreSQL
import { supabase, isSupabaseConfigured } from './supabaseClient';

export const placeproService = {
  // ==========================================
  // 1. AGENCES DE PLACEMENT
  // ==========================================
  async getAgencies() {
    if (!isSupabaseConfigured || !supabase) return [];
    try {
      const { data, error } = await supabase
        .from('agencies')
        .select('*')
        .order('name');
      if (error) throw error;
      return (data || []).map(mapAgencyFromDb);
    } catch (e) {
      console.error('[Supabase] Erreur getAgencies:', e);
      return [];
    }
  },

  async checkAgencyPhoneExists(phone) {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
      const phone10 = cleanPhone.length >= 10 ? cleanPhone.slice(-10) : cleanPhone;
      if (!phone10) return false;
      const { data, error } = await supabase
        .from('agencies')
        .select('id, name')
        .eq('phone', phone10)
        .maybeSingle();
      if (error) throw error;
      return !!data;
    } catch (e) {
      console.error('[Supabase] Erreur checkAgencyPhoneExists:', e);
      return false;
    }
  },

  async createAgency(agency) {
    if (!isSupabaseConfigured || !supabase) return agency;
    try {
      const dbRow = mapAgencyToDb(agency);
      const { data, error } = await supabase
        .from('agencies')
        .insert(dbRow)
        .select()
        .single();
      if (error) {
        if (error.code === '23505' || error.message?.includes('duplicate key') || error.message?.includes('agencies_phone_unique_idx')) {
          throw new Error("Ce numéro de téléphone est déjà associé à un compte agence existant. Un numéro ne peut être lié qu'à un seul compte.");
        }
        throw error;
      }
      return mapAgencyFromDb(data);
    } catch (e) {
      console.error('[Supabase] Erreur createAgency:', e);
      throw e;
    }
  },

  async updateAgencyPassword(agencyId, newPassword) {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase
        .from('agencies')
        .update({ password: newPassword, updated_at: new Date().toISOString() })
        .eq('id', agencyId);
      if (error) throw error;
      return true;
    } catch (e) {
      console.error('[Supabase] Erreur updateAgencyPassword:', e);
      return false;
    }
  },

  async updateAgencyPlan(agencyId, plan, monthlyFee) {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase
        .from('agencies')
        .update({
          plan,
          monthly_fee: monthlyFee,
          updated_at: new Date().toISOString()
        })
        .eq('id', agencyId);
      if (error) throw error;
      return true;
    } catch (e) {
      console.error('[Supabase] Erreur updateAgencyPlan:', e);
      return false;
    }
  },

  async updateAgencySubscription(agencyId, updates) {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const dbUpdates = { updated_at: new Date().toISOString() };
      if (updates.subscriptionStatus !== undefined) dbUpdates.subscription_status = updates.subscriptionStatus;
      if (updates.subscriptionExpiry !== undefined) dbUpdates.subscription_expiry = updates.subscriptionExpiry;
      if (updates.lastPaymentDate !== undefined) dbUpdates.last_payment_date = updates.lastPaymentDate;
      if (updates.paymentMethod !== undefined) dbUpdates.payment_method = updates.paymentMethod;
      if (updates.totalPaidToAdmin !== undefined) dbUpdates.total_paid_to_admin = updates.totalPaidToAdmin;

      const { error } = await supabase
        .from('agencies')
        .update(dbUpdates)
        .eq('id', agencyId);
      if (error) throw error;
      return true;
    } catch (e) {
      console.error('[Supabase] Erreur updateAgencySubscription:', e);
      return false;
    }
  },

  // ==========================================
  // CONFIGURATION SYSTÈME & ADMINISTRATION
  // ==========================================
  async getAdminPassword() {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'admin_password')
        .maybeSingle();
      if (error) throw error;
      return data?.value || '0000';
    } catch (e) {
      console.error('[Supabase] Erreur getAdminPassword:', e);
      return null;
    }
  },

  async updateAdminPassword(newPassword) {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase
        .from('app_settings')
        .upsert({
          key: 'admin_password',
          value: newPassword,
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' });
      if (error) throw error;
      return true;
    } catch (e) {
      console.error('[Supabase] Erreur updateAdminPassword:', e);
      return false;
    }
  },

  // ==========================================
  // 2. PERSONNEL DE MAISON (CANDIDATS)
  // ==========================================
  async getCandidates(agencyId) {
    if (!isSupabaseConfigured || !supabase) return [];
    try {
      let query = supabase.from('candidates').select('*');
      if (agencyId) {
        query = query.eq('agency_id', agencyId);
      }
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(mapCandidateFromDb);
    } catch (e) {
      console.error('[Supabase] Erreur getCandidates:', e);
      return [];
    }
  },

  async addCandidate(candidate) {
    if (!isSupabaseConfigured || !supabase) return candidate;
    try {
      const dbRow = mapCandidateToDb(candidate);
      const { data, error } = await supabase
        .from('candidates')
        .insert(dbRow)
        .select()
        .single();
      if (error) throw error;
      return mapCandidateFromDb(data);
    } catch (e) {
      console.error('[Supabase] Erreur addCandidate:', e);
      return candidate;
    }
  },

  async updateCandidate(candidateId, updates) {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const dbUpdates = { updated_at: new Date().toISOString() };
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.trustScore !== undefined) dbUpdates.trust_score = updates.trustScore;
      if (updates.scoreHistory !== undefined) dbUpdates.score_history = updates.scoreHistory;
      if (updates.currentPlacementId !== undefined) dbUpdates.current_placement_id = updates.currentPlacementId;
      if (updates.disappearanceDetails !== undefined) dbUpdates.disappearance_details = updates.disappearanceDetails;

      const { error } = await supabase
        .from('candidates')
        .update(dbUpdates)
        .eq('id', candidateId);
      if (error) throw error;
      return true;
    } catch (e) {
      console.error('[Supabase] Erreur updateCandidate:', e);
      return false;
    }
  },

  async reportDisappearance(candidateId, details, scoreHistory) {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase
        .from('candidates')
        .update({
          status: 'disparu',
          trust_score: 0,
          disappearance_details: details,
          score_history: scoreHistory,
          updated_at: new Date().toISOString()
        })
        .eq('id', candidateId);
      if (error) throw error;
      return true;
    } catch (e) {
      console.error('[Supabase] Erreur reportDisappearance:', e);
      return false;
    }
  },

  // ==========================================
  // 3. FAMILLES & CLIENTS
  // ==========================================
  async getClients(agencyId) {
    if (!isSupabaseConfigured || !supabase) return [];
    try {
      let query = supabase.from('clients').select('*');
      if (agencyId) {
        query = query.eq('agency_id', agencyId);
      }
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(mapClientFromDb);
    } catch (e) {
      console.error('[Supabase] Erreur getClients:', e);
      return [];
    }
  },

  async addClient(client) {
    if (!isSupabaseConfigured || !supabase) return client;
    try {
      const dbRow = mapClientToDb(client);
      const { data, error } = await supabase
        .from('clients')
        .insert(dbRow)
        .select()
        .single();
      if (error) throw error;
      return mapClientFromDb(data);
    } catch (e) {
      console.error('[Supabase] Erreur addClient:', e);
      return client;
    }
  },

  async updateClientStaffCount(clientId, newCount) {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase
        .from('clients')
        .update({
          placed_staff_count: newCount,
          updated_at: new Date().toISOString()
        })
        .eq('id', clientId);
      if (error) throw error;
      return true;
    } catch (e) {
      console.error('[Supabase] Erreur updateClientStaffCount:', e);
      return false;
    }
  },

  // ==========================================
  // 4. CONTRATS DE PLACEMENT
  // ==========================================
  async getPlacements(agencyId) {
    if (!isSupabaseConfigured || !supabase) return [];
    try {
      let query = supabase.from('placements').select('*');
      if (agencyId) {
        query = query.eq('agency_id', agencyId);
      }
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(mapPlacementFromDb);
    } catch (e) {
      console.error('[Supabase] Erreur getPlacements:', e);
      return [];
    }
  },

  async addPlacement(placement) {
    if (!isSupabaseConfigured || !supabase) return placement;
    try {
      const dbRow = mapPlacementToDb(placement);
      const { data, error } = await supabase
        .from('placements')
        .insert(dbRow)
        .select()
        .single();
      if (error) throw error;

      // Met à jour le candidat : statut 'placé' et placement actif
      await supabase
        .from('candidates')
        .update({
          status: 'placé',
          current_placement_id: placement.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', placement.candidateId);

      return mapPlacementFromDb(data);
    } catch (e) {
      console.error('[Supabase] Erreur addPlacement:', e);
      return placement;
    }
  },

  async renewPlacement(placementId, newEndDate, newInstallments) {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase
        .from('placements')
        .update({
          end_date: newEndDate,
          installments: newInstallments,
          updated_at: new Date().toISOString()
        })
        .eq('id', placementId);
      if (error) throw error;
      return true;
    } catch (e) {
      console.error('[Supabase] Erreur renewPlacement:', e);
      return false;
    }
  },

  async updatePlacementInstallments(placementId, installments) {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase
        .from('placements')
        .update({
          installments,
          updated_at: new Date().toISOString()
        })
        .eq('id', placementId);
      if (error) throw error;
      return true;
    } catch (e) {
      console.error('[Supabase] Erreur updatePlacementInstallments:', e);
      return false;
    }
  },

  // ==========================================
  // 5. PAIEMENTS & REÇUS D'AGENCE
  // ==========================================
  async getPayments(agencyId) {
    if (!isSupabaseConfigured || !supabase) return [];
    try {
      let query = supabase.from('payments').select('*');
      if (agencyId) {
        query = query.eq('agency_id', agencyId);
      }
      const { data, error } = await query.order('payment_date', { ascending: false });
      if (error) throw error;
      return (data || []).map(mapPaymentFromDb);
    } catch (e) {
      console.error('[Supabase] Erreur getPayments:', e);
      return [];
    }
  },

  async recordPayment(payment, updatedPlacement = null) {
    if (!isSupabaseConfigured || !supabase) return payment;
    try {
      const dbRow = mapPaymentToDb(payment);
      const { data, error } = await supabase
        .from('payments')
        .insert(dbRow)
        .select()
        .single();
      if (error) throw error;

      // Si le paiement est lié à une tranche d'un placement, synchroniser l'échéancier
      if (updatedPlacement && updatedPlacement.id) {
        await supabase
          .from('placements')
          .update({
            installments: updatedPlacement.installments,
            updated_at: new Date().toISOString()
          })
          .eq('id', updatedPlacement.id);
      }

      return mapPaymentFromDb(data);
    } catch (e) {
      console.error('[Supabase] Erreur recordPayment:', e);
      return payment;
    }
  },

  // ==========================================
  // 6. NOTIFICATIONS & SIGNALEMENTS D'URGENCE
  // ==========================================
  async getNotifications(agencyId) {
    if (!isSupabaseConfigured || !supabase) return [];
    try {
      let query = supabase.from('notifications').select('*');
      if (agencyId) {
        query = query.eq('agency_id', agencyId);
      }
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(mapNotificationFromDb);
    } catch (e) {
      console.error('[Supabase] Erreur getNotifications:', e);
      return [];
    }
  },

  async addNotification(notification) {
    if (!isSupabaseConfigured || !supabase) return notification;
    try {
      const dbRow = mapNotificationToDb(notification);
      const { data, error } = await supabase
        .from('notifications')
        .insert(dbRow)
        .select()
        .single();
      if (error) throw error;
      return mapNotificationFromDb(data);
    } catch (e) {
      console.error('[Supabase] Erreur addNotification:', e);
      return notification;
    }
  },

  async markNotificationAsRead(notifId) {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notifId);
      if (error) throw error;
      return true;
    } catch (e) {
      console.error('[Supabase] Erreur markNotificationAsRead:', e);
      return false;
    }
  },

  async markAllNotificationsAsRead(agencyId) {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      let query = supabase.from('notifications').update({ read: true });
      if (agencyId) {
        query = query.eq('agency_id', agencyId);
      }
      const { error } = await query;
      if (error) throw error;
      return true;
    } catch (e) {
      console.error('[Supabase] Erreur markAllNotificationsAsRead:', e);
      return false;
    }
  },

  // ==========================================
  // 7. HISTORIQUE ENCAISSEMENTS SUPER ADMIN
  // ==========================================
  async getSuperAdminPayments() {
    if (!isSupabaseConfigured || !supabase) return [];
    try {
      const { data, error } = await supabase
        .from('super_admin_payments')
        .select('*')
        .order('payment_date', { ascending: false });
      if (error) throw error;
      return (data || []).map(mapSuperAdminPaymentFromDb);
    } catch (e) {
      console.error('[Supabase] Erreur getSuperAdminPayments:', e);
      return [];
    }
  },

  async addSuperAdminPayment(payment) {
    if (!isSupabaseConfigured || !supabase) return payment;
    try {
      const dbRow = mapSuperAdminPaymentToDb(payment);
      const { data, error } = await supabase
        .from('super_admin_payments')
        .insert(dbRow)
        .select()
        .single();
      if (error) throw error;
      return mapSuperAdminPaymentFromDb(data);
    } catch (e) {
      console.error('[Supabase] Erreur addSuperAdminPayment:', e);
      return payment;
    }
  }
};

// ==============================================================================
// FONCTIONS DE MAPPING (PostgreSQL snake_case <-> Application camelCase)
// ==============================================================================

function mapAgencyFromDb(row) {
  if (!row) return null;
  return {
    agency_id: row.id,
    name: row.name,
    managerName: row.manager_name,
    phone: row.phone,
    neighborhood: row.neighborhood || '',
    city: row.city || "Abidjan, Côte d'Ivoire",
    logoInitials: row.logo_initials || 'AG',
    currency: row.currency || 'FCFA',
    plan: row.plan || 'Pro',
    password: row.password || '1234',
    monthlyFee: Number(row.monthly_fee) || 0,
    subscriptionStatus: row.subscription_status || 'trial',
    subscriptionExpiry: row.subscription_expiry,
    paymentMethod: row.payment_method || 'Wave Business',
    lastPaymentDate: row.last_payment_date,
    totalPaidToAdmin: Number(row.total_paid_to_admin) || 0,
    createdAt: row.created_at
  };
}

function mapAgencyToDb(agency) {
  return {
    id: agency.agency_id || agency.id,
    name: agency.name,
    manager_name: agency.managerName,
    phone: agency.phone,
    neighborhood: agency.neighborhood || '',
    city: agency.city || "Abidjan, Côte d'Ivoire",
    logo_initials: agency.logoInitials || 'AG',
    currency: agency.currency || 'FCFA',
    plan: agency.plan || 'Pro',
    password: agency.password || '1234',
    monthly_fee: agency.monthlyFee || 39000,
    subscription_status: agency.subscriptionStatus || 'trial',
    subscription_expiry: agency.subscriptionExpiry,
    payment_method: agency.paymentMethod || 'Wave Business',
    last_payment_date: agency.lastPaymentDate || null,
    total_paid_to_admin: agency.totalPaidToAdmin || 0
  };
}

function mapCandidateFromDb(row) {
  if (!row) return null;
  return {
    id: row.id,
    agency_id: row.agency_id,
    firstName: row.first_name,
    lastName: row.last_name,
    job: row.job,
    neighborhood: row.neighborhood || '',
    phone: row.phone,
    desiredSalary: Number(row.desired_salary) || 0,
    status: row.status || 'disponible',
    trustScore: row.trust_score ?? 70,
    idCardRef: row.id_card_ref || '',
    guarantor: row.guarantor || {},
    references: row.references || '',
    dataConsent: row.data_consent ?? true,
    scoreHistory: row.score_history || [],
    currentPlacementId: row.current_placement_id || null,
    disappearanceDetails: row.disappearance_details || null,
    createdAt: row.created_at
  };
}

function mapCandidateToDb(cand) {
  return {
    id: cand.id,
    agency_id: cand.agency_id,
    first_name: cand.firstName,
    last_name: cand.lastName,
    job: cand.job,
    neighborhood: cand.neighborhood || '',
    phone: cand.phone,
    desired_salary: cand.desiredSalary || 0,
    status: cand.status || 'disponible',
    trust_score: cand.trustScore ?? 70,
    id_card_ref: cand.idCardRef || '',
    guarantor: cand.guarantor || {},
    "references": cand.references || '',
    data_consent: cand.dataConsent ?? true,
    score_history: cand.scoreHistory || [],
    current_placement_id: cand.currentPlacementId || null,
    disappearance_details: cand.disappearanceDetails || null
  };
}

function mapClientFromDb(row) {
  if (!row) return null;
  return {
    id: row.id,
    agency_id: row.agency_id,
    name: row.name,
    contactPerson: row.contact_person || '',
    phone: row.phone,
    neighborhood: row.neighborhood || '',
    type: row.type || 'Famille',
    placedStaffCount: row.placed_staff_count || 0,
    notes: row.notes || '',
    createdAt: row.created_at
  };
}

function mapClientToDb(client) {
  return {
    id: client.id,
    agency_id: client.agency_id,
    name: client.name,
    contact_person: client.contactPerson || '',
    phone: client.phone,
    neighborhood: client.neighborhood || '',
    type: client.type || 'Famille',
    placed_staff_count: client.placedStaffCount || 0,
    notes: client.notes || ''
  };
}

function mapPlacementFromDb(row) {
  if (!row) return null;
  return {
    id: row.id,
    agency_id: row.agency_id,
    candidateId: row.candidate_id,
    clientId: row.client_id,
    startDate: row.start_date,
    endDate: row.end_date,
    monthlySalary: Number(row.monthly_salary) || 0,
    totalCommission: Number(row.total_commission) || 0,
    status: row.status || 'actif',
    installments: row.installments || [],
    createdAt: row.created_at
  };
}

function mapPlacementToDb(plc) {
  return {
    id: plc.id,
    agency_id: plc.agency_id,
    candidate_id: plc.candidateId,
    client_id: plc.clientId,
    start_date: plc.startDate,
    end_date: plc.endDate,
    monthly_salary: plc.monthlySalary || 0,
    total_commission: plc.totalCommission || 0,
    status: plc.status || 'actif',
    installments: plc.installments || []
  };
}

function mapPaymentFromDb(row) {
  if (!row) return null;
  return {
    id: row.id,
    agency_id: row.agency_id,
    placementId: row.placement_id,
    installmentId: row.installment_id,
    candidateName: row.candidate_name,
    payerName: row.payer_name,
    amount: Number(row.amount) || 0,
    paymentDate: row.payment_date,
    paymentMethod: row.payment_method,
    receiptNumber: row.receipt_number,
    remainingAmount: Number(row.remaining_amount) || 0,
    notes: row.notes || '',
    createdAt: row.created_at
  };
}

function mapPaymentToDb(pay) {
  return {
    id: pay.id,
    agency_id: pay.agency_id,
    placement_id: pay.placementId || null,
    installment_id: pay.installmentId || null,
    candidate_name: pay.candidateName || '',
    payer_name: pay.payerName || '',
    amount: pay.amount || 0,
    payment_date: pay.paymentDate,
    payment_method: pay.paymentMethod,
    receipt_number: pay.receiptNumber,
    remaining_amount: pay.remainingAmount || 0,
    notes: pay.notes || ''
  };
}

function mapNotificationFromDb(row) {
  if (!row) return null;
  return {
    id: row.id,
    agency_id: row.agency_id,
    source: row.source,
    authorName: row.author_name,
    authorPhone: row.author_phone,
    title: row.title,
    urgencyType: row.urgency_type,
    details: row.details,
    targetId: row.target_id,
    read: row.read || false,
    createdAt: row.created_at
  };
}

function mapNotificationToDb(notif) {
  return {
    id: notif.id,
    agency_id: notif.agency_id,
    source: notif.source,
    author_name: notif.authorName,
    author_phone: notif.authorPhone,
    title: notif.title,
    urgency_type: notif.urgencyType,
    details: notif.details,
    target_id: notif.targetId || null,
    read: notif.read || false
  };
}

function mapSuperAdminPaymentFromDb(row) {
  if (!row) return null;
  return {
    id: row.id,
    agency_id: row.agency_id,
    agencyName: row.agency_name,
    amount: Number(row.amount) || 0,
    plan: row.plan,
    method: row.method,
    paymentDate: row.payment_date,
    reference: row.reference || '',
    status: row.status || 'validé',
    notes: row.notes || '',
    createdAt: row.created_at
  };
}

function mapSuperAdminPaymentToDb(sap) {
  return {
    id: sap.id,
    agency_id: sap.agency_id,
    agency_name: sap.agencyName,
    amount: sap.amount || 0,
    plan: sap.plan,
    method: sap.method,
    payment_date: sap.paymentDate,
    reference: sap.reference || '',
    status: sap.status || 'validé',
    notes: sap.notes || ''
  };
}
