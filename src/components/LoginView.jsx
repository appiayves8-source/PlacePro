import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ADMIN_CONFIG } from '../config/adminConfig';

export default function LoginView() {
  const { 
    agencies, 
    login, 
    loginAsSuperAdmin, 
    adminPassword,
    updateAdminPassword,
    lastActiveSpace,
    updateAgencyPassword, 
    setIsCreateAgencyOpen 
  } = useApp();

  // Initialisation de l'espace sélectionné : par défaut le dernier espace actif (ex: 'admin' ou id d'agence)
  const [selectedSpace, setSelectedSpace] = useState(() => {
    if (lastActiveSpace === 'admin') return 'admin';
    if (lastActiveSpace && agencies.some(a => a.agency_id === lastActiveSpace)) return lastActiveSpace;
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

  // États pour le changement de mot de passe
  const [isChangingPassword, setIsChangingPassword] = useState(false);
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

  const currentProvisionalPassword = isAdminSpace 
    ? (adminPassword || '0000') 
    : (selectedAgency?.password || '1234');

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
        setError("Mot de passe administrateur incorrect (Code par défaut : 0000 ou cliquez sur 'Changer de mot de passe' ci-dessous).");
        return;
      }
    }

    // 2. Connexion à un espace Agence
    // Le code maître de Cyrille (0000 ou mot de passe admin) donne également accès Super Admin
    if (password.trim() === adminPassword || password.trim() === '0000' || password.trim() === 'admin') {
      loginAsSuperAdmin();
      return;
    }

    const expectedPassword = selectedAgency?.password || '1234';
    if (password.trim() !== expectedPassword) {
      setError(`Mot de passe incorrect pour cette agence. Si vous ne l'avez pas changé, le code est "${expectedPassword}" ou cliquez sur "Changer de mot de passe" ci-dessous.`);
      return;
    }

    login(selectedSpace);
  };

  // Soumission de modification du mot de passe
  const handlePasswordChangeSubmit = (e) => {
    e.preventDefault();
    setPasswordChangeError(null);

    if (!newPassword.trim()) {
      setPasswordChangeError("Veuillez saisir votre nouveau mot de passe.");
      return;
    }
    if (newPassword.trim().length < 4) {
      setPasswordChangeError("Le mot de passe doit comporter au moins 4 caractères.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordChangeError("Les deux mots de passe saisis ne sont pas identiques.");
      return;
    }

    if (isAdminSpace) {
      updateAdminPassword(newPassword.trim());
      setSuccessMsg("Mot de passe Super Admin enregistré avec succès ! Connexion à la Console...");
      setTimeout(() => {
        loginAsSuperAdmin();
      }, 700);
    } else {
      if (updateAgencyPassword && selectedSpace) {
        updateAgencyPassword(selectedSpace, newPassword.trim());
      }
      setSuccessMsg(`Mot de passe pour ${selectedSpaceName} enregistré avec succès ! Connexion...`);
      setTimeout(() => {
        login(selectedSpace);
      }, 700);
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
        maxWidth: '460px',
        width: '100%',
        padding: '36px 28px',
        boxShadow: '0 20px 40px -10px rgba(14, 26, 58, 0.12)',
        border: '1.5px solid var(--color-border)',
        position: 'relative'
      }}>
        {/* Brand Logo PlacePro */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '22px', textAlign: 'center' }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'linear-gradient(135deg, var(--color-gold) 0%, #B88E1F 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-navy)',
            fontWeight: '900',
            fontSize: '26px',
            boxShadow: '0 8px 18px rgba(212, 167, 44, 0.3)',
            marginBottom: '12px'
          }}>
            P
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--color-navy)', margin: 0, letterSpacing: '-0.5px' }}>
            PlacePro
          </h1>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px', maxWidth: '340px' }}>
            Portail de gestion et suivi du personnel de maison en Côte d'Ivoire
          </p>
        </div>

        {/* Message informatif d'état */}
        {!isChangingPassword ? (
          <div style={{
            backgroundColor: '#FAF5EA',
            border: '1px solid var(--color-gold-border)',
            borderRadius: '12px',
            padding: '12px 14px',
            marginBottom: '22px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '18px' }}>🔒</span>
            <div style={{ fontSize: '12px', color: 'var(--color-navy)', fontWeight: '600', lineHeight: 1.4 }}>
              Session sécurisée. Identifiez-vous pour accéder à votre tableau de bord.
            </div>
          </div>
        ) : (
          <div style={{
            backgroundColor: '#EEF2FF',
            border: '1px solid #C7D2FE',
            borderRadius: '12px',
            padding: '12px 14px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '20px' }}>🔑</span>
            <div>
              <div style={{ fontSize: '13px', color: '#1E1B4B', fontWeight: '800' }}>
                Modification du mot de passe
              </div>
              <div style={{ fontSize: '11.5px', color: '#4338CA', marginTop: '2px' }}>
                Espace : <strong>{selectedSpaceName}</strong>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            MODE 1 : FORMULAIRE DE CONNEXION PRINCIPAL
            ======================================================== */}
        {!isChangingPassword ? (
          <form onSubmit={handleLoginSubmit}>
            {/* 1. Nom d'utilisateur / Espace (DÉJÀ LÀ) */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--color-navy)', marginBottom: '6px' }}>
                Nom d'utilisateur / Espace *
              </label>

              {agencies.length === 0 ? (
                /* Quand aucune agence n'existe encore en base, l'espace Admin Cyrille est déjà là */
                <div style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1.5px solid var(--color-gold)',
                  backgroundColor: 'rgba(212, 167, 44, 0.08)',
                  color: 'var(--color-navy)',
                  fontSize: '13.5px',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '16px' }}>👑</span>
                  <span>Administration PlacePro (Cyrille)</span>
                </div>
              ) : (
                /* Quand des agences existent, le sélecteur permet de choisir, prérempli avec le dernier espace */
                <select
                  value={selectedSpace}
                  onChange={(e) => {
                    setSelectedSpace(e.target.value);
                    setError(null);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid var(--color-border)',
                    backgroundColor: '#F8FAFC',
                    color: 'var(--color-navy)',
                    fontSize: '13.5px',
                    fontWeight: '700',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="admin">👑 Administration PlacePro (Cyrille)</option>
                  {agencies.map(ag => (
                    <option key={ag.agency_id} value={ag.agency_id}>
                      🏢 {ag.name} ({ag.neighborhood || ag.city})
                    </option>
                  ))}
                </select>
              )}
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
                  style={{ background: 'none', border: 'none', color: 'var(--color-gold)', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
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
                  borderRadius: '10px',
                  border: '1.5px solid var(--color-border)',
                  backgroundColor: '#FFFFFF',
                  fontSize: '13.5px',
                  color: 'var(--color-navy)',
                  outline: 'none'
                }}
              />

              {error && (
                <div style={{ marginTop: '6px', padding: '8px 10px', backgroundColor: '#FEF2F2', borderRadius: '8px', border: '1px solid #FECACA' }}>
                  <p style={{ color: '#B91C1C', fontSize: '11.5px', margin: 0, lineHeight: 1.35 }}>
                    {error}
                  </p>
                </div>
              )}
            </div>

            {/* 3. Changer de mot de passe (JUSTE EN DESSOUS DU MOT DE PASSE) */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '18px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => {
                  setIsChangingPassword(true);
                  setError(null);
                  setPasswordChangeError(null);
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
                  padding: '4px 6px',
                  borderRadius: '6px'
                }}
              >
                <span>🔑</span>
                <span style={{ textDecoration: 'underline' }}>Changer de mot de passe</span>
              </button>
            </div>

            {/* 4. Bouton de Connexion */}
            <button
              type="submit"
              className="btn"
              style={{
                backgroundColor: 'var(--color-gold)',
                color: 'var(--color-navy)',
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '900',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(212, 167, 44, 0.35)',
                marginBottom: '16px',
                cursor: 'pointer'
              }}
            >
              <span>Se connecter à {isAdminSpace ? "la Console Administrateur" : (selectedAgency?.name || "mon espace")}</span>
              <span>→</span>
            </button>

            {/* 5. Inscrire un nouvel espace agence */}
            <div style={{ textAlign: 'center', marginBottom: '14px' }}>
              <button
                type="button"
                onClick={() => setIsCreateAgencyOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#475569',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                + Inscrire un nouvel espace agence de placement
              </button>
            </div>
          </form>
        ) : (
          /* ========================================================
             MODE 2 : MODIFIER LE MOT DE PASSE (AVEC CODE FALSIFIÉ / PROVISOIRE)
             ======================================================== */
          <form onSubmit={handlePasswordChangeSubmit}>
            {/* Espace concerné */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--color-navy)', marginBottom: '6px' }}>
                Espace sélectionné :
              </label>
              {agencies.length === 0 ? (
                <div style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1.5px solid var(--color-border)',
                  backgroundColor: '#F8FAFC',
                  color: 'var(--color-navy)',
                  fontSize: '13px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>👑</span>
                  <span>Administration PlacePro (Cyrille)</span>
                </div>
              ) : (
                <select
                  value={selectedSpace}
                  onChange={(e) => {
                    setSelectedSpace(e.target.value);
                    setPasswordChangeError(null);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid var(--color-border)',
                    backgroundColor: '#F8FAFC',
                    color: 'var(--color-navy)',
                    fontSize: '13px',
                    fontWeight: '700',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="admin">👑 Administration PlacePro (Cyrille)</option>
                  {agencies.map(ag => (
                    <option key={ag.agency_id} value={ag.agency_id}>
                      🏢 {ag.name} ({ag.neighborhood || ag.city})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Affichage du mot de passe actuel / provisoire (mot de passe falsifié) */}
            <div style={{
              backgroundColor: '#F8FAFC',
              border: '1.5px dashed #CBD5E1',
              borderRadius: '12px',
              padding: '12px 14px',
              marginBottom: '18px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  Mot de passe actuel / provisoire
                </span>
                <span style={{ fontSize: '10.5px', fontWeight: '700', backgroundColor: '#FEF3C7', color: '#B45309', padding: '2px 8px', borderRadius: '4px' }}>
                  Code actif
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <code style={{
                  fontSize: '16px',
                  fontWeight: '900',
                  color: 'var(--color-navy)',
                  backgroundColor: '#FFFFFF',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border)',
                  letterSpacing: '1px'
                }}>
                  {currentProvisionalPassword}
                </code>
                <span style={{ fontSize: '11px', color: '#64748B' }}>
                  {isAdminSpace ? "(Code maître Super Admin par défaut)" : "(Code agence par défaut)"}
                </span>
              </div>
            </div>

            {/* Champ 1 : Nouveau mot de passe */}
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
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1.5px solid var(--color-border)',
                  backgroundColor: '#FFFFFF',
                  fontSize: '13.5px',
                  color: 'var(--color-navy)',
                  outline: 'none'
                }}
              />
            </div>

            {/* Champ 2 : Confirmer nouveau mot de passe */}
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
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1.5px solid var(--color-border)',
                  backgroundColor: '#FFFFFF',
                  fontSize: '13.5px',
                  color: 'var(--color-navy)',
                  outline: 'none'
                }}
              />
            </div>

            {passwordChangeError && (
              <div style={{
                marginBottom: '16px',
                padding: '10px 12px',
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
                marginBottom: '16px',
                padding: '10px 12px',
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
                padding: '14px',
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
                opacity: successMsg ? 0.7 : 1
              }}
            >
              <span>Enregistrer et accéder au tableau de bord</span>
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
                padding: '10px',
                background: 'none',
                border: 'none',
                color: '#64748B',
                fontSize: '12.5px',
                fontWeight: '700',
                cursor: 'pointer',
                marginBottom: '16px'
              }}
            >
              ← Annuler et revenir à la connexion
            </button>
          </form>
        )}

        {/* Assistance directe WhatsApp */}
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#64748B' }}>
            Assistance directe WhatsApp :{' '}
            <a
              href={ADMIN_CONFIG.getWhatsAppLink("Bonjour Cyrille, j'ai besoin d'aide pour mon espace PlacePro.")}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--color-gold)', fontWeight: '700', textDecoration: 'none' }}
            >
              {ADMIN_CONFIG.phoneFormatted}
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
