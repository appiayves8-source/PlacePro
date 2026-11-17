import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangleIcon } from './Icons';

export default function NotificationsModal() {
  const { 
    isNotificationsOpen, 
    setIsNotificationsOpen, 
    notifications, 
    unreadNotificationCount, 
    markAllNotificationsAsRead, 
    markNotificationAsRead,
    navigateTo,
    agency 
  } = useApp();

  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'worker' | 'family'

  if (!isNotificationsOpen) return null;

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'worker') return n.source === 'worker';
    if (filter === 'family') return n.source === 'family';
    return true;
  });

  const getWhatsAppReplyUrl = (phone, authorName, urgencyType) => {
    const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Bonjour ${authorName}, c'est ${agency.name}.\n\nNous avons bien reçu votre signalement concernant : *« ${urgencyType} »*.\n\nNous prenons ce dossier très au sérieux. Pouvons-nous en échanger maintenant pour trouver une solution rapide ?`
    );
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(14, 26, 58, 0.7)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 110,
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '560px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        position: 'relative'
      }}>
        {/* En-tête */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          backgroundColor: '#FFFFFF',
          zIndex: 10
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-navy)', margin: 0 }}>
                Centre de Notifications
              </h2>
              {unreadNotificationCount > 0 && (
                <span style={{
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: '800',
                  padding: '2px 8px',
                  borderRadius: '9999px'
                }}>
                  {unreadNotificationCount} non lue{unreadNotificationCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '2px 0 0 0' }}>
              Signalements en direct des employés et des familles clientes
            </p>
          </div>

          <button
            onClick={() => setIsNotificationsOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '22px',
              color: 'var(--color-text-muted)',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>

        {/* Barre d'outils : Marquer comme lu & Filtres */}
        <div style={{
          padding: '12px 24px',
          backgroundColor: '#F8FAFC',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setFilter('all')}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: filter === 'all' ? 'var(--color-navy)' : '#E2E8F0',
                color: filter === 'all' ? '#FFFFFF' : 'var(--color-navy)'
              }}
            >
              Toutes ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: filter === 'unread' ? '#DC2626' : '#E2E8F0',
                color: filter === 'unread' ? '#FFFFFF' : 'var(--color-navy)'
              }}
            >
              Non lues ({unreadNotificationCount})
            </button>
          </div>

          {unreadNotificationCount > 0 && (
            <button
              onClick={markAllNotificationsAsRead}
              className="btn"
              style={{
                minHeight: '30px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: '700',
                backgroundColor: '#DCFCE7',
                color: '#15803D',
                border: '1px solid #86EFAC',
                borderRadius: '6px'
              }}
            >
              ✓ Tout marquer comme lu (Remise à 0)
            </button>
          )}
        </div>

        {/* Liste des notifications */}
        <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 12px', color: 'var(--color-text-muted)' }}>
              Aucune notification dans cette vue.
            </div>
          ) : (
            filtered.map(notif => (
              <div
                key={notif.id}
                onClick={() => markNotificationAsRead(notif.id)}
                style={{
                  backgroundColor: notif.read ? '#FFFFFF' : '#FEF2F2',
                  border: `1.5px solid ${notif.read ? 'var(--color-border)' : '#FCA5A5'}`,
                  borderRadius: '12px',
                  padding: '14px 16px',
                  position: 'relative',
                  transition: 'all 0.15s ease'
                }}
              >
                {/* Ligne 1 : Source & Heure */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{
                    backgroundColor: notif.source === 'worker' ? '#DBEAFE' : '#FEF3C7',
                    color: notif.source === 'worker' ? '#1E40AF' : '#92400E',
                    fontSize: '11px',
                    fontWeight: '800',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>
                    {notif.source === 'worker' ? '👤 SIGNALEMENT EMPLOYÉ' : '🏠 SIGNALEMENT FAMILLE'}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                      {new Date(notif.createdAt).toLocaleDateString('fr-FR')} {new Date(notif.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {!notif.read && (
                      <span style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#DC2626',
                        borderRadius: '50%'
                      }} />
                    )}
                  </div>
                </div>

                {/* Titre & Auteur */}
                <h4 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--color-navy)', margin: '4px 0 2px 0' }}>
                  {notif.title}
                </h4>
                <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '600' }}>
                  De : {notif.authorName} • Tél : {notif.authorPhone}
                </div>

                {/* Détail du message */}
                <p style={{
                  fontSize: '12px',
                  color: 'var(--color-text-main)',
                  backgroundColor: notif.read ? '#F8FAFC' : '#FFFFFF',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  marginTop: '8px',
                  lineHeight: 1.45
                }}>
                  « {notif.details} »
                </p>

                {/* Actions : Voir dossier & WhatsApp */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsNotificationsOpen(false);
                      if (notif.source === 'worker') {
                        navigateTo('candidate-detail', notif.targetId);
                      } else {
                        navigateTo('clients');
                      }
                    }}
                    className="btn btn-outline"
                    style={{
                      fontSize: '11px',
                      padding: '6px 12px',
                      minHeight: '34px',
                      borderRadius: '8px'
                    }}
                  >
                    {notif.source === 'worker' ? '👤 Voir fiche candidat' : '🏠 Voir répertoire clients'}
                  </button>

                  <a
                    href={getWhatsAppReplyUrl(notif.authorPhone, notif.authorName, notif.urgencyType)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn"
                    style={{
                      backgroundColor: '#25D366',
                      color: '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '6px 12px',
                      minHeight: '34px',
                      textDecoration: 'none',
                      borderRadius: '8px'
                    }}
                  >
                    Répondre via WhatsApp
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
