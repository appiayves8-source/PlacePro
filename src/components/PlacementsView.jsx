import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { BriefcaseIcon, ClockIcon, AlertTriangleIcon, CheckCircleIcon, WalletIcon } from './Icons';

export default function PlacementsView() {
  const { 
    placements, 
    candidates, 
    clients, 
    setIsNewPlacementOpen, 
    openPaymentForPlacement,
    renewPlacement,
    agency,
    navigateTo 
  } = useApp();

  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'ending_soon' | 'overdue' | 'completed'

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const enrichedPlacements = useMemo(() => {
    return placements.map(plc => {
      const candidate = candidates.find(c => c.id === plc.candidateId);
      const client = clients.find(cl => cl.id === plc.clientId);

      const end = new Date(plc.endDate);
      end.setHours(0, 0, 0, 0);
      const diffTime = end.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const isEndingSoon = diffDays >= 0 && diffDays <= 7;

      const hasOverdueInstallment = (plc.installments || []).some(i => i.status === 'en_retard');
      const isFullyPaid = (plc.installments || []).every(i => i.status === 'payé');

      return {
        ...plc,
        candidate,
        client,
        diffDays,
        isEndingSoon,
        hasOverdueInstallment,
        isFullyPaid
      };
    });
  }, [placements, candidates, clients]);

  const filteredPlacements = useMemo(() => {
    if (statusFilter === 'ending_soon') return enrichedPlacements.filter(p => p.isEndingSoon);
    if (statusFilter === 'overdue') return enrichedPlacements.filter(p => p.hasOverdueInstallment);
    if (statusFilter === 'completed') return enrichedPlacements.filter(p => p.isFullyPaid);
    return enrichedPlacements;
  }, [enrichedPlacements, statusFilter]);

  const getWhatsAppEmployerUrl = (phone, clientName, candidateName) => {
    const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Bonjour ${clientName}, c'est l'agence ${agency.name}. Nous faisons le suivi du contrat de placement de ${candidateName}. Tout se passe-t-il bien à la maison ? N'hésitez pas si vous avez la moindre question.`
    );
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  return (
    <div className="placements-page" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* ========================================================
          1. HERO BANNER : CONTRATS DE PLACEMENT (BLEU NUIT & OR)
          ======================================================== */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-navy) 0%, #162955 100%)',
        borderRadius: '20px',
        padding: '28px 24px',
        color: '#FFFFFF',
        marginBottom: '24px',
        border: '1px solid rgba(212, 167, 44, 0.3)',
        boxShadow: '0 10px 25px -5px rgba(14, 26, 58, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: '700',
              color: 'var(--color-gold)',
              backgroundColor: 'rgba(212, 167, 44, 0.15)',
              border: '1px solid rgba(212, 167, 44, 0.3)',
              padding: '4px 10px',
              borderRadius: '9999px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '8px'
            }}>
              <span>Suivi Contractuel & Commissions</span>
              <span>•</span>
              <span>{agency.name}</span>
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#FFFFFF', margin: 0, letterSpacing: '-0.5px' }}>
              Contrats de Placement ({placements.length})
            </h1>
            <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px', maxWidth: '540px' }}>
              Suivi actif des binômes Candidat - Famille, gestion des renouvellements et recouvrement des commissions.
            </p>
          </div>

          <button
            onClick={() => setIsNewPlacementOpen(true)}
            className="btn"
            style={{
              backgroundColor: 'var(--color-gold)',
              color: 'var(--color-navy)',
              fontWeight: '700',
              fontSize: '13px',
              padding: '10px 20px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(212, 167, 44, 0.3)'
            }}
          >
            + Nouveau Placement
          </button>
        </div>

        {/* Statistiques rapides */}
        <div style={{
          display: 'flex',
          gap: '12px',
          overflowX: 'auto',
          paddingTop: '12px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ fontSize: '12px', color: '#CBD5E1' }}>
            Contrats Actifs : <strong style={{ color: '#86EFAC' }}>{placements.length}</strong>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
          <div style={{ fontSize: '12px', color: '#CBD5E1' }}>
            Fins de contrat sous 7 jours : <strong style={{ color: '#FCA5A5' }}>{enrichedPlacements.filter(p => p.isEndingSoon).length}</strong>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
          <div style={{ fontSize: '12px', color: '#CBD5E1' }}>
            Commissions en Retard : <strong style={{ color: '#FCA5A5' }}>{enrichedPlacements.filter(p => p.hasOverdueInstallment).length}</strong>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. FILTRES DES CONTRATS
          ======================================================== */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
        overflowX: 'auto',
        paddingBottom: '4px'
      }}>
        <button
          onClick={() => setStatusFilter('all')}
          style={{
            padding: '8px 16px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: '700',
            border: '1px solid',
            cursor: 'pointer',
            backgroundColor: statusFilter === 'all' ? 'var(--color-navy)' : '#FFFFFF',
            color: statusFilter === 'all' ? '#FFFFFF' : 'var(--color-text-muted)',
            borderColor: statusFilter === 'all' ? 'var(--color-navy)' : '#E2E8F0',
            whiteSpace: 'nowrap'
          }}
        >
          Tous les contrats ({placements.length})
        </button>

        <button
          onClick={() => setStatusFilter('ending_soon')}
          style={{
            padding: '8px 16px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: '700',
            border: '1px solid',
            cursor: 'pointer',
            backgroundColor: statusFilter === 'ending_soon' ? '#DC2626' : '#FFFFFF',
            color: statusFilter === 'ending_soon' ? '#FFFFFF' : '#DC2626',
            borderColor: statusFilter === 'ending_soon' ? '#DC2626' : '#FEE2E2',
            whiteSpace: 'nowrap'
          }}
        >
          Fins imminentes &le; 7j ({enrichedPlacements.filter(p => p.isEndingSoon).length})
        </button>

        <button
          onClick={() => setStatusFilter('overdue')}
          style={{
            padding: '8px 16px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: '700',
            border: '1px solid',
            cursor: 'pointer',
            backgroundColor: statusFilter === 'overdue' ? '#D97706' : '#FFFFFF',
            color: statusFilter === 'overdue' ? '#FFFFFF' : '#D97706',
            borderColor: statusFilter === 'overdue' ? '#D97706' : '#FEF3C7',
            whiteSpace: 'nowrap'
          }}
        >
          Commissions en retard ({enrichedPlacements.filter(p => p.hasOverdueInstallment).length})
        </button>

        <button
          onClick={() => setStatusFilter('completed')}
          style={{
            padding: '8px 16px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: '700',
            border: '1px solid',
            cursor: 'pointer',
            backgroundColor: statusFilter === 'completed' ? '#15803D' : '#FFFFFF',
            color: statusFilter === 'completed' ? '#FFFFFF' : '#15803D',
            borderColor: statusFilter === 'completed' ? '#15803D' : '#DCFCE7',
            whiteSpace: 'nowrap'
          }}
        >
          Commissions soldées ({enrichedPlacements.filter(p => p.isFullyPaid).length})
        </button>
      </div>

      {/* ========================================================
          3. GRILLE DE CARTES CONTRATS LUXUEUSES
          ======================================================== */}
      {placements.length === 0 ? (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '60px 24px',
          textAlign: 'center',
          border: '1.5px dashed #CBD5E1'
        }}>
          <div style={{ fontSize: '44px', marginBottom: '14px' }}>📄</div>
          <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--color-navy)', marginBottom: '8px' }}>
            Aucun contrat de placement pour l'instant
          </h3>
          <p style={{ fontSize: '13.5px', color: '#64748B', maxWidth: '440px', margin: '0 auto 24px auto', lineHeight: 1.5 }}>
            Placez un candidat chez une famille pour générer un contrat mensuel officiel, suivre les échéances de commissions et les règlements.
          </p>
          <button
            onClick={() => setIsNewPlacementOpen(true)}
            className="btn btn-primary"
            style={{
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '800',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>+</span>
            <span>Nouveau contrat de placement</span>
          </button>
        </div>
      ) : filteredPlacements.length === 0 ? (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '48px 24px',
          textAlign: 'center',
          border: '1.5px dashed #CBD5E1'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</div>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-navy)' }}>
            Aucun contrat ne correspond à ce filtre
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Modifiez le filtre pour afficher vos autres contrats de placement.
          </p>
          <button
            onClick={() => setStatusFilter('all')}
            className="btn btn-outline"
            style={{ marginTop: '16px' }}
          >
            Afficher tous les contrats
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {filteredPlacements.map(plc => {
          const candInitials = plc.candidate ? `${plc.candidate.firstName[0]}${plc.candidate.lastName[0]}` : 'CD';
          const cliInitials = plc.client ? plc.client.name.slice(0, 2).toUpperCase() : 'CL';

          return (
            <div
              key={plc.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: plc.isEndingSoon ? '2px solid #EF4444' : '1px solid var(--color-border)',
                boxShadow: plc.isEndingSoon ? '0 6px 20px -4px rgba(239, 68, 68, 0.15)' : '0 4px 12px rgba(0, 0, 0, 0.03)',
                padding: '22px',
                position: 'relative',
                transition: 'all 0.18s ease'
              }}
            >
              {/* Alerte si fin de contrat imminente */}
              {plc.isEndingSoon && (
                <div style={{
                  backgroundColor: '#FEE2E2',
                  border: '1px solid #FECACA',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#991B1B', fontWeight: '800', fontSize: '13px' }}>
                    <ClockIcon size={18} color="#DC2626" />
                    FIN DE CONTRAT DANS {plc.diffDays} JOURS (Échéance : {new Date(plc.endDate).toLocaleDateString('fr-FR')})
                  </div>

                  <button
                    onClick={() => {
                      const d = new Date(plc.endDate || Date.now());
                      d.setMonth(d.getMonth() + 1);
                      const defaultNextMonth = d.toISOString().split('T')[0];
                      const newDate = prompt("Nouvelle échéance mensuelle (AAAA-MM-JJ) :", defaultNextMonth);
                      if (newDate) {
                        renewPlacement(plc.id, newDate);
                        alert("Contrat renouvelé pour un mois supplémentaire !");
                      }
                    }}
                    className="btn"
                    style={{
                      backgroundColor: 'var(--color-gold)',
                      color: 'var(--color-navy)',
                      fontSize: '12px',
                      fontWeight: '800',
                      padding: '6px 14px',
                      minHeight: '34px',
                      borderRadius: '8px'
                    }}
                  >
                    Renouveler le contrat
                  </button>
                </div>
              )}

              {/* Ligne principale : Le Binôme (Candidat ➔ Client) */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  
                  {/* Candidat */}
                  <div 
                    onClick={() => navigateTo('candidate-detail', plc.candidateId)}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                  >
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--color-navy)',
                      color: 'var(--color-gold)',
                      fontWeight: '900',
                      fontSize: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {candInitials}
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--color-navy)' }}>
                        {plc.candidate ? `${plc.candidate.firstName} ${plc.candidate.lastName}` : 'Candidat'}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                        {plc.candidate?.job} • {plc.candidate?.neighborhood}
                      </div>
                    </div>
                  </div>

                  <span style={{ fontSize: '18px', color: 'var(--color-gold)', fontWeight: '900' }}>➔</span>

                  {/* Client */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--color-gold-light)',
                      color: '#92400E',
                      fontWeight: '900',
                      fontSize: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid var(--color-gold-border)'
                    }}>
                      {cliInitials}
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--color-navy)' }}>
                        {plc.client?.name}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                        {plc.client?.neighborhood} • {plc.client?.type}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Chiffres clés du contrat */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Salaire employé</div>
                  <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--color-navy)' }}>
                    {plc.monthlySalary.toLocaleString('fr-FR')} <span style={{ fontSize: '11px' }}>FCFA/mois</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-gold)', fontWeight: '700' }}>
                    Commission : {plc.totalCommission.toLocaleString('fr-FR')} FCFA
                  </div>
                </div>
              </div>

              {/* Échéancier des tranches de commission */}
              <div style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '12px',
                padding: '14px',
                marginBottom: '16px'
              }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-navy)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Tranches de paiement de la commission :
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                  {(plc.installments || []).map(inst => (
                    <div
                      key={inst.id}
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: `1px solid ${inst.status === 'payé' ? '#BBF7D0' : inst.status === 'en_retard' ? '#FECACA' : '#E2E8F0'}`,
                        borderRadius: '8px',
                        padding: '10px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '12px'
                      }}
                    >
                      <div>
                        <strong>{inst.label}</strong> : {inst.amount.toLocaleString('fr-FR')} FCFA
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                          Échéance : {inst.dueDate}
                        </div>
                      </div>

                      <div>
                        {inst.status === 'payé' ? (
                          <span style={{ backgroundColor: '#DCFCE7', color: '#166534', fontWeight: '700', padding: '3px 8px', borderRadius: '4px', fontSize: '11px' }}>
                            ✓ Payé ({inst.paymentMethod})
                          </span>
                        ) : inst.status === 'en_retard' ? (
                          <span style={{ backgroundColor: '#FEE2E2', color: '#991B1B', fontWeight: '700', padding: '3px 8px', borderRadius: '4px', fontSize: '11px' }}>
                            ⚠️ Retard &gt; 7j
                          </span>
                        ) : (
                          <span style={{ backgroundColor: '#F1F5F9', color: 'var(--color-navy)', fontWeight: '600', padding: '3px 8px', borderRadius: '4px', fontSize: '11px' }}>
                            En attente
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions en bas de contrat */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
                paddingTop: '12px',
                borderTop: '1px solid #F1F5F9'
              }}>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  Durée : du <strong>{new Date(plc.startDate).toLocaleDateString('fr-FR')}</strong> au <strong style={{ color: plc.isEndingSoon ? '#DC2626' : 'var(--color-navy)' }}>{new Date(plc.endDate).toLocaleDateString('fr-FR')}</strong>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <a
                    href={getWhatsAppEmployerUrl(plc.client?.phone, plc.client?.name, plc.candidate?.firstName)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn"
                    style={{
                      backgroundColor: '#25D366',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: '700',
                      padding: '8px 14px',
                      minHeight: '36px',
                      textDecoration: 'none'
                    }}
                  >
                    WhatsApp Client
                  </a>

                  <button
                    onClick={() => openPaymentForPlacement(plc.id)}
                    className="btn"
                    style={{
                      backgroundColor: 'var(--color-navy)',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: '700',
                      padding: '8px 14px',
                      minHeight: '36px'
                    }}
                  >
                    Encaisser commission
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}

    </div>
  );
}
