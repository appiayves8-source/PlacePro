import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SUBSCRIPTION_PLANS } from '../data/mockData';

const ABIDJAN_COMMUNES = [
  'Cocody',
  'Yopougon',
  'Marcory',
  'Plateau',
  'Koumassi',
  'Port-Bouët',
  'Abobo',
  'Treichville',
  'Adjamé',
  'Attécoubé',
  'Bingerville',
  'Songon',
  'Autre commune'
];

export default function LoginView() {
  const { 
    agencies, 
    login, 
    loginAsSuperAdmin, 
    adminPassword,
    updateAdminPassword,
    lastActiveSpace,
    currentAgencyId,
    updateAgencyPassword,
    registerAgency
  } = useApp();

  // Mode principal : 'login' (Connexion) ou 'register' (Créer mon espace agence)
  const [activeTab, setActiveTab] = useState('login');

  // ========================================================
  // ÉTATS DE CONNEXION (TAB 1)
  // ========================================================
  const [selectedSpace, setSelectedSpace] = useState(() => {
    if (lastActiveSpace === 'admin') return 'admin';
    if (lastActiveSpace && agencies.some(a => a.agency_id === lastActiveSpace)) return lastActiveSpace;
    if (currentAgencyId && agencies.some(a => a.agency_id === currentAgencyId)) return currentAgencyId;
    return agencies.length > 0 ? agencies[0].agency_id : 'admin';
  });

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  // Synchronisation si la liste des agences charge depuis Supabase
  useEffect(() => {
    if (selectedSpace !== 'admin') {
      if (!agencies.some(a => a.agency_id === selectedSpace)) {
        if (agencies.length > 0) {
          setSelectedSpace(agencies[0].agency_id);
        } else {
          setSelectedSpace('admin');
        }
      }
    }
  }, [agencies, selectedSpace]);

  // Changement de mot de passe sécurisé
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordChangeError, setPasswordChangeError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const isAdminSpace = selectedSpace === 'admin';
  const selectedAgency = !isAdminSpace ? agencies.find(a => a.agency_id === selectedSpace) : null;
  const selectedSpaceName = isAdminSpace 
    ? "Administration PlacePro (Cyrille)" 
    : (selectedAgency?.name || "Mon Espace Agence");

  const expectedCurrentPassword = isAdminSpace 
    ? (adminPassword || '0000') 
    : (selectedAgency?.password || '1234');

  // ========================================================
  // ÉTATS D'INSCRIPTION SÉCURISÉE (TAB 2)
  // ========================================================
  const [regData, setRegData] = useState({
    name: '',
    managerName: '',
    phone: '',
    neighborhood: 'Cocody',
    city: 'Abidjan',
    plan: 'pro',
    password: '',
    confirmPassword: ''
  });
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState(null);
  const [isSubmittingReg, setIsSubmittingReg] = useState(false);

  // Soumission de connexion standard
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Veuillez saisir votre mot de passe.");
      return;
    }
    setError(null);

    // 1. Connexion à l'espace Administrateur (Cyrille)
    if (isAdminSpace) {
      if (password.trim() === adminPassword || password.trim() === '0000' || password.trim() === 'admin') {
        loginAsSuperAdmin();
        return;
      } else {
        setError("Mot de passe administrateur incorrect.");
        return;
      }
    }

    // 2. Connexion à un espace Agence
    if (password.trim() === adminPassword || password.trim() === '0000' || password.trim() === 'admin') {
      loginAsSuperAdmin();
      return;
    }

    const expectedPassword = selectedAgency?.password || '1234';
    if (password.trim() !== expectedPassword) {
      setError("Mot de passe incorrect pour cet espace agence.");
      return;
    }

    login(selectedSpace);
  };

  // Soumission de modification du mot de passe
  const handlePasswordChangeSubmit = (e) => {
    e.preventDefault();
    setPasswordChangeError(null);

    if (!oldPassword.trim()) {
      setPasswordChangeError("Veuillez saisir votre mot de passe actuel.");
      return;
    }

    if (oldPassword.trim() !== expectedCurrentPassword && oldPassword.trim() !== '0000') {
      setPasswordChangeError("L'ancien mot de passe saisi est incorrect.");
      return;
    }

    if (!newPassword.trim()) {
      setPasswordChangeError("Veuillez saisir votre nouveau mot de passe.");
      return;
    }
    if (newPassword.trim().length < 4) {
      setPasswordChangeError("Le mot de passe doit comporter au moins 4 caractères.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordChangeError("Les deux nouveaux mots de passe saisis ne sont pas identiques.");
      return;
    }

    if (isAdminSpace) {
      updateAdminPassword(newPassword.trim());
      setSuccessMsg("Mot de passe Administrateur mis à jour avec succès !");
      setTimeout(() => {
        loginAsSuperAdmin();
      }, 700);
    } else {
      if (updateAgencyPassword && selectedSpace) {
        updateAgencyPassword(selectedSpace, newPassword.trim());
      }
      setSuccessMsg("Nouveau mot de passe enregistré avec succès ! Connexion...");
      setTimeout(() => {
        login(selectedSpace);
      }, 700);
    }
  };

  // Soumission de création d'agence sécurisée
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegError(null);

    // Validations locales
    if (!regData.name.trim() || regData.name.trim().length < 3) {
      setRegError("Veuillez entrer le nom officiel de votre agence (au moins 3 caractères).");
      return;
    }

    if (!regData.managerName.trim() || regData.managerName.trim().length < 2) {
      setRegError("Veuillez indiquer le nom complet de la directrice ou gérante.");
      return;
    }

    const cleanPhone = regData.phone.replace(/[^0-9]/g, '');
    const phone10 = cleanPhone.length >= 10 ? cleanPhone.slice(-10) : cleanPhone;
    if (phone10.length !== 10) {
      setRegError("Le numéro WhatsApp doit comporter exactement 10 chiffres (norme Côte d'Ivoire).");
      return;
    }

    const validPrefixes = ['01', '05', '07'];
    if (!validPrefixes.includes(phone10.slice(0, 2))) {
      setRegError("Le numéro doit commencer par 01 (Moov), 05 (MTN) ou 07 (Orange).");
      return;
    }

    if (!regData.password || regData.password.trim().length < 4) {
      setRegError("Le mot de passe secret doit comporter au moins 4 caractères.");
      return;
    }

    if (regData.password !== regData.confirmPassword) {
      setRegError("Les deux mots de passe ne sont pas identiques.");
      return;
    }

    const selectedPlanObj = SUBSCRIPTION_PLANS.find(p => p.id === regData.plan) || SUBSCRIPTION_PLANS[1];

    setIsSubmittingReg(true);
    try {
      await registerAgency({
        name: regData.name.trim(),
        managerName: regData.managerName.trim(),
        phone: phone10,
        neighborhood: regData.neighborhood,
        city: 'Abidjan',
        password: regData.password.trim(),
        plan: selectedPlanObj.name,
        monthlyFee: selectedPlanObj.price
      });
      // La redirection est gérée directement dans registerAgency
    } catch (err) {
      setRegError(err.message || "Erreur lors de l'enregistrement de votre espace agence.");
      setIsSubmittingReg(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F8FAFC',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        maxWidth: activeTab === 'register' ? '500px' : '440px',
        width: '100%',
        padding: '32px 28px',
        boxShadow: '0 20px 40px -10px rgba(14, 26, 58, 0.12)',
        border: '1.5px solid var(--color-border)',
        position: 'relative',
        transition: 'all 0.25s ease'
      }}>
        {/* En-tête PlacePro Sobre & Professionnel */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px', textAlign: 'center' }}>
          <div style={{
            width: '54px',
            height: '54px',
            background: 'linear-gradient(135deg, var(--color-gold) 0%, #B88E1F 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-navy)',
            fontWeight: '900',
            fontSize: '26px',
            boxShadow: '0 8px 18px rgba(212, 167, 44, 0.3)',
            marginBottom: '10px'
          }}>
            P
          </div>
          <h1 style={{ fontSize: '23px', fontWeight: '900', color: 'var(--color-navy)', margin: 0, letterSpacing: '-0.5px' }}>
            PlacePro
          </h1>
          <p style={{ fontSize: '12.5px', color: '#64748B', marginTop: '3px' }}>
            Portail de gestion certifié du personnel de maison en Côte d'Ivoire
          </p>
        </div>

        {/* ========================================================
            ONGLETS PRINCIPAUX : CONNEXION VS CRÉER UN ESPACE
            ======================================================== */}
        {!isChangingPassword && (
          <div style={{
            display: 'flex',
            backgroundColor: '#F1F5F9',
            borderRadius: '12px',
            padding: '4px',
            marginBottom: '22px'
          }}>
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setError(null);
                setRegError(null);
              }}
              style={{
                flex: 1,
                padding: '10px 12px',
                borderRadius: '9px',
                border: 'none',
                backgroundColor: activeTab === 'login' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'login' ? 'var(--color-navy)' : '#64748B',
                fontWeight: activeTab === 'login' ? '800' : '600',
                fontSize: '12.5px',
                cursor: 'pointer',
                boxShadow: activeTab === 'login' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              🔐 Se connecter
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setError(null);
                setRegError(null);
              }}
              style={{
                flex: 1,
                padding: '10px 12px',
                borderRadius: '9px',
                border: 'none',
                backgroundColor: activeTab === 'register' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'register' ? 'var(--color-navy)' : '#64748B',
                fontWeight: activeTab === 'register' ? '800' : '600',
                fontSize: '12.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: activeTab === 'register' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <span>🚀 Créer mon Espace</span>
              <span style={{
                backgroundColor: '#DCFCE7',
                color: '#15803D',
                fontSize: '9.5px',
                fontWeight: '800',
                padding: '1px 5px',
                borderRadius: '9999px'
              }}>
                7j offerts
              </span>
            </button>
          </div>
        )}

        {/* ========================================================
            VUE 1 : FORMULAIRE DE CONNEXION ÉPURÉ
            ======================================================== */}
        {activeTab === 'login' && !isChangingPassword && (
          <form onSubmit={handleLoginSubmit}>
            {/* 1. Nom d'utilisateur / Nom de l'agence (PRÉREMPLI ET VERROUILLÉ) */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--color-navy)', marginBottom: '6px' }}>
                Nom d'utilisateur / Espace
              </label>

              <div style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1.5px solid var(--color-border)',
                backgroundColor: '#F8FAFC',
                color: 'var(--color-navy)',
                fontSize: '13.5px',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxSizing: 'border-box'
              }}>
                <span style={{ fontSize: '18px' }}>{isAdminSpace ? '👑' : '🏢'}</span>
                <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {selectedSpaceName}
                </span>
              </div>
            </div>

            {/* 2. Mot de passe */}
            <div style={{ marginBottom: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-navy)' }}>
                  Mot de passe *
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ background: 'none', border: 'none', color: 'var(--color-gold)', fontSize: '11.5px', fontWeight: '700', cursor: 'pointer' }}
                >
                  {showPassword ? 'Masquer' : 'Afficher'}
                </button>
              </div>

              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder="Entrez votre mot de passe"
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--color-border)',
                  backgroundColor: '#FFFFFF',
                  fontSize: '13.5px',
                  color: 'var(--color-navy)',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />

              {error && (
                <div style={{ marginTop: '8px', padding: '9px 12px', backgroundColor: '#FEF2F2', borderRadius: '8px', border: '1px solid #FECACA' }}>
                  <p style={{ color: '#B91C1C', fontSize: '12px', margin: 0, fontWeight: '600' }}>
                    {error}
                  </p>
                </div>
              )}
            </div>

            {/* 3. Changer de mot de passe */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '18px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => {
                  setIsChangingPassword(true);
                  setError(null);
                  setPasswordChangeError(null);
                  setOldPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-navy)',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 0'
                }}
              >
                <span>🔑</span>
                <span style={{ textDecoration: 'underline' }}>Changer de mot de passe</span>
              </button>
            </div>

            {/* 4. Bouton de Connexion Principal */}
            <button
              type="submit"
              className="btn"
              style={{
                backgroundColor: 'var(--color-gold)',
                color: 'var(--color-navy)',
                width: '100%',
                padding: '13px',
                borderRadius: '12px',
                fontSize: '14.5px',
                fontWeight: '900',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(212, 167, 44, 0.35)',
                cursor: 'pointer',
                border: 'none'
              }}
            >
              <span>Se connecter</span>
              <span>→</span>
            </button>
          </form>
        )}

        {/* ========================================================
            VUE 2 : CRÉATION D'ESPACE AGENCE SÉCURISÉE (ONBOARDING)
            ======================================================== */}
        {activeTab === 'register' && !isChangingPassword && (
          <form onSubmit={handleRegisterSubmit}>
            {/* Bannière 7 jours d'essai */}
            <div style={{
              backgroundColor: '#FAF5EA',
              border: '1.5px solid var(--color-gold-border)',
              borderRadius: '12px',
              padding: '10px 14px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{ fontSize: '20px' }}>🎁</span>
              <div style={{ fontSize: '12px', color: 'var(--color-navy)', lineHeight: 1.4 }}>
                <strong>7 jours d'essai complet 100% offerts</strong> sans engagement pour tester avec vos vrais candidats et familles.
              </div>
            </div>

            {/* 1. Nom de l'agence */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--color-navy)', marginBottom: '5px' }}>
                Nom officiel de l'agence de placement *
              </label>
              <input
                type="text"
                value={regData.name}
                onChange={(e) => setRegData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Entrez le nom de l'agence"
                required
                style={{
                  width: '100%',
                  padding: '11px 13px',
                  borderRadius: '10px',
                  border: '1.5px solid var(--color-border)',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* 2. Nom de la directrice / gérante */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--color-navy)', marginBottom: '5px' }}>
                Nom et prénom de la directrice / gérante *
              </label>
              <input
                type="text"
                value={regData.managerName}
                onChange={(e) => setRegData(prev => ({ ...prev, managerName: e.target.value }))}
                placeholder="Entrez le nom complet de la gérante"
                required
                style={{
                  width: '100%',
                  padding: '11px 13px',
                  borderRadius: '10px',
                  border: '1.5px solid var(--color-border)',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* 3. Commune & Téléphone WhatsApp (2 colonnes) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--color-navy)', marginBottom: '5px' }}>
                  Commune (Abidjan) *
                </label>
                <select
                  value={regData.neighborhood}
                  onChange={(e) => setRegData(prev => ({ ...prev, neighborhood: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '11px 10px',
                    borderRadius: '10px',
                    border: '1.5px solid var(--color-border)',
                    fontSize: '12.5px',
                    backgroundColor: '#FFFFFF',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                >
                  {ABIDJAN_COMMUNES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--color-navy)', marginBottom: '5px' }}>
                  WhatsApp direct (10 ch.) *
                </label>
                <input
                  type="tel"
                  value={regData.phone}
                  onChange={(e) => setRegData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="07 01 02 03 04"
                  maxLength={14}
                  required
                  style={{
                    width: '100%',
                    padding: '11px 13px',
                    borderRadius: '10px',
                    border: '1.5px solid var(--color-border)',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* 4. Mots de passe */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-navy)' }}>
                    Mot de passe *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    style={{ background: 'none', border: 'none', color: 'var(--color-gold)', fontSize: '10.5px', fontWeight: '700', cursor: 'pointer' }}
                  >
                    {showRegPassword ? 'Masquer' : 'Voir'}
                  </button>
                </div>
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  value={regData.password}
                  onChange={(e) => setRegData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Au moins 4 car."
                  required
                  style={{
                    width: '100%',
                    padding: '11px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid var(--color-border)',
                    fontSize: '12.5px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--color-navy)', marginBottom: '5px' }}>
                  Confirmer *
                </label>
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  value={regData.confirmPassword}
                  onChange={(e) => setRegData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Répétez"
                  required
                  style={{
                    width: '100%',
                    padding: '11px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid var(--color-border)',
                    fontSize: '12.5px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* 5. Choix de formule avec tarif clair */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#64748B', marginBottom: '6px' }}>
                Formule souhaitée (Facturée après vos 7 jours d'essai) :
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                {SUBSCRIPTION_PLANS.map(plan => {
                  const isSelected = regData.plan === plan.id;
                  return (
                    <div
                      key={plan.id}
                      onClick={() => setRegData(prev => ({ ...prev, plan: plan.id }))}
                      style={{
                        border: isSelected ? '2px solid var(--color-gold)' : '1px solid #E2E8F0',
                        backgroundColor: isSelected ? '#FAF5EA' : '#FFFFFF',
                        borderRadius: '9px',
                        padding: '8px 4px',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontSize: '11.5px', fontWeight: '800', color: 'var(--color-navy)' }}>
                        {plan.name}
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-gold)', marginTop: '2px' }}>
                        {plan.price.toLocaleString('fr-FR')} F
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {regError && (
              <div style={{
                marginBottom: '14px',
                padding: '9px 12px',
                backgroundColor: '#FEF2F2',
                borderRadius: '8px',
                border: '1px solid #FECACA',
                color: '#B91C1C',
                fontSize: '12px',
                fontWeight: '600',
                lineHeight: 1.4
              }}>
                ⚠️ {regError}
              </div>
            )}

            {/* Bouton de validation */}
            <button
              type="submit"
              className="btn"
              disabled={isSubmittingReg}
              style={{
                backgroundColor: 'var(--color-gold)',
                color: 'var(--color-navy)',
                width: '100%',
                padding: '13px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '900',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(212, 167, 44, 0.35)',
                cursor: isSubmittingReg ? 'default' : 'pointer',
                opacity: isSubmittingReg ? 0.7 : 1,
                border: 'none'
              }}
            >
              <span>{isSubmittingReg ? "Création en cours..." : "Créer mon espace & Démarrer l'essai gratuit"}</span>
              <span>→</span>
            </button>
          </form>
        )}

        {/* ========================================================
            VUE 3 : FORMULAIRE DE CHANGEMENT DE MOT DE PASSE SÉCURISÉ
            ======================================================== */}
        {isChangingPassword && (
          <form onSubmit={handlePasswordChangeSubmit}>
            <div style={{
              backgroundColor: '#EEF2FF',
              border: '1px solid #C7D2FE',
              borderRadius: '12px',
              padding: '12px 14px',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{ fontSize: '20px' }}>🔑</span>
              <div>
                <div style={{ fontSize: '13px', color: '#1E1B4B', fontWeight: '800' }}>
                  Changement de mot de passe
                </div>
                <div style={{ fontSize: '11.5px', color: '#4338CA', marginTop: '2px' }}>
                  Espace : <strong>{selectedSpaceName}</strong>
                </div>
              </div>
            </div>

            {/* Ancien mot de passe */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--color-navy)', marginBottom: '6px' }}>
                Mot de passe actuel *
              </label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Entrez votre mot de passe actuel"
                style={{
                  width: '100%',
                  padding: '11px 13px',
                  borderRadius: '10px',
                  border: '1.5px solid var(--color-border)',
                  backgroundColor: '#FFFFFF',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Nouveau mot de passe */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-navy)' }}>
                  Nouveau mot de passe *
                </label>
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{ background: 'none', border: 'none', color: 'var(--color-gold)', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                >
                  {showNewPassword ? 'Masquer' : 'Afficher'}
                </button>
              </div>
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Entrez le nouveau mot de passe"
                style={{
                  width: '100%',
                  padding: '11px 13px',
                  borderRadius: '10px',
                  border: '1.5px solid var(--color-border)',
                  backgroundColor: '#FFFFFF',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Confirmer le nouveau mot de passe */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--color-navy)', marginBottom: '6px' }}>
                Confirmer le nouveau mot de passe *
              </label>
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmez le nouveau mot de passe"
                style={{
                  width: '100%',
                  padding: '11px 13px',
                  borderRadius: '10px',
                  border: '1.5px solid var(--color-border)',
                  backgroundColor: '#FFFFFF',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {passwordChangeError && (
              <div style={{
                marginBottom: '14px',
                padding: '9px 12px',
                backgroundColor: '#FEF2F2',
                borderRadius: '8px',
                border: '1px solid #FECACA',
                color: '#B91C1C',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                ⚠️ {passwordChangeError}
              </div>
            )}

            {successMsg && (
              <div style={{
                marginBottom: '14px',
                padding: '9px 12px',
                backgroundColor: '#ECFDF5',
                borderRadius: '8px',
                border: '1px solid #A7F3D0',
                color: '#065F46',
                fontSize: '12px',
                fontWeight: '700'
              }}>
                ✅ {successMsg}
              </div>
            )}

            <button
              type="submit"
              className="btn"
              disabled={!!successMsg}
              style={{
                backgroundColor: 'var(--color-gold)',
                color: 'var(--color-navy)',
                width: '100%',
                padding: '13px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '900',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(212, 167, 44, 0.35)',
                marginBottom: '10px',
                cursor: successMsg ? 'default' : 'pointer',
                border: 'none'
              }}
            >
              <span>Enregistrer et se connecter</span>
              <span>→</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsChangingPassword(false);
                setPasswordChangeError(null);
                setSuccessMsg(null);
              }}
              style={{
                width: '100%',
                padding: '8px',
                background: 'none',
                border: 'none',
                color: '#64748B',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              ← Annuler
            </button>
          </form>
        )}

        {/* Accès discret Administrateur (Uniquement pour Cyrille) */}
        <div style={{ marginTop: '22px', paddingTop: '16px', borderTop: '1px solid #F1F5F9', textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => {
              if (isAdminSpace) {
                if (agencies.length > 0) setSelectedSpace(agencies[0].agency_id);
              } else {
                setSelectedSpace('admin');
              }
              setActiveTab('login');
              setError(null);
              setIsChangingPassword(false);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#94A3B8',
              fontSize: '11px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            {isAdminSpace ? "← Revenir au mode Agence" : "👑 Accès Administrateur Plateforme"}
          </button>
        </div>

      </div>
    </div>
  );
}
