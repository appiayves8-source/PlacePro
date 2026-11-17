import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function LoginView() {
  const { 
    agencies, 
    login, 
    loginAsSuperAdmin, 
    adminPassword,
    updateAdminPassword,
    lastActiveSpace,
    currentAgencyId,
    updateAgencyPassword
  } = useApp();

  // Détermination de l'espace actif : soit 'admin', soit l'agence mémorisée
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

  // États pour le changement de mot de passe sécurisé
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
    // Le code maître de Cyrille donne également accès Super Admin
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

    // Vérification de l'ancien mot de passe
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
        maxWidth: '430px',
        width: '100%',
        padding: '36px 28px',
        boxShadow: '0 20px 40px -10px rgba(14, 26, 58, 0.12)',
        border: '1.5px solid var(--color-border)',
        position: 'relative'
      }}>
        {/* En-tête PlacePro Sobre */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px', textAlign: 'center' }}>
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
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
            Portail de gestion et suivi du personnel de maison
          </p>
        </div>

        {/* ========================================================
            MODE 1 : FORMULAIRE DE CONNEXION ÉPURÉ
            ======================================================== */}
        {!isChangingPassword ? (
          <form onSubmit={handleLoginSubmit}>
            {/* 1. Nom d'utilisateur / Nom de l'agence (PRÉREMPLI ET VERROUILLÉ) */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--color-navy)', marginBottom: '6px' }}>
                Nom d'utilisateur / Espace
              </label>

              <div style={{
                width: '100%',
                padding: '13px 14px',
                borderRadius: '12px',
                border: '1.5px solid var(--color-border)',
                backgroundColor: '#F8FAFC',
                color: 'var(--color-navy)',
                fontSize: '14px',
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
                  padding: '13px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--color-border)',
                  backgroundColor: '#FFFFFF',
                  fontSize: '14px',
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
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px', marginTop: '6px' }}>
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
                padding: '14px',
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
        ) : (
          /* ========================================================
             MODE 2 : CHANGEMENT DE MOT DE PASSE SÉCURISÉ
             ======================================================== */
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

        {/* Accès discret Administrateur (Uniquement si Cyrille doit basculer sur sa console) */}
        <div style={{ marginTop: '22px', paddingTop: '16px', borderTop: '1px solid #F1F5F9', textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => {
              if (isAdminSpace) {
                if (agencies.length > 0) setSelectedSpace(agencies[0].agency_id);
              } else {
                setSelectedSpace('admin');
              }
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
            {isAdminSpace ? "← Revenir à l'espace Agence" : "👑 Accès Administrateur Plateforme"}
          </button>
        </div>

      </div>
    </div>
  );
}
