import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangleIcon, CheckCircleIcon } from './Icons';

export default function FamilyPortal({ clientId }) {
  const { clients, placements, candidates, agency, sendFamilyEmergency, setPortalView } = useApp();

  const client = clients.find(cl => cl.id === clientId) || clients[0];
  const clientPlacements = placements.filter(p => p.clientId === client?.id);

  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [urgencyType, setUrgencyType] = useState('Abandon de poste / Absence non justifiée');
  const [details, setDetails] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const familyUrgencyTypes = [
    'Abandon de poste / Absence non justifiée',
    'Retards répétés ou refus d’exécuter le travail',
    'Soupçon de vol, perte d’objet ou dégradation',
    'Comportement inadapté avec les enfants / le foyer',
    'Demande de remplacement urgent du personnel',
    'Autre litige ou incident'
  ];

  const handleSendEmergency = (e) => {
    e.preventDefault();
    if (!details.trim()) {
      alert("Veuillez décrire brièvement l'incident ou la demande.");
      return;
    }

    sendFamilyEmergency({
      clientId: client.id,
      urgencyType,
      details: details.trim()
    });

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setIsEmergencyModalOpen(false);
      setDetails('');
    }, 2500);
  };

  return (
    <div style={{
      maxWidth: '480px',
      margin: '0 auto',
      minHeight: '100vh',
      backgroundColor: '#F8FAFC',
      paddingBottom: '40px'
    }}>
      {/* Barre de retour pour Cyrille */}
      <div style={{
        backgroundColor: 'var(--color-navy)',
        padding: '8px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: '#FFFFFF',
        fontSize: '11px'
      }}>
        <span>Aperçu de ce que voit la Famille Cliente</span>
        <button
          onClick={() => {
            setPortalView(null);
            window.history.pushState({}, '', window.location.pathname);
          }}
          style={{
            backgroundColor: 'var(--color-gold)',
            color: 'var(--color-navy)',
            border: 'none',
            borderRadius: '4px',
            padding: '3px 8px',
            fontSize: '11px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          Retour Dashboard Agence
        </button>
      </div>

      {/* En-tête Espace Famille */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-navy) 0%, #162955 100%)',
        color: '#FFFFFF',
        padding: '28px 20px 24px 20px',
        borderBottomLeftRadius: '24px',
        borderBottomRightRadius: '24px',
        boxShadow: '0 10px 20px -5px rgba(14, 26, 58, 0.2)'
      }}>
        <div style={{ fontSize: '11px', color: 'var(--color-gold)', fontWeight: '700', textTransform: 'uppercase' }}>
          Espace Client • {agency.name}
        </div>
        <h1 style={{ fontSize: '22px', fontWeight: '800', margin: '4px 0 2px 0' }}>
          Bienvenue, {client.name}
        </h1>
        <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0 }}>
          Contact : {client.contactPerson} • {client.neighborhood}
        </p>
      </div>

      <div style={{ padding: '20px' }}>
        
        {/* BOUTON D'URGENCE FAMILLE */}
        <button
          onClick={() => setIsEmergencyModalOpen(true)}
          style={{
            width: '100%',
            backgroundColor: '#DC2626',
            color: '#FFFFFF',
            borderRadius: '16px',
            padding: '16px',
            border: 'none',
            fontSize: '15px',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: '0 8px 20px -4px rgba(220, 38, 38, 0.4)',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          <span>🚨</span>
          <span>SIGNALER UN PROBLÈME OU UNE URGENCE</span>
        </button>

        {/* Personnel placé dans ce foyer */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '18px',
          border: '1px solid var(--color-border)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
          marginBottom: '16px'
        }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-gold)', textTransform: 'uppercase', marginBottom: '10px' }}>
            Personnel Actuellement Placé chez Vous
          </div>

          {clientPlacements.length === 0 ? (
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
              Aucun contrat actif actuellement. Contactez l'agence pour un nouveau placement.
            </p>
          ) : (
            clientPlacements.map(plc => {
              const cand = candidates.find(c => c.id === plc.candidateId);
              return (
                <div key={plc.id} style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '12px',
                  padding: '14px',
                  marginBottom: '10px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--color-navy)', margin: 0 }}>
                        {cand?.firstName} {cand?.lastName}
                      </h4>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        Poste : <strong>{cand?.job}</strong>
                      </div>
                    </div>

                    <span style={{
                      backgroundColor: '#DCFCE7',
                      color: '#166534',
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}>
                      En poste
                    </span>
                  </div>

                  <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #E2E8F0', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div>📞 Contact employé : <strong>{cand?.phone}</strong></div>
                    <div>🛡️ Garant officiel : <strong>{cand?.guarantor?.name}</strong> ({cand?.guarantor?.phone})</div>
                    <div>📅 Échéance contrat : <strong>{new Date(plc.endDate).toLocaleDateString('fr-FR')}</strong></div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Assistance Agence */}
        <div style={{
          backgroundColor: '#FAF5EA',
          border: '1px solid var(--color-gold-border)',
          borderRadius: '16px',
          padding: '16px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--color-navy)' }}>
            Service Clientèle {agency.name}
          </div>
          <p style={{ fontSize: '12px', color: '#92400E', marginTop: '4px' }}>
            Une équipe dédiée pour intervenir à votre domicile et gérer vos demandes de remplacement.
          </p>
          <a
            href={`https://wa.me/${agency.phone.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="btn"
            style={{
              backgroundColor: '#25D366',
              color: '#FFFFFF',
              width: '100%',
              marginTop: '10px',
              textDecoration: 'none'
            }}
          >
            Contacter l'Agence sur WhatsApp
          </a>
        </div>

      </div>

      {/* MODALE DE SIGNALEMENT D'URGENCE POUR LA FAMILLE */}
      {isEmergencyModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(14, 26, 58, 0.8)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            width: '100%',
            maxWidth: '440px',
            padding: '24px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
          }}>
            {submittedSuccess ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>✓</div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-navy)' }}>
                  Signalement bien reçu par l'agence !
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '8px' }}>
                  {agency.name} a été alertée en temps réel. Un responsable va vous recontacter sans délai.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendEmergency}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#DC2626', margin: 0 }}>
                    🚨 Signaler un Incident
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsEmergencyModalOpen(false)}
                    style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
                  >
                    ×
                  </button>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--color-navy)', marginBottom: '6px' }}>
                    Motif de l'incident : *
                  </label>
                  <select
                    value={urgencyType}
                    onChange={(e) => setUrgencyType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '13px',
                      backgroundColor: '#FFFFFF',
                      fontWeight: '600'
                    }}
                  >
                    {familyUrgencyTypes.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--color-navy)', marginBottom: '6px' }}>
                    Détails des faits observés : *
                  </label>
                  <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    rows={4}
                    placeholder="Décrivez votre préoccupation ou la situation observée..."
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '13px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setIsEmergencyModalOpen(false)}
                    className="btn btn-outline"
                    style={{ flex: 1 }}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="btn"
                    style={{
                      flex: 1,
                      backgroundColor: '#DC2626',
                      color: '#FFFFFF',
                      fontWeight: '800'
                    }}
                  >
                    Transmettre à l'Agence
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
