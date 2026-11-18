import React, { createContext, useContext, useState, useEffect } from 'react';
import { placeproService } from '../services/placeproService';
import { SUBSCRIPTION_PLANS } from '../data/mockData';
import { getPublicAppUrl } from '../config/adminConfig';

const AppContext = createContext();

const STORAGE_KEY = 'placepro_state_v1';
const AGENCIES_STORAGE_KEY = 'placepro_agencies_v1';
const NOTIFICATIONS_STORAGE_KEY = 'placepro_notifications_v1';
const ADMIN_PAYMENTS_STORAGE_KEY = 'placepro_admin_payments_v1';

export const ADMIN_SPACE = {
  agency_id: 'admin',
  name: 'Administration PlacePro (Cyrille)',
  managerName: 'Cyrille',
  phone: '0502629821',
  neighborhood: 'Plateau',
  city: "Abidjan, Côte d'Ivoire",
  logoInitials: '👑',
  currency: 'FCFA',
  plan: 'Super Admin',
  password: '0000',
  monthlyFee: 0,
  subscriptionStatus: 'active',
  totalPaidToAdmin: 0
};

const DEFAULT_AGENCY = ADMIN_SPACE;

export function AppProvider({ children }) {
  // Liste des agences (stockées dans Supabase et mises en cache)
  const [agencies, setAgencies] = useState(() => {
    try {
      const saved = localStorage.getItem(AGENCIES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Erreur chargement agences cache", e);
    }
    return [];
  });

  // Historique des encaissements d'abonnements Super Admin
  const [superAdminPayments, setSuperAdminPayments] = useState(() => {
    try {
      const saved = localStorage.getItem(ADMIN_PAYMENTS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Erreur chargement paiements super admin cache", e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(ADMIN_PAYMENTS_STORAGE_KEY, JSON.stringify(superAdminPayments));
    } catch (e) {
      console.warn("Erreur sauvegarde paiements super admin", e);
    }
  }, [superAdminPayments]);

  // Détection de l'agence active & des vues portails (employé ou famille)
  const params = new URLSearchParams(window.location.search);
  const agencyParam = params.get('agency');
  const viewParam = params.get('view'); // 'worker' | 'family' | null
  const candParam = params.get('cand');
  const cliParam = params.get('cli');
  const adminParam = params.get('admin');

  const [currentAgencyId, setCurrentAgencyId] = useState(() => {
    return agencyParam || 'admin';
  });
  const [portalView, setPortalView] = useState(viewParam); // 'worker' | 'family' | null
  const [portalEntityId, setPortalEntityId] = useState(candParam || cliParam || null);

  // État Super Admin (Cyrille - Propriétaire de la plateforme)
  const [isSuperAdmin, setIsSuperAdmin] = useState(() => {
    try {
      // Si un paramètre d'agence spécifique (autre que admin) est dans l'URL, ce n'est pas le Super Admin
      if (agencyParam && agencyParam !== 'admin') {
        return false;
      }
      const saved = localStorage.getItem('placepro_is_superadmin');
      if (saved !== null) return saved === 'true';
      // Par défaut sur le lien principal Vercel, c'est l'espace Admin de Cyrille
      return true;
    } catch (e) {
      return true;
    }
  });

  const ADMIN_PASSWORD_STORAGE_KEY = 'placepro_admin_password_v1';
  const LAST_SPACE_KEY = 'placepro_last_active_space';

  // Mot de passe personnalisé pour le Super Admin (Cyrille)
  const [adminPassword, setAdminPassword] = useState(() => {
    try {
      return localStorage.getItem(ADMIN_PASSWORD_STORAGE_KEY) || '0000';
    } catch (e) {
      return '0000';
    }
  });

  // Synchronisation au démarrage avec le mot de passe maître stocké dans Supabase (table app_settings)
  useEffect(() => {
    let isMounted = true;
    placeproService.getAdminPassword().then(pwd => {
      if (isMounted && pwd) {
        setAdminPassword(pwd);
        try {
          localStorage.setItem(ADMIN_PASSWORD_STORAGE_KEY, pwd);
        } catch (e) {}
      }
    });
    return () => { isMounted = false; };
  }, []);

  const updateAdminPassword = async (newPwd) => {
    setAdminPassword(newPwd);
    try {
      localStorage.setItem(ADMIN_PASSWORD_STORAGE_KEY, newPwd);
    } catch (e) {
      console.warn("Erreur sauvegarde mot de passe admin", e);
    }
    const success = await placeproService.updateAdminPassword(newPwd);
    return success;
  };

  // Mémorisation du dernier espace actif pour préremplissage automatique lors de la déconnexion
  const [lastActiveSpace, setLastActiveSpace] = useState(() => {
    try {
      return localStorage.getItem(LAST_SPACE_KEY) || (adminParam === 'true' ? 'admin' : (agencyParam || 'admin'));
    } catch (e) {
      return 'admin';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('placepro_is_superadmin', isSuperAdmin ? 'true' : 'false');
    } catch (e) {
      console.warn("Erreur sauvegarde statut super admin", e);
    }
  }, [isSuperAdmin]);

  useEffect(() => {
    try {
      localStorage.setItem(AGENCIES_STORAGE_KEY, JSON.stringify(agencies));
    } catch (e) {
      console.warn("Erreur sauvegarde agences", e);
    }
  }, [agencies]);

  // Données globales (Candidats, Clients, Placements, Paiements)
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Erreur chargement état cache", e);
    }
    return {
      candidates: [],
      clients: [],
      placements: [],
      payments: []
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Erreur sauvegarde état", e);
    }
  }, [state]);

  // Notifications des signalements employés et familles
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Erreur chargement notifications cache", e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.warn("Erreur sauvegarde notifications", e);
    }
  }, [notifications]);

  // ========================================================
  // SYNCHRONISATION INITIALE EN DIRECT AVEC SUPABASE
  // ========================================================
  useEffect(() => {
    let isMounted = true;
    async function syncFromSupabase() {
      try {
        const [dbAgencies, dbCandidates, dbClients, dbPlacements, dbPayments, dbNotifs, dbAdminPays] = await Promise.all([
          placeproService.getAgencies(),
          placeproService.getCandidates(),
          placeproService.getClients(),
          placeproService.getPlacements(),
          placeproService.getPayments(),
          placeproService.getNotifications(),
          placeproService.getSuperAdminPayments()
        ]);

        if (!isMounted) return;

        setAgencies(dbAgencies || []);
        setSuperAdminPayments(dbAdminPays || []);
        setNotifications(dbNotifs || []);

        setState({
          candidates: dbCandidates || [],
          clients: dbClients || [],
          placements: dbPlacements || [],
          payments: dbPayments || []
        });

        // Par défaut, l'espace actif est l'espace Administrateur de Cyrille
        if (!currentAgencyId) {
          setCurrentAgencyId('admin');
        }
      } catch (err) {
        console.error("[PlacePro] Erreur synchronisation Supabase:", err);
      }
    }

    syncFromSupabase();
    return () => { isMounted = false; };
  }, []);

  const currentAgency = (currentAgencyId === 'admin' || !currentAgencyId)
    ? ADMIN_SPACE
    : (agencies.find(a => a.agency_id === currentAgencyId) || ADMIN_SPACE);

  // Navigation
  const [currentScreen, setCurrentScreen] = useState(() => {
    return adminParam === 'true' ? 'super-admin' : 'dashboard';
  });
  const [navigationHistory, setNavigationHistory] = useState(['dashboard']);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [selectedClientId, setSelectedClientId] = useState(null);

  // Modales & Tiroir Mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      if (viewParam) return true;
      const saved = localStorage.getItem('placepro_logged_in');
      return saved === 'true';
    } catch (e) {
      return false;
    }
  });

  const logout = () => {
    const activeSpaceToRemember = (currentScreen === 'super-admin' || isSuperAdmin) ? 'admin' : (currentAgencyId || 'admin');
    setLastActiveSpace(activeSpaceToRemember);
    try {
      localStorage.setItem(LAST_SPACE_KEY, activeSpaceToRemember);
      localStorage.setItem('placepro_logged_in', 'false');
    } catch (e) {}
    setIsLoggedIn(false);
    setIsMobileMenuOpen(false);
    setCurrentScreen('login');
  };

  const login = (agencyId) => {
    if (agencyId) {
      setCurrentAgencyId(agencyId);
      setLastActiveSpace(agencyId);
      try {
        localStorage.setItem(LAST_SPACE_KEY, agencyId);
      } catch (e) {}
      const newUrl = `${window.location.origin}${window.location.pathname}?agency=${agencyId}`;
      window.history.pushState({ path: newUrl }, '', newUrl);
    }
    try {
      localStorage.setItem('placepro_logged_in', 'true');
      localStorage.setItem('placepro_is_superadmin', 'false');
    } catch (e) {}
    setIsSuperAdmin(false);
    setIsLoggedIn(true);
    setCurrentScreen('dashboard');
    setNavigationHistory(['dashboard']);
  };

  // Connexion directe en tant que Super Administrateur de la plateforme (Cyrille)
  const loginAsSuperAdmin = () => {
    try {
      localStorage.setItem('placepro_logged_in', 'true');
      localStorage.setItem(LAST_SPACE_KEY, 'admin');
      localStorage.setItem('placepro_is_superadmin', 'true');
    } catch (e) {}
    setIsLoggedIn(true);
    setIsSuperAdmin(true);
    setCurrentAgencyId('admin');
    setLastActiveSpace('admin');
    setCurrentScreen('super-admin');
    setNavigationHistory(['super-admin']);
  };

  const [isAddCandidateOpen, setIsAddCandidateOpen] = useState(false);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isNewPlacementOpen, setIsNewPlacementOpen] = useState(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [isCreateAgencyOpen, setIsCreateAgencyOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activePaymentPlacement, setActivePaymentPlacement] = useState(null);
  
  // Modale de Règlement d'abonnement Mobile Money (Wave / OM / MTN)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentModalData, setPaymentModalData] = useState({
    planName: 'Pro',
    amount: 39000,
    period: '/mois'
  });

  const openSubscriptionPayment = (plan = null) => {
    if (plan) {
      setPaymentModalData({
        planName: plan.name || 'Pro',
        amount: plan.price || 39000,
        period: plan.period || '/mois'
      });
    } else {
      setPaymentModalData({
        planName: currentAgency.plan || 'Pro',
        amount: currentAgency.monthlyFee || 39000,
        period: '/mois'
      });
    }
    setIsPaymentModalOpen(true);
  };

  const switchToAdminSpace = () => {
    setCurrentAgencyId('admin');
    setLastActiveSpace('admin');
    setIsSuperAdmin(true);
    try {
      localStorage.setItem(LAST_SPACE_KEY, 'admin');
      localStorage.setItem('placepro_is_superadmin', 'true');
    } catch (e) {}
    setPortalView(null);
    const newUrl = `${window.location.origin}${window.location.pathname}?agency=admin`;
    window.history.pushState({ path: newUrl }, '', newUrl);
    setCurrentScreen('dashboard');
    setNavigationHistory(['dashboard']);
  };

  const switchAgency = (agencyId) => {
    if (agencyId === 'admin') {
      switchToAdminSpace();
      return;
    }
    setCurrentAgencyId(agencyId);
    setLastActiveSpace(agencyId);
    try {
      localStorage.setItem(LAST_SPACE_KEY, agencyId);
    } catch (e) {}
    setPortalView(null);
    const newUrl = `${window.location.origin}${window.location.pathname}?agency=${agencyId}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
    setCurrentScreen('dashboard');
    setNavigationHistory(['dashboard']);
  };

  // Création d'une agence enregistrée dans Supabase
  // Note importante : L'agence est logée dans la cage (le sélecteur) SANS écraser l'espace Admin actif
  const createAgency = async ({ name, managerName, phone, neighborhood, city = "Abidjan", plan = "Pro", monthlyFee = 39000 }) => {
    const cleanName = (name || '').trim();
    if (cleanName.length < 3) {
      throw new Error("Le nom de l'agence doit comporter au moins 3 caractères.");
    }

    const cleanManager = (managerName || '').trim();
    if (cleanManager.length < 2) {
      throw new Error("Veuillez renseigner le nom complet de la directrice ou gérante.");
    }

    const cleanPhoneDigits = (phone || '').replace(/[^0-9]/g, '');
    const phone10 = cleanPhoneDigits.length >= 10 ? cleanPhoneDigits.slice(-10) : cleanPhoneDigits;
    if (phone10.length !== 10) {
      throw new Error("Le numéro WhatsApp doit comporter exactement 10 chiffres (norme Côte d'Ivoire).");
    }

    const validPrefixes = ['01', '05', '07'];
    if (!validPrefixes.includes(phone10.slice(0, 2))) {
      throw new Error("Le numéro doit commencer par 01 (Moov), 05 (MTN) ou 07 (Orange).");
    }

    // Règle stricte d'unicité : 1 numéro = 1 seul compte
    const localExists = agencies.some(a => (a.phone || '').replace(/[^0-9]/g, '').slice(-10) === phone10);
    if (localExists) {
      throw new Error("Ce numéro de téléphone est déjà associé à un compte agence existant. Un numéro ne peut être lié qu'à un seul compte.");
    }

    const dbExists = await placeproService.checkAgencyPhoneExists(phone10);
    if (dbExists) {
      throw new Error("Ce numéro de téléphone est déjà associé à un compte agence existant. Un numéro ne peut être lié qu'à un seul compte.");
    }

    const cleanId = 'AG_' + cleanName.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8) + '_' + Math.floor(100 + Math.random() * 900);
    const initials = cleanName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'AG';

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    const newAgency = {
      agency_id: cleanId,
      name: cleanName,
      managerName: cleanManager,
      phone: phone10,
      neighborhood: neighborhood || '',
      city: `${city}, Côte d'Ivoire`,
      logoInitials: initials,
      currency: "FCFA",
      plan,
      password: "1234",
      monthlyFee: Number(monthlyFee) || 39000,
      subscriptionStatus: "trial",
      subscriptionExpiry: expiryDate.toISOString().split('T')[0],
      paymentMethod: "Wave Business",
      lastPaymentDate: null,
      totalPaidToAdmin: 0,
      createdAt: new Date().toISOString()
    };

    // Sauvegarde immédiate dans Supabase avant d'ajouter localement
    await placeproService.createAgency(newAgency);

    // Logée dans la cage d'espaces agences
    setAgencies(prev => [...prev, newAgency]);

    const baseAppUrl = getPublicAppUrl();
    const accessLink = `${baseAppUrl}/?agency=${cleanId}`;
    return {
      agency: newAgency,
      accessLink
    };
  };

  // ========================================================
  // INSCRIPTION SÉCURISÉE D'UNE NOUVELLE AGENCE (ONBOARDING CLIENTE)
  // - Validation stricte des données (Nom, Gérante, Téléphone CI 10 chiffres, Mot de passe)
  // - Règle stricte d'unicité : 1 numéro = 1 seul compte
  // - 7 jours d'essai gratuit activés
  // - Connexion automatique et cloisonnement étanche
  // ========================================================
  const registerAgency = async ({ name, managerName, phone, neighborhood, city = "Abidjan", password, plan = "Pro", monthlyFee = 39000 }) => {
    const cleanName = (name || '').trim();
    if (cleanName.length < 3) {
      throw new Error("Le nom de l'agence doit comporter au moins 3 caractères.");
    }

    const cleanManager = (managerName || '').trim();
    if (cleanManager.length < 2) {
      throw new Error("Veuillez renseigner le nom complet de la gérante ou directrice.");
    }

    const digitsPhone = (phone || '').replace(/[^0-9]/g, '');
    const cleanPhone = digitsPhone.length >= 10 ? digitsPhone.slice(-10) : digitsPhone;
    if (cleanPhone.length !== 10) {
      throw new Error("Le numéro WhatsApp doit comporter exactement 10 chiffres (norme Côte d'Ivoire).");
    }

    const validPrefixes = ['01', '05', '07'];
    const prefix = cleanPhone.slice(0, 2);
    if (!validPrefixes.includes(prefix)) {
      throw new Error("Le numéro doit débuter par 01 (Moov), 05 (MTN) ou 07 (Orange Côte d'Ivoire).");
    }

    // Règle stricte d'unicité : 1 numéro = 1 seul compte
    const phoneExists = agencies.some(a => (a.phone || '').replace(/[^0-9]/g, '').slice(-10) === cleanPhone);
    if (phoneExists) {
      throw new Error("Ce numéro de téléphone est déjà associé à un compte agence existant. Un numéro ne peut être lié qu'à un seul compte. Veuillez vous connecter.");
    }

    const dbExists = await placeproService.checkAgencyPhoneExists(cleanPhone);
    if (dbExists) {
      throw new Error("Ce numéro de téléphone est déjà associé à un compte agence existant. Un numéro ne peut être lié qu'à un seul compte. Veuillez vous connecter.");
    }

    const cleanPassword = (password || '').trim();
    if (cleanPassword.length < 4) {
      throw new Error("Le mot de passe doit comporter au moins 4 caractères.");
    }

    const cleanSlug = cleanName.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
    const uniqueId = `AG_${cleanSlug || 'PLACE'}_${Date.now().toString().slice(-4)}${Math.floor(10 + Math.random() * 90)}`;
    const initials = cleanName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'AG';

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    const newAgency = {
      agency_id: uniqueId,
      name: cleanName,
      managerName: cleanManager,
      phone: cleanPhone,
      neighborhood: (neighborhood || 'Cocody').trim(),
      city: `${city.trim()}, Côte d'Ivoire`,
      logoInitials: initials,
      currency: "FCFA",
      plan: plan || 'Pro',
      password: cleanPassword,
      monthlyFee: Number(monthlyFee) || 39000,
      subscriptionStatus: "trial",
      subscriptionExpiry: expiryDate.toISOString().split('T')[0],
      paymentMethod: "Wave Business",
      lastPaymentDate: null,
      totalPaidToAdmin: 0,
      createdAt: new Date().toISOString()
    };

    // 1. Sauvegarde immédiate dans Supabase
    await placeproService.createAgency(newAgency);

    // 2. Mise à jour de la liste locale
    setAgencies(prev => [...prev, newAgency]);

    // 3. Connexion immédiate de la cliente à son espace agence (cloisonné)
    setCurrentAgencyId(uniqueId);
    setLastActiveSpace(uniqueId);
    setIsSuperAdmin(false);
    setIsLoggedIn(true);
    setCurrentScreen('dashboard');
    setNavigationHistory(['dashboard']);

    try {
      localStorage.setItem(LAST_SPACE_KEY, uniqueId);
      localStorage.setItem('placepro_is_superadmin', 'false');
      localStorage.setItem('placepro_logged_in', 'true');
    } catch (e) {}

    const newUrl = `${window.location.origin}${window.location.pathname}?agency=${uniqueId}`;
    window.history.pushState({ path: newUrl }, '', newUrl);

    return newAgency;
  };

  // Mettre à jour le mot de passe secret d'une agence
  const updateAgencyPassword = async (agencyId, newPassword) => {
    setAgencies(prev => prev.map(a => 
      a.agency_id === agencyId ? { ...a, password: newPassword } : a
    ));
    const success = await placeproService.updateAgencyPassword(agencyId, newPassword);
    return success;
  };

  // Mettre à jour le forfait d'une agence (Starter, Pro, Annuel)
  const updateAgencyPlan = (agencyId, newPlan, newFee) => {
    setAgencies(prev => prev.map(a => {
      if (a.agency_id === agencyId) {
        return {
          ...a,
          plan: newPlan,
          monthlyFee: Number(newFee)
        };
      }
      return a;
    }));
    placeproService.updateAgencyPlan(agencyId, newPlan, Number(newFee));
  };

  // Super Admin : Prolonger l'abonnement d'une agence (+30 jours par défaut)
  const extendAgencySubscription = (agencyId, daysToAdd = 30, paymentMethod = 'Wave Business', customAmount = null) => {
    const targetAgency = agencies.find(a => a.agency_id === agencyId);
    if (!targetAgency) return;

    const amountPaid = customAmount !== null ? customAmount : (targetAgency.monthlyFee || 39000);
    const today = new Date();
    const currentExpiry = targetAgency.subscriptionExpiry ? new Date(targetAgency.subscriptionExpiry) : today;

    const baseDate = currentExpiry > today ? currentExpiry : today;
    const newExpiryDate = new Date(baseDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const newPayment = {
      id: `subpay-${Date.now()}`,
      agency_id: agencyId,
      agencyName: targetAgency.name,
      amount: amountPaid,
      plan: targetAgency.plan || 'Mensuel Pro',
      method: paymentMethod,
      paymentDate: new Date().toISOString().split('T')[0],
      reference: `${paymentMethod.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`,
      status: "validé",
      notes: `Renouvellement +${daysToAdd} jours PlacePro (${paymentMethod})`
    };

    setSuperAdminPayments(prev => [newPayment, ...prev]);
    placeproService.addSuperAdminPayment(newPayment);

    const updatedSub = {
      subscriptionStatus: 'active',
      subscriptionExpiry: newExpiryDate,
      lastPaymentDate: newPayment.paymentDate,
      paymentMethod,
      totalPaidToAdmin: (targetAgency.totalPaidToAdmin || 0) + amountPaid
    };

    setAgencies(prev => prev.map(a => a.agency_id === agencyId ? { ...a, ...updatedSub } : a));
    placeproService.updateAgencySubscription(agencyId, updatedSub);

    return newPayment;
  };

  // Super Admin : Accorder une extension de période d'essai (ex: +7 jours)
  const grantTrialExtension = (agencyId, days = 7) => {
    const targetAgency = agencies.find(a => a.agency_id === agencyId);
    if (!targetAgency) return;

    const today = new Date();
    const currentExpiry = targetAgency.subscriptionExpiry ? new Date(targetAgency.subscriptionExpiry) : today;
    const baseDate = currentExpiry > today ? currentExpiry : today;
    const newExpiryDate = new Date(baseDate.getTime() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const updatedSub = {
      subscriptionStatus: 'trial',
      subscriptionExpiry: newExpiryDate
    };

    setAgencies(prev => prev.map(a => a.agency_id === agencyId ? { ...a, ...updatedSub } : a));
    placeproService.updateAgencySubscription(agencyId, updatedSub);
  };

  // Super Admin : Bloquer / Débloquer manuellement l'accès d'une agence
  const toggleAgencyLock = (agencyId) => {
    const targetAgency = agencies.find(a => a.agency_id === agencyId);
    if (!targetAgency) return;

    const isLocked = targetAgency.subscriptionStatus === 'expired' || targetAgency.subscriptionStatus === 'suspended';
    const newStatus = isLocked ? 'active' : 'suspended';

    setAgencies(prev => prev.map(a => a.agency_id === agencyId ? { ...a, subscriptionStatus: newStatus } : a));
    placeproService.updateAgencySubscription(agencyId, { subscriptionStatus: newStatus });
  };

  const navigateTo = (screen, entityId = null) => {
    if (screen === 'super-admin') {
      setLastActiveSpace('admin');
      try {
        localStorage.setItem(LAST_SPACE_KEY, 'admin');
      } catch (e) {}
    }
    if (entityId) {
      if (screen === 'candidate-detail') setSelectedCandidateId(entityId);
      if (screen === 'client-detail') setSelectedClientId(entityId);
    }
    setNavigationHistory(prev => [...prev, screen]);
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop();
      const previous = newHistory[newHistory.length - 1];
      setNavigationHistory(newHistory);
      setCurrentScreen(previous);
    } else {
      setCurrentScreen('dashboard');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ========================================================
  // CLOISONNEMENT STRICT PAR AGENCE ACTIVE (MULTI-TENANT)
  // - Si on est sur l'Espace Admin de Cyrille : vue d'ensemble globale de la plateforme
  // - Si on inspecte une agence spécifique : vue strictement cloisonnée sur cette agence
  // ========================================================
  const isAdminSpace = currentAgency.agency_id === 'admin';
  const currentCandidates = isAdminSpace ? state.candidates : state.candidates.filter(c => c.agency_id === currentAgency.agency_id);
  const currentClients = isAdminSpace ? state.clients : state.clients.filter(cl => cl.agency_id === currentAgency.agency_id);
  const currentPlacements = isAdminSpace ? state.placements : state.placements.filter(p => p.agency_id === currentAgency.agency_id);
  const currentPayments = isAdminSpace ? state.payments : state.payments.filter(pay => pay.agency_id === currentAgency.agency_id);
  const currentNotifications = isAdminSpace ? notifications : notifications.filter(n => n.agency_id === currentAgency.agency_id);

  // Compteur notifications non lues
  const unreadNotificationCount = currentNotifications.filter(n => !n.read).length;

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => n.agency_id === currentAgency.agency_id ? { ...n, read: true } : n));
    if (currentAgency.agency_id) {
      placeproService.markAllNotificationsAsRead(currentAgency.agency_id);
    }
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    placeproService.markNotificationAsRead(id);
  };

  // Urgences Portails Employé & Famille
  const sendWorkerEmergency = ({ title, details, urgencyType, authorName, authorPhone, targetId }) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      agency_id: currentAgency.agency_id,
      source: 'worker',
      title,
      details,
      urgencyType,
      authorName,
      authorPhone,
      targetId: targetId || null,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
    placeproService.addNotification(newNotif);
    return newNotif;
  };

  const sendFamilyEmergency = ({ title, details, urgencyType, authorName, authorPhone, targetId }) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      agency_id: currentAgency.agency_id,
      source: 'family',
      title,
      details,
      urgencyType,
      authorName,
      authorPhone,
      targetId: targetId || null,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
    placeproService.addNotification(newNotif);
    return newNotif;
  };

  const getWorkerPortalLink = (candidateId) => {
    return `${getPublicAppUrl()}/?agency=${currentAgency.agency_id}&view=worker&cand=${candidateId}`;
  };

  const getFamilyPortalLink = (clientId) => {
    return `${getPublicAppUrl()}/?agency=${currentAgency.agency_id}&view=family&cli=${clientId}`;
  };

  // ========================================================
  // CALCULS DU TABLEAU DE BORD (TEMPS RÉEL SUR LA BASE)
  // ========================================================
  const totalCandidates = currentCandidates.length;
  const currentlyPlaced = currentCandidates.filter(c => c.status === 'placé').length;

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const moneyToCollectThisMonth = currentPlacements.reduce((total, placement) => {
    if (placement.status !== 'actif') return total;
    const installmentsThisMonth = (placement.installments || []).filter(inst => {
      if (inst.status === 'payé') return false;
      const dueDate = new Date(inst.dueDate);
      return dueDate.getMonth() === currentMonth && dueDate.getFullYear() === currentYear;
    });
    return total + installmentsThisMonth.reduce((subTotal, inst) => subTotal + inst.amount, 0);
  }, 0);

  const oneWeekFromNow = new Date();
  oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

  const contractsEndingThisWeek = currentPlacements.filter(p => {
    if (p.status !== 'actif') return false;
    const endDate = new Date(p.endDate);
    return endDate >= now && endDate <= oneWeekFromNow;
  });
  const contractsEndingThisWeekCount = contractsEndingThisWeek.length;

  // Alertes urgentes
  const urgentItems = [];

  currentPlacements.forEach(placement => {
    if (placement.status !== 'actif') return;
    (placement.installments || []).forEach(inst => {
      const dueDate = new Date(inst.dueDate);
      if (inst.status !== 'payé' && dueDate < now) {
        const candidate = currentCandidates.find(c => c.id === placement.candidateId);
        const client = currentClients.find(c => c.id === placement.clientId);
        urgentItems.push({
          id: `alert-late-${inst.id}`,
          type: 'late_payment',
          title: `Retard de paiement : ${inst.amount?.toLocaleString('fr-FR')} FCFA`,
          description: `${client?.name || 'Famille'} pour ${candidate ? `${candidate.firstName} ${candidate.lastName}` : 'le personnel'}`,
          actionScreen: 'money',
          targetId: placement.id,
          dueDate: inst.dueDate,
          badgeText: "Échu",
          badgeColor: "bg-red-100 text-red-800"
        });
      }
    });
  });

  contractsEndingThisWeek.forEach(placement => {
    const candidate = currentCandidates.find(c => c.id === placement.candidateId);
    const client = currentClients.find(c => c.id === placement.clientId);
    urgentItems.push({
      id: `alert-ending-${placement.id}`,
      type: 'contract_ending',
      title: "Fin de contrat imminente",
      description: `${candidate ? `${candidate.firstName} ${candidate.lastName}` : 'Personnel'} chez ${client?.name || 'Famille'}`,
      actionScreen: 'placements',
      targetId: placement.id,
      dueDate: placement.endDate,
      badgeText: "Bientôt à terme",
      badgeColor: "bg-amber-100 text-amber-800"
    });
  });

  currentCandidates.filter(c => c.status === 'disparu').forEach(cand => {
    urgentItems.push({
      id: `alert-disp-${cand.id}`,
      type: 'disappearance',
      title: `Disparition signalée : ${cand.firstName} ${cand.lastName}`,
      description: cand.disappearanceDetails?.reason || 'Non précisé',
      actionScreen: 'candidate-detail',
      targetId: cand.id,
      dueDate: cand.disappearanceDetails?.date || 'Récent',
      badgeText: "Score : 0 (Risqué)",
      badgeColor: "bg-red-100 text-red-800"
    });
  });

  // ========================================================
  // ACTIONS D'ÉCRITURE SUPABASE
  // ========================================================

  // Action : Ajouter du personnel
  const addCandidate = (candidateData) => {
    const newCand = {
      id: `cand-${Date.now()}`,
      agency_id: currentAgency.agency_id,
      ...candidateData,
      status: 'disponible',
      trustScore: 70,
      currentPlacementId: null,
      scoreHistory: [
        {
          id: `sh-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          change: 0,
          reason: "Enregistrement du profil (score de confiance initial)",
          newScore: 70
        }
      ],
      createdAt: new Date().toISOString()
    };

    setState(prev => ({
      ...prev,
      candidates: [newCand, ...prev.candidates]
    }));

    placeproService.addCandidate(newCand);
    return newCand;
  };

  // Action : Ajouter un Client / Famille
  const addClient = (clientData) => {
    const newClient = {
      id: `cli-${Date.now()}`,
      agency_id: currentAgency.agency_id,
      ...clientData,
      placedStaffCount: 0,
      createdAt: new Date().toISOString()
    };

    setState(prev => ({
      ...prev,
      clients: [newClient, ...prev.clients]
    }));

    placeproService.addClient(newClient);
    return newClient;
  };

  // Action : Créer un Placement
  const addPlacement = (placementData) => {
    const newPlacement = {
      id: `plc-${Date.now()}`,
      agency_id: currentAgency.agency_id,
      ...placementData,
      status: 'actif',
      createdAt: new Date().toISOString()
    };

    setState(prev => {
      const updatedCandidates = prev.candidates.map(c => {
        if (c.id === placementData.candidateId) {
          return {
            ...c,
            status: 'placé',
            currentPlacementId: newPlacement.id,
            scoreHistory: [
              ...c.scoreHistory,
              {
                id: `sh-${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                change: 5,
                reason: `Placement chez ${placementData.clientName || 'employeur'}`,
                newScore: Math.min(100, c.trustScore + 5)
              }
            ],
            trustScore: Math.min(100, c.trustScore + 5)
          };
        }
        return c;
      });

      const updatedClients = prev.clients.map(cl => {
        if (cl.id === placementData.clientId) {
          return { ...cl, placedStaffCount: (cl.placedStaffCount || 0) + 1 };
        }
        return cl;
      });

      return {
        ...prev,
        candidates: updatedCandidates,
        clients: updatedClients,
        placements: [newPlacement, ...prev.placements]
      };
    });

    placeproService.addPlacement(newPlacement);

    const targetClient = state.clients.find(c => c.id === placementData.clientId);
    if (targetClient) {
      placeproService.updateClientStaffCount(targetClient.id, (targetClient.placedStaffCount || 0) + 1);
    }

    return newPlacement;
  };

  // Action : Renouveler un placement
  const renewPlacement = (placementId, newEndDate) => {
    const targetPlc = state.placements.find(p => p.id === placementId);
    setState(prev => ({
      ...prev,
      placements: prev.placements.map(plc => {
        if (plc.id === placementId) {
          return { ...plc, endDate: newEndDate };
        }
        return plc;
      })
    }));

    if (targetPlc) {
      placeproService.renewPlacement(placementId, newEndDate, targetPlc.installments || []);
    }
  };

  // Action : Enregistrer un paiement et délivrer un reçu
  const recordPayment = (paymentData) => {
    const receiptNum = `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPayment = {
      id: `pay-${Date.now()}`,
      agency_id: currentAgency.agency_id,
      receiptNumber: receiptNum,
      ...paymentData
    };

    let updatedPlacement = null;

    setState(prev => {
      const updatedPayments = [newPayment, ...prev.payments];
      const updatedPlacements = prev.placements.map(plc => {
        if (plc.id === paymentData.placementId) {
          const updatedInstallments = (plc.installments || []).map(inst => {
            if (inst.id === paymentData.installmentId || inst.status === 'en_retard') {
              return {
                ...inst,
                status: 'payé',
                paidAt: paymentData.paymentDate,
                paymentMethod: paymentData.paymentMethod,
                receiptNumber: receiptNum
              };
            }
            return inst;
          });
          updatedPlacement = { ...plc, installments: updatedInstallments };
          return updatedPlacement;
        }
        return plc;
      });

      return {
        ...prev,
        payments: updatedPayments,
        placements: updatedPlacements
      };
    });

    placeproService.recordPayment(newPayment, updatedPlacement);
    return newPayment;
  };

  // Action : Signaler une disparition
  const reportDisappearance = (candidateId, reason) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const targetCand = state.candidates.find(c => c.id === candidateId);

    const updatedScoreHistory = [
      ...(targetCand?.scoreHistory || []),
      {
        id: `sh-${Date.now()}`,
        date: todayStr,
        change: -(targetCand?.trustScore || 0),
        reason: `Signalement disparition : ${reason}`,
        newScore: 0
      }
    ];

    const disappearanceDetails = {
      date: todayStr,
      reason: reason,
      reportedBy: "Gérante"
    };

    setState(prev => ({
      ...prev,
      candidates: prev.candidates.map(cand => {
        if (cand.id === candidateId) {
          return {
            ...cand,
            status: 'disparu',
            trustScore: 0,
            disappearanceDetails,
            scoreHistory: updatedScoreHistory
          };
        }
        return cand;
      })
    }));

    placeproService.reportDisappearance(candidateId, disappearanceDetails, updatedScoreHistory);
  };

  const openPaymentForPlacement = (placementId) => {
    const plc = currentPlacements.find(p => p.id === placementId);
    setActivePaymentPlacement(plc);
    setIsRecordPaymentOpen(true);
  };

  const isCurrentAgencyLocked = 
    currentScreen !== 'super-admin' &&
    (currentAgency?.subscriptionStatus === 'expired' || currentAgency?.subscriptionStatus === 'suspended');

  const resetDemoData = () => {
    setState({
      candidates: [],
      clients: [],
      placements: [],
      payments: []
    });
    setNotifications([]);
    setAgencies([]);
    setSuperAdminPayments([]);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(AGENCIES_STORAGE_KEY);
    localStorage.removeItem(NOTIFICATIONS_STORAGE_KEY);
    localStorage.removeItem(ADMIN_PAYMENTS_STORAGE_KEY);
    window.history.pushState({}, '', window.location.pathname);
    setCurrentScreen('login');
  };

  return (
    <AppContext.Provider
      value={{
        agency: currentAgency,
        agencies,
        currentAgencyId,
        isAdminSpace,
        isSuperAdmin,
        switchAgency,
        switchToAdminSpace,
        createAgency,
        registerAgency,
        updateAgencyPlan,
        updateAgencyPassword,
        // Super Admin Abonnements
        superAdminPayments,
        extendAgencySubscription,
        grantTrialExtension,
        toggleAgencyLock,
        isCurrentAgencyLocked,
        candidates: currentCandidates,
        allCandidates: state.candidates,
        clients: currentClients,
        placements: currentPlacements,
        payments: currentPayments,
        notifications: currentNotifications,
        unreadNotificationCount,
        markAllNotificationsAsRead,
        markNotificationAsRead,
        sendWorkerEmergency,
        sendFamilyEmergency,
        getWorkerPortalLink,
        getFamilyPortalLink,
        portalView,
        setPortalView,
        portalEntityId,
        setPortalEntityId,
        currentScreen,
        selectedCandidateId,
        selectedClientId,
        navigateTo,
        goBack,
        resetDemoData,
        // Chiffres clés
        totalCandidates,
        currentlyPlaced,
        moneyToCollectThisMonth,
        contractsEndingThisWeekCount,
        urgentItems,
        // Actions
        addCandidate,
        addClient,
        addPlacement,
        renewPlacement,
        recordPayment,
        reportDisappearance,
        openPaymentForPlacement,
        activePaymentPlacement,
        // Modales & Navigation Mobile & Auth
        isLoggedIn,
        setIsSuperAdmin,
        adminPassword,
        updateAdminPassword,
        lastActiveSpace,
        setLastActiveSpace,
        loginAsSuperAdmin,
        logout,
        login,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isAddCandidateOpen,
        setIsAddCandidateOpen,
        isAddClientOpen,
        setIsAddClientOpen,
        isNewPlacementOpen,
        setIsNewPlacementOpen,
        isRecordPaymentOpen,
        setIsRecordPaymentOpen,
        isCreateAgencyOpen,
        setIsCreateAgencyOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isPaymentModalOpen,
        setIsPaymentModalOpen,
        paymentModalData,
        openSubscriptionPayment
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp doit être utilisé dans un AppProvider');
  }
  return context;
}
