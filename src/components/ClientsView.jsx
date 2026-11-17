import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { BuildingIcon, UsersIcon, ChevronRightIcon, CheckCircleIcon } from './Icons';
import { formatWhatsAppPhone } from '../config/adminConfig';

export default function ClientsView() {
  const { 
    clients, 
    placements, 
    candidates, 
    setIsAddClientOpen, 
    setIsNewPlacementOpen, 
    getFamilyPortalLink,
    setPortalView,
    setPortalEntityId,
    agency 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'Famille' | 'Entreprise'
  const [neighborhoodFilter, setNeighborhoodFilter] = useState('all');

  const neighborhoodsList = [
    'Cocody',
    'Cocody Riviera Palmeraie',
    'Marcory',
    'Marcory Résidentiel',
    'Plateau',
    'Yopougon'
  ];

  const filteredClients = useMemo(() => {
    return clients.filter(cli => {
      const name = (cli.name || '').toLowerCase();
      const contact = (cli.contactPerson || '').toLowerCase();
      const neigh = (cli.neighborhood || '').toLowerCase();
      const query = searchTerm.toLowerCase().trim();

      const matchesSearch = !query || name.includes(query) || contact.includes(query) || neigh.includes(query);
      const matchesType = typeFilter === 'all' || cli.type === typeFilter;
      const matchesNeigh = neighborhoodFilter === 'all' || neigh.includes(neighborhoodFilter.toLowerCase());

      return matchesSearch && matchesType && matchesNeigh;
    });
  }, [clients, searchTerm, typeFilter, neighborhoodFilter]);

  const getWhatsAppContactUrl = (phone, clientName) => {
    const cleanPhone = formatWhatsAppPhone(phone);
    const message = encodeURIComponent(
      `Bonjour ${clientName}, c'est l'agence ${agency.name}. Nous restons à votre disposition pour le suivi de votre personnel placé. Avez-vous besoin d'une assistance ou d'un nouveau profil ?`
    );
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  return (
    <div className="clients-page" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* ========================================================
          1. HERO BANNER : RÉPERTOIRE FAMILLES & CLIENTS (BLEU NUIT & OR)
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
              <span>Gestion des Employeurs</span>
              <span>•</span>
              <span>{agency.name}</span>
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#FFFFFF', margin: 0, letterSpacing: '-0.5px' }}>
              Répertoire Clients & Familles ({clients.length})
            </h1>
            <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px', maxWidth: '540px' }}>
              Suivi des familles d'accueil et entreprises partenaires avec leur personnel en poste.
            </p>
          </div>

          <button
            onClick={() => setIsAddClientOpen(true)}
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
            + Nouvelle Famille / Client
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
            Familles Particulières : <strong style={{ color: 'var(--color-gold)' }}>{clients.filter(c => c.type === 'Famille').length}</strong>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
          <div style={{ fontSize: '12px', color: '#CBD5E1' }}>
            Entreprises : <strong style={{ color: '#93C5FD' }}>{clients.filter(c => c.type === 'Entreprise').length}</strong>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
          <div style={{ fontSize: '12px', color: '#CBD5E1' }}>
            Personnel Actif chez Clients : <strong style={{ color: '#86EFAC' }}>{placements.length}</strong>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. RECHERCHE ET FILTRES DES CLIENTS
          ======================================================== */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '16px 20px',
        marginBottom: '20px',
        border: '1px solid var(--color-border)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        {/* Recherche */}
        <div style={{ position: 'relative', width: '100%' }}>
          <svg style={{ position: 'absolute', left: '14px', top: '12px', color: '#94A3B8' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher une famille, un responsable ou un quartier..."
            style={{
              width: '100%',
              height: '44px',
              padding: '10px 40px 10px 42px',
              borderRadius: '10px',
              border: '1.5px solid #E2E8F0',
              fontSize: '13px',
              color: 'var(--color-navy)',
              backgroundColor: '#F8FAFC',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Filtres Type */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setTypeFilter('all')}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: '700',
                border: '1px solid',
                cursor: 'pointer',
                backgroundColor: typeFilter === 'all' ? 'var(--color-navy)' : '#FFFFFF',
                color: typeFilter === 'all' ? '#FFFFFF' : 'var(--color-text-muted)',
                borderColor: typeFilter === 'all' ? 'var(--color-navy)' : '#E2E8F0'
              }}
            >
              Tous ({clients.length})
            </button>

            <button
              onClick={() => setTypeFilter('Famille')}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: '700',
                border: '1px solid',
                cursor: 'pointer',
                backgroundColor: typeFilter === 'Famille' ? 'var(--color-gold)' : '#FFFFFF',
                color: typeFilter === 'Famille' ? 'var(--color-navy)' : '#92400E',
                borderColor: typeFilter === 'Famille' ? 'var(--color-gold)' : 'var(--color-gold-border)'
              }}
            >
              Familles ({clients.filter(c => c.type === 'Famille').length})
            </button>

            <button
              onClick={() => setTypeFilter('Entreprise')}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: '700',
                border: '1px solid',
                cursor: 'pointer',
                backgroundColor: typeFilter === 'Entreprise' ? '#1E40AF' : '#FFFFFF',
                color: typeFilter === 'Entreprise' ? '#FFFFFF' : '#1E40AF',
                borderColor: typeFilter === 'Entreprise' ? '#1E40AF' : '#DBEAFE'
              }}
            >
              Entreprises ({clients.filter(c => c.type === 'Entreprise').length})
            </button>
          </div>

          <select
            value={neighborhoodFilter}
            onChange={(e) => setNeighborhoodFilter(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              fontSize: '12px',
              fontWeight: '600',
              color: 'var(--color-navy)',
              backgroundColor: '#FFFFFF',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="all">Toutes communes</option>
            {neighborhoodsList.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      {/* ========================================================
          3. CARTES HAUT DE GAMME DES FAMILLES & CLIENTS
          ======================================================== */}
      {clients.length === 0 ? (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '60px 24px',
          textAlign: 'center',
          border: '1.5px dashed #CBD5E1'
        }}>
          <div style={{ fontSize: '44px', marginBottom: '14px' }}>🏡</div>
          <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--color-navy)', marginBottom: '8px' }}>
            Aucune famille ou client pour l'instant
          </h3>
          <p style={{ fontSize: '13.5px', color: '#64748B', maxWidth: '440px', margin: '0 auto 24px auto', lineHeight: 1.5 }}>
            Enregistrez les familles et employeurs de votre agence pour gérer leurs besoins et contrats de placement.
          </p>
          <button
            onClick={() => setIsAddClientOpen(true)}
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
            <span>Ajouter une famille / un client</span>
          </button>
        </div>
      ) : filteredClients.length === 0 ? (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '48px 24px',
          textAlign: 'center',
          border: '1px dashed #CBD5E1'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</div>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-navy)' }}>
            Aucun client ne correspond à votre recherche
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Essayez de modifier votre recherche ou le filtre de commune.
          </p>
          <button
            onClick={() => { setSearchTerm(''); setNeighborhoodFilter('all'); }}
            className="btn btn-outline"
            style={{ marginTop: '16px' }}
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '20px'
        }}>
          {filteredClients.map(cli => {
          const clientPlacements = placements.filter(p => p.clientId === cli.id);
          const initials = cli.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

          return (
            <div
              key={cli.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid var(--color-border)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.18s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(14, 26, 58, 0.1)';
                e.currentTarget.style.borderColor = 'var(--color-gold)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.03)';
                e.currentTarget.style.borderColor = 'var(--color-border)';
              }}
            >
              <div>
                {/* En-tête Client */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '14px',
                      background: cli.type === 'Famille'
                        ? 'linear-gradient(135deg, var(--color-gold) 0%, #B88E1F 100%)'
                        : 'linear-gradient(135deg, var(--color-navy) 0%, #1A2E5E 100%)',
                      color: cli.type === 'Famille' ? 'var(--color-navy)' : '#FFFFFF',
                      fontWeight: '900',
                      fontSize: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
                    }}>
                      {initials}
                    </div>

                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-navy)', margin: 0 }}>
                        {cli.name}
                      </h3>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        Contact : <strong>{cli.contactPerson || 'Gérant'}</strong>
                      </div>
                    </div>
                  </div>

                  <span style={{
                    backgroundColor: cli.type === 'Famille' ? 'var(--color-gold-light)' : '#EFF6FF',
                    color: cli.type === 'Famille' ? '#92400E' : '#1E40AF',
                    border: `1px solid ${cli.type === 'Famille' ? 'var(--color-gold-border)' : '#BFDBFE'}`,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '700'
                  }}>
                    {cli.type}
                  </span>
                </div>

                {/* Coordonnées & Localisation */}
                <div style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '10px',
                  padding: '12px',
                  marginBottom: '16px',
                  fontSize: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>📍 Quartier :</span>
                    <strong style={{ color: 'var(--color-navy)' }}>{cli.neighborhood}</strong>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>📞 Téléphone :</span>
                    <strong style={{ color: 'var(--color-navy)' }}>{cli.phone}</strong>
                  </div>

                  {cli.notes && (
                    <div style={{ color: '#64748B', fontStyle: 'italic', fontSize: '11px', marginTop: '2px' }}>
                      « {cli.notes} »
                    </div>
                  )}
                </div>

                {/* Personnel Placé chez cette famille */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-gold)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Personnel Actuellement Placé :
                  </div>

                  {clientPlacements.length === 0 ? (
                    <div style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px dashed #CBD5E1',
                      borderRadius: '8px',
                      padding: '10px',
                      fontSize: '12px',
                      color: 'var(--color-text-muted)',
                      textAlign: 'center'
                    }}>
                      Aucun personnel placé en ce moment.
                    </div>
                  ) : (
                    clientPlacements.map(cp => {
                      const cand = candidates.find(c => c.id === cp.candidateId);
                      return (
                        <div
                          key={cp.id}
                          style={{
                            backgroundColor: '#F0FDF4',
                            border: '1px solid #BBF7D0',
                            borderRadius: '10px',
                            padding: '10px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '6px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              backgroundColor: 'var(--color-navy)',
                              color: 'var(--color-gold)',
                              fontWeight: '800',
                              fontSize: '11px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              {cand?.firstName[0]}{cand?.lastName[0]}
                            </div>
                            <div>
                              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-navy)' }}>
                                {cand?.firstName} {cand?.lastName}
                              </div>
                              <div style={{ fontSize: '11px', color: '#166534' }}>
                                {cand?.job} • Contrat actif
                              </div>
                            </div>
                          </div>

                          <div style={{ textAlign: 'right', fontSize: '11px' }}>
                            <span style={{ fontWeight: '700', color: 'var(--color-navy)' }}>
                              {cp.monthlySalary.toLocaleString('fr-FR')} FCFA
                            </span>
                            <div style={{ color: 'var(--color-text-muted)' }}>
                              Fin : {new Date(cp.endDate).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Section Espace Famille / Client Dédié */}
              <div style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '10px',
                padding: '10px 12px',
                border: '1px solid #E2E8F0',
                marginBottom: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-navy)' }}>
                    📱 Espace Famille & Signalement Urgences
                  </span>
                  <span style={{ fontSize: '10px', color: '#64748B' }}>
                    Lien direct sans mot de passe
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <a
                    href={`https://wa.me/${formatWhatsAppPhone(cli.phone)}?text=${encodeURIComponent(`Bonjour ${cli.contactPerson || cli.name}, voici votre lien d'accès officiel à votre Espace Client ${agency.name} :\n\n${getFamilyPortalLink(cli.id)}\n\n(💡 Si le lien n'est pas cliquable en bleu, enregistrez ce numéro dans vos contacts).\n\nVous pouvez y retrouver le profil de votre personnel placé et nous envoyer un signalement direct en cas d'urgence.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn"
                    style={{
                      backgroundColor: '#25D366',
                      color: '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '4px 10px',
                      minHeight: '30px',
                      textDecoration: 'none',
                      borderRadius: '6px'
                    }}
                  >
                    Envoyer lien WhatsApp
                  </a>

                  <button
                    onClick={() => {
                      setPortalEntityId(cli.id);
                      setPortalView('family');
                    }}
                    className="btn"
                    style={{
                      backgroundColor: 'var(--color-navy)',
                      color: 'var(--color-gold)',
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '4px 10px',
                      minHeight: '30px',
                      borderRadius: '6px'
                    }}
                  >
                    👁️ Tester (Aperçu)
                  </button>
                </div>
              </div>

              {/* Actions Directes en bas de carte */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                paddingTop: '14px',
                borderTop: '1px solid #F1F5F9'
              }}>
                <a
                  href={getWhatsAppContactUrl(cli.phone, cli.contactPerson || cli.name)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn"
                  style={{
                    backgroundColor: '#25D366',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: '700',
                    minHeight: '38px',
                    textDecoration: 'none'
                  }}
                >
                  WhatsApp
                </a>

                <button
                  onClick={() => setIsNewPlacementOpen(true)}
                  className="btn"
                  style={{
                    backgroundColor: 'var(--color-navy)',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: '700',
                    minHeight: '38px'
                  }}
                >
                  + Nouveau Placement
                </button>
              </div>
            </div>
          );
        })}
      </div>
      )}

    </div>
  );
}
