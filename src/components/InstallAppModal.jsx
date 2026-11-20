import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

/**
 * Modale d'instructions d'installation PWA (Progressive Web App)
 * Détecte intelligemment l'appareil (iOS / Android / Ordinateur) et guide l'utilisateur
 */
export default function InstallAppModal() {
  const { isInstallModalOpen, setIsInstallModalOpen } = useApp();

  // Détection basique du type d'appareil
  const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);
  
  const [activeDeviceTab, setActiveDeviceTab] = useState(() => {
    if (isIOS) return 'ios';
    if (isAndroid) return 'android';
    return 'desktop';
  });

  if (!isInstallModalOpen) return null;

  return (
    <div 
      className="modal-overlay" 
      onClick={() => setIsInstallModalOpen(false)}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(7, 21, 42, 0.75)',
        backdropFilter: 'blur(5px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div 
        className="modal-card" 
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          maxWidth: '480px',
          width: '100%',
          padding: '26px 24px',
          boxShadow: '0 20px 45px -10px rgba(7, 21, 42, 0.3)',
          border: '1.5px solid var(--color-border)',
          position: 'relative',
          animation: 'fadeIn 0.2s ease-out'
        }}
      >
        {/* Bouton Fermer */}
        <button
          onClick={() => setIsInstallModalOpen(false)}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#F1F5F9',
            border: 'none',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748B',
            fontWeight: '700'
          }}
          title="Fermer"
        >
          ✕
        </button>

        {/* En-tête */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--color-gold) 0%, #B88E1F 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '26px',
            boxShadow: '0 8px 18px rgba(212, 167, 44, 0.3)',
            marginBottom: '10px'
          }}>
            📲
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--color-navy)', margin: 0 }}>
            Installer PlacePro
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '6px', lineHeight: 1.4 }}>
            Accédez à votre espace en 1 clic depuis votre écran d'accueil, avec les alertes en direct et sans ouvrir le navigateur.
          </p>
        </div>

        {/* Sélecteur d'appareil */}
        <div style={{
          display: 'flex',
          backgroundColor: '#F1F5F9',
          borderRadius: '12px',
          padding: '4px',
          marginBottom: '20px',
          gap: '4px'
        }}>
          <button
            type="button"
            onClick={() => setActiveDeviceTab('android')}
            style={{
              flex: 1,
              padding: '8px 10px',
              borderRadius: '9px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: activeDeviceTab === 'android' ? '800' : '600',
              backgroundColor: activeDeviceTab === 'android' ? '#FFFFFF' : 'transparent',
              color: activeDeviceTab === 'android' ? 'var(--color-navy)' : '#64748B',
              boxShadow: activeDeviceTab === 'android' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            🤖 Android
          </button>

          <button
            type="button"
            onClick={() => setActiveDeviceTab('ios')}
            style={{
              flex: 1,
              padding: '8px 10px',
              borderRadius: '9px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: activeDeviceTab === 'ios' ? '800' : '600',
              backgroundColor: activeDeviceTab === 'ios' ? '#FFFFFF' : 'transparent',
              color: activeDeviceTab === 'ios' ? 'var(--color-navy)' : '#64748B',
              boxShadow: activeDeviceTab === 'ios' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            🍏 iPhone / iPad
          </button>

          <button
            type="button"
            onClick={() => setActiveDeviceTab('desktop')}
            style={{
              flex: 1,
              padding: '8px 10px',
              borderRadius: '9px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: activeDeviceTab === 'desktop' ? '800' : '600',
              backgroundColor: activeDeviceTab === 'desktop' ? '#FFFFFF' : 'transparent',
              color: activeDeviceTab === 'desktop' ? 'var(--color-navy)' : '#64748B',
              boxShadow: activeDeviceTab === 'desktop' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            💻 PC / Mac
          </button>
        </div>

        {/* Instructions selon l'onglet */}
        {activeDeviceTab === 'android' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', backgroundColor: '#FAF5EA', padding: '12px', borderRadius: '12px', border: '1px solid #F3E8C8' }}>
              <span style={{ backgroundColor: 'var(--color-navy)', color: '#FFFFFF', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800', flexShrink: 0 }}>1</span>
              <div style={{ fontSize: '13px', color: 'var(--color-navy)', lineHeight: 1.4 }}>
                Appuyez sur le menu <strong>trois points verticaux (⋮)</strong> en haut à droite de Google Chrome.
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', backgroundColor: '#FAF5EA', padding: '12px', borderRadius: '12px', border: '1px solid #F3E8C8' }}>
              <span style={{ backgroundColor: 'var(--color-navy)', color: '#FFFFFF', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800', flexShrink: 0 }}>2</span>
              <div style={{ fontSize: '13px', color: 'var(--color-navy)', lineHeight: 1.4 }}>
                Sélectionnez <strong>« Installer l'application »</strong> (ou <em>« Ajouter à l'écran d'accueil »</em>).
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', backgroundColor: '#FAF5EA', padding: '12px', borderRadius: '12px', border: '1px solid #F3E8C8' }}>
              <span style={{ backgroundColor: 'var(--color-navy)', color: '#FFFFFF', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800', flexShrink: 0 }}>3</span>
              <div style={{ fontSize: '13px', color: 'var(--color-navy)', lineHeight: 1.4 }}>
                Appuyez sur <strong>« Installer »</strong> : l'icône PlacePro apparaît instantanément parmi vos applications !
              </div>
            </div>
          </div>
        )}

        {activeDeviceTab === 'ios' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', backgroundColor: '#FAF5EA', padding: '12px', borderRadius: '12px', border: '1px solid #F3E8C8' }}>
              <span style={{ backgroundColor: 'var(--color-navy)', color: '#FFFFFF', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800', flexShrink: 0 }}>1</span>
              <div style={{ fontSize: '13px', color: 'var(--color-navy)', lineHeight: 1.4 }}>
                Dans Safari, appuyez sur le bouton <strong>Partager</strong> <span style={{ fontSize: '15px' }}>📤</span> (icône avec le carré et la flèche vers le haut au bas de l'écran).
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', backgroundColor: '#FAF5EA', padding: '12px', borderRadius: '12px', border: '1px solid #F3E8C8' }}>
              <span style={{ backgroundColor: 'var(--color-navy)', color: '#FFFFFF', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800', flexShrink: 0 }}>2</span>
              <div style={{ fontSize: '13px', color: 'var(--color-navy)', lineHeight: 1.4 }}>
                Faites défiler le menu vers le bas et appuyez sur <strong>« Sur l'écran d'accueil »</strong> <span style={{ fontSize: '14px' }}>➕</span>.
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', backgroundColor: '#FAF5EA', padding: '12px', borderRadius: '12px', border: '1px solid #F3E8C8' }}>
              <span style={{ backgroundColor: 'var(--color-navy)', color: '#FFFFFF', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800', flexShrink: 0 }}>3</span>
              <div style={{ fontSize: '13px', color: 'var(--color-navy)', lineHeight: 1.4 }}>
                Appuyez sur <strong>« Ajouter »</strong> en haut à droite. PlacePro est maintenant sur votre écran d'iPhone !
              </div>
            </div>
          </div>
        )}

        {activeDeviceTab === 'desktop' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', backgroundColor: '#FAF5EA', padding: '12px', borderRadius: '12px', border: '1px solid #F3E8C8' }}>
              <span style={{ backgroundColor: 'var(--color-navy)', color: '#FFFFFF', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800', flexShrink: 0 }}>1</span>
              <div style={{ fontSize: '13px', color: 'var(--color-navy)', lineHeight: 1.4 }}>
                Dans la barre d'adresse tout en haut à droite, cliquez sur l'icône <strong>Installer PlacePro</strong> (petit écran avec flèche ou symbole ➕).
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', backgroundColor: '#FAF5EA', padding: '12px', borderRadius: '12px', border: '1px solid #F3E8C8' }}>
              <span style={{ backgroundColor: 'var(--color-navy)', color: '#FFFFFF', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800', flexShrink: 0 }}>2</span>
              <div style={{ fontSize: '13px', color: 'var(--color-navy)', lineHeight: 1.4 }}>
                Ou ouvrez le menu Chrome / Edge <strong>(⋮)</strong> et cliquez sur <strong>« Installer PlacePro... »</strong>.
              </div>
            </div>
          </div>
        )}

        {/* Bouton de fermeture */}
        <button
          type="button"
          onClick={() => setIsInstallModalOpen(false)}
          className="btn"
          style={{
            width: '100%',
            backgroundColor: 'var(--color-navy)',
            color: 'var(--color-gold)',
            padding: '12px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: '800',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(14, 26, 58, 0.2)'
          }}
        >
          C'est compris, fermer
        </button>
      </div>
    </div>
  );
}
