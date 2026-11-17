import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SUBSCRIPTION_PLANS } from '../data/mockData';

export default function CreateAgencyModal() {
  const { isCreateAgencyOpen, setIsCreateAgencyOpen, createAgency, switchAgency } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    managerName: '',
    phone: '',
    neighborhood: 'Cocody',
    city: 'Abidjan',
    plan: 'pro' // 'starter' | 'pro' | 'annuel'
  });

  const [errors, setErrors] = useState({});
  const [createdResult, setCreatedResult] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isCreateAgencyOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Le nom de l'agence est obligatoire.";
    if (!formData.managerName.trim()) newErrors.managerName = "Le nom de la gérante/responsable est obligatoire.";
    if (!formData.phone.trim()) newErrors.phone = "Le numéro WhatsApp de la gérante est obligatoire.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const selectedPlan = SUBSCRIPTION_PLANS.find(p => p.id === formData.plan) || SUBSCRIPTION_PLANS[1];

    const result = await createAgency({
      name: formData.name.trim(),
      managerName: formData.managerName.trim(),
      phone: formData.phone.trim(),
      neighborhood: formData.neighborhood.trim(),
      city: formData.city.trim(),
      plan: selectedPlan.name,
      monthlyFee: selectedPlan.price
    });

    setCreatedResult(result);
  };

  const handleCopyLink = () => {
    if (createdResult) {
      navigator.clipboard.writeText(createdResult.accessLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const getWhatsAppShareUrl = () => {
    if (!createdResult) return '';
    const cleanPhone = createdResult.agency.phone.replace(/[^0-9]/g, '');
    const planName = createdResult.agency.plan || 'Pro';
    const planPrice = (createdResult.agency.monthlyFee || 39000).toLocaleString('fr-FR');
    const message = encodeURIComponent(
      `Bonjour ${createdResult.agency.managerName},\n\nVotre espace privé pour l'agence *${createdResult.agency.name}* sur *PlacePro* est prêt !\n\n🎁 *7 jours d'essai gratuit activés* (Formule choisie : *${planName}* - ${planPrice} FCFA).\n\nAccédez à votre tableau de bord directement sur votre téléphone :\n👉 ${createdResult.accessLink}\n\nEnregistrez ce lien dans vos favoris WhatsApp pour gérer vos candidats, vos placements et vos commissions.`
    );
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  const handleSwitchToNewAgency = () => {
    if (createdResult) {
      switchAgency(createdResult.agency.agency_id);
      setIsCreateAgencyOpen(false);
      setCreatedResult(null);
    }
  };

  const handleClose = () => {
    setIsCreateAgencyOpen(false);
    setCreatedResult(null);
    setFormData({
      name: '',
      managerName: '',
      phone: '',
      neighborhood: 'Cocody',
      city: 'Abidjan',
      plan: 'pro'
    });
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(14, 26, 58, 0.65)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '520px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
        position: 'relative'
      }}>
        {/* En-tête */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-navy)', margin: 0 }}>
              Créer un Espace Agence
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '2px 0 0 0' }}>
              Génération automatique du lien privé pour une nouvelle cliente
            </p>
          </div>

          <button
            onClick={handleClose}
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

        {/* Résultat après création : Lien généré & Partage WhatsApp */}
        {createdResult ? (
          <div style={{ padding: '24px' }}>
            <div style={{
              backgroundColor: 'var(--badge-green-bg)',
              color: 'var(--badge-green-text)',
              padding: '14px',
              borderRadius: '12px',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ fontSize: '22px' }}>✓</div>
              <div>
                <strong style={{ fontSize: '14px' }}>Espace créé avec succès !</strong>
                <p style={{ fontSize: '12px', margin: '2px 0 0 0' }}>
                  Agence : {createdResult.agency.name} (ID : {createdResult.agency.agency_id})
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--color-navy)', marginBottom: '6px' }}>
                Lien d'accès unique généré pour l'agence :
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#F1F5F9',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                padding: '8px 12px',
                gap: '8px'
              }}>
                <input
                  type="text"
                  readOnly
                  value={createdResult.accessLink}
                  style={{
                    flex: 1,
                    background: 'none',
                    border: 'none',
                    fontSize: '12px',
                    color: 'var(--color-navy)',
                    fontWeight: '600',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="btn btn-outline"
                  style={{
                    minHeight: '32px',
                    padding: '4px 10px',
                    fontSize: '11px',
                    backgroundColor: copied ? '#DCFCE7' : '#FFFFFF',
                    borderColor: copied ? '#86EFAC' : '#CBD5E1',
                    color: copied ? '#15803D' : 'var(--color-navy)'
                  }}
                >
                  {copied ? '✓ Copié !' : 'Copier'}
                </button>
              </div>
            </div>

            {/* Actions de partage */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a
                href={getWhatsAppShareUrl()}
                target="_blank"
                rel="noreferrer"
                className="btn"
                style={{
                  backgroundColor: '#25D366',
                  color: '#FFFFFF',
                  width: '100%',
                  textDecoration: 'none'
                }}
              >
                Envoyer le lien sur WhatsApp ({createdResult.agency.phone})
              </a>

              <button
                type="button"
                onClick={handleSwitchToNewAgency}
                className="btn btn-navy"
                style={{ width: '100%' }}
              >
                Ouvrir cet espace agence maintenant
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="btn btn-outline"
                style={{ width: '100%' }}
              >
                Fermer
              </button>
            </div>
          </div>
        ) : (
          /* Formulaire de création */
          <form onSubmit={handleSubmit} style={{ padding: '20px 24px' }}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '4px' }}>
                Nom de l'agence de placement *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Entrez le nom de l'agence"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: `1px solid ${errors.name ? '#EF4444' : '#CBD5E1'}`,
                  fontSize: '13px'
                }}
              />
              {errors.name && <span style={{ color: '#EF4444', fontSize: '11px' }}>{errors.name}</span>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '4px' }}>
                  Nom de la gérante / patronne *
                </label>
                <input
                  type="text"
                  name="managerName"
                  value={formData.managerName}
                  onChange={handleChange}
                  placeholder="Entrez le nom et prénom de la gérante"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: `1px solid ${errors.managerName ? '#EF4444' : '#CBD5E1'}`,
                    fontSize: '13px'
                  }}
                />
                {errors.managerName && <span style={{ color: '#EF4444', fontSize: '11px' }}>{errors.managerName}</span>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '4px' }}>
                  Numéro WhatsApp (+225) *
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Entrez le numéro WhatsApp de l'agence"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: `1px solid ${errors.phone ? '#EF4444' : '#CBD5E1'}`,
                    fontSize: '13px'
                  }}
                />
                {errors.phone && <span style={{ color: '#EF4444', fontSize: '11px' }}>{errors.phone}</span>}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '4px' }}>
                  Commune / Quartier
                </label>
                <input
                  type="text"
                  name="neighborhood"
                  value={formData.neighborhood}
                  onChange={handleChange}
                  placeholder="Entrez la commune ou le quartier du siège"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '4px' }}>
                  Ville
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Entrez la ville"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px'
                  }}
                />
              </div>
            </div>

            {/* Choix du forfait & Période d'essai 7 jours */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-navy)' }}>
                  Formule d'abonnement souhaitée *
                </label>
                <span style={{
                  fontSize: '10.5px',
                  fontWeight: '800',
                  color: '#15803D',
                  backgroundColor: '#DCFCE7',
                  padding: '2px 8px',
                  borderRadius: '6px'
                }}>
                  🎁 7 jours d'essai gratuit
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {SUBSCRIPTION_PLANS.map(plan => {
                  const isSelected = formData.plan === plan.id;
                  return (
                    <div
                      key={plan.id}
                      onClick={() => setFormData(prev => ({ ...prev, plan: plan.id }))}
                      style={{
                        border: isSelected ? '2px solid var(--color-gold)' : '1.5px solid #E2E8F0',
                        backgroundColor: isSelected ? '#FAF5EA' : '#FFFFFF',
                        borderRadius: '10px',
                        padding: '10px 6px',
                        cursor: 'pointer',
                        textAlign: 'center',
                        position: 'relative',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {plan.badge && (
                        <div style={{
                          position: 'absolute',
                          top: '-8px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          backgroundColor: plan.id === 'pro' ? 'var(--color-gold)' : '#10B981',
                          color: 'var(--color-navy)',
                          fontSize: '9px',
                          fontWeight: '800',
                          padding: '1px 6px',
                          borderRadius: '9999px',
                          whiteSpace: 'nowrap'
                        }}>
                          {plan.badge}
                        </div>
                      )}
                      <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--color-navy)', marginTop: plan.badge ? '2px' : '0' }}>
                        {plan.name}
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-navy)', margin: '4px 0 2px 0' }}>
                        {plan.price.toLocaleString('fr-FR')} F
                      </div>
                      <div style={{ fontSize: '10px', color: '#64748B' }}>
                        {plan.period}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p style={{ fontSize: '11px', color: '#64748B', margin: '8px 0 0 0', textAlign: 'center' }}>
                L'agence démarre avec 7 jours d'accès complet sans engagement.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={handleClose}
                className="btn btn-outline"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn btn-navy"
                style={{ backgroundColor: 'var(--color-navy)' }}
              >
                Créer l'Espace & Générer le Lien
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
