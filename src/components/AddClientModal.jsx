import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function AddClientModal() {
  const { isAddClientOpen, setIsAddClientOpen, addClient, agency, navigateTo } = useApp();

  const [formData, setFormData] = useState({
    type: 'Famille',
    name: '',
    contactPerson: '',
    phone: '',
    whatsapp: '',
    neighborhood: 'Cocody',
    addressDetails: '',
    staffNeeded: 'Nounou',
    customStaffNeeded: '',
    livingArrangement: 'Non-logé(e)',
    budget: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);

  if (!isAddClientOpen) return null;

  const abidjanNeighborhoods = [
    'Cocody',
    'Cocody Angré',
    'Cocody Riviera Palmeraie',
    'Cocody Deux-Plateaux',
    'Cocody Danga',
    'Marcory',
    'Marcory Zone 4',
    'Marcory Résidentiel',
    'Plateau',
    'Yopougon',
    'Treichville',
    'Koumassi',
    'Port-Bouët',
    'Bingerville',
    'Abobo'
  ];

  const jobsList = [
    'Nounou',
    'Aide-ménagère',
    'Chauffeur',
    'Gardien',
    'Cuisinière',
    'Baby-sitter',
    'Autre'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Le nom de la famille ou de l'entreprise est obligatoire.";
    if (!formData.contactPerson.trim()) newErrors.contactPerson = "Le nom de la personne de contact est obligatoire.";
    if (!formData.phone.trim()) newErrors.phone = "Le numéro de téléphone est obligatoire.";
    if (formData.staffNeeded === 'Autre' && !formData.customStaffNeeded?.trim()) {
      newErrors.customStaffNeeded = "Veuillez préciser le métier recherché.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const finalStaff = formData.staffNeeded === 'Autre' ? (formData.customStaffNeeded.trim() || 'Autre') : formData.staffNeeded;

    const created = addClient({
      type: formData.type,
      name: formData.name.trim(),
      contactPerson: formData.contactPerson.trim(),
      phone: formData.phone.trim(),
      whatsapp: formData.whatsapp.trim() || formData.phone.trim(),
      neighborhood: formData.neighborhood,
      addressDetails: formData.addressDetails.trim(),
      staffNeeded: finalStaff,
      livingArrangement: formData.livingArrangement,
      budget: Number(formData.budget) || 0,
      notes: formData.notes.trim()
    });

    setSuccessMessage(`${created.name} a été enregistré(e) avec succès !`);

    setTimeout(() => {
      setSuccessMessage(null);
      setIsAddClientOpen(false);
      navigateTo('clients');
    }, 1200);
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
        maxWidth: '540px',
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
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          backgroundColor: '#FFFFFF',
          zIndex: 10
        }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-navy)', margin: 0 }}>
              Nouveau Client / Famille
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '2px 0 0 0' }}>
              Enregistrer un employeur potentiel ou actif
            </p>
          </div>

          <button
            onClick={() => setIsAddClientOpen(false)}
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

        {successMessage ? (
          <div style={{ padding: '40px 24px', textAlign: 'center' }}>
            <div style={{
              width: '56px',
              height: '56px',
              backgroundColor: 'var(--badge-green-bg)',
              color: 'var(--badge-green-text)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              fontSize: '24px'
            }}>
              ✓
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-navy)' }}>
              Client enregistré
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '6px' }}>
              {successMessage}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: '20px 24px' }}>
            {/* Type de client */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--color-navy)', marginBottom: '6px' }}>
                Type de client *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: 'Famille' }))}
                  className="btn"
                  style={{
                    backgroundColor: formData.type === 'Famille' ? 'var(--color-navy)' : '#F1F5F9',
                    color: formData.type === 'Famille' ? '#FFFFFF' : 'var(--color-navy)',
                    minHeight: '40px',
                    fontSize: '13px'
                  }}
                >
                  Famille / Particulier
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: 'Entreprise' }))}
                  className="btn"
                  style={{
                    backgroundColor: formData.type === 'Entreprise' ? 'var(--color-navy)' : '#F1F5F9',
                    color: formData.type === 'Entreprise' ? '#FFFFFF' : 'var(--color-navy)',
                    minHeight: '40px',
                    fontSize: '13px'
                  }}
                >
                  Entreprise / Société
                </button>
              </div>
            </div>

            {/* Nom & Contact */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '4px' }}>
                  {formData.type === 'Famille' ? 'Nom de la Famille *' : "Nom de l'Entreprise *"}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={formData.type === 'Famille' ? 'Entrez le nom de la famille' : "Entrez le nom de l'entreprise"}
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

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '4px' }}>
                  Personne de contact *
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  placeholder="Entrez le nom et prénom du contact"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: `1px solid ${errors.contactPerson ? '#EF4444' : '#CBD5E1'}`,
                    fontSize: '13px'
                  }}
                />
                {errors.contactPerson && <span style={{ color: '#EF4444', fontSize: '11px' }}>{errors.contactPerson}</span>}
              </div>
            </div>

            {/* Téléphone & WhatsApp */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '4px' }}>
                  Téléphone appel *
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Entrez le numéro de téléphone"
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

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '4px' }}>
                  WhatsApp (pour reçus & relances)
                </label>
                <input
                  type="text"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="Entrez le numéro WhatsApp"
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

            {/* Localisation */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '4px' }}>
                  Commune / Quartier *
                </label>
                <select
                  name="neighborhood"
                  value={formData.neighborhood}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    backgroundColor: '#FFFFFF'
                  }}
                >
                  {abidjanNeighborhoods.map(q => <option key={q} value={q}>{q}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '4px' }}>
                  Repère / Adresse précise
                </label>
                <input
                  type="text"
                  name="addressDetails"
                  value={formData.addressDetails}
                  onChange={handleChange}
                  placeholder="Entrez l'adresse précise ou un repère"
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

            {/* Besoin & Régime */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '4px' }}>
                  Personnel recherché
                </label>
                <select
                  name="staffNeeded"
                  value={formData.staffNeeded}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    backgroundColor: '#FFFFFF'
                  }}
                >
                  {jobsList.map(j => <option key={j} value={j}>{j}</option>)}
                </select>

                {formData.staffNeeded === 'Autre' && (
                  <div style={{ marginTop: '8px' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--color-gold)', marginBottom: '4px' }}>
                      Précisez le métier recherché *
                    </label>
                    <input
                      type="text"
                      name="customStaffNeeded"
                      value={formData.customStaffNeeded}
                      onChange={handleChange}
                      placeholder="Entrez le métier recherché"
                      autoFocus
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: `1.5px solid ${errors.customStaffNeeded ? '#EF4444' : 'var(--color-gold)'}`,
                        fontSize: '13px',
                        backgroundColor: '#FFFDF5'
                      }}
                    />
                    {errors.customStaffNeeded && <span style={{ color: '#EF4444', fontSize: '11px' }}>{errors.customStaffNeeded}</span>}
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '4px' }}>
                  Régime de travail
                </label>
                <select
                  name="livingArrangement"
                  value={formData.livingArrangement}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    backgroundColor: '#FFFFFF'
                  }}
                >
                  <option value="Non-logé(e)">Non-logé(e) (Externe)</option>
                  <option value="Logé(e)">Logé(e) (Au pair / Interne)</option>
                  <option value="Temps partiel">Temps partiel (2-3 jours/semaine)</option>
                </select>
              </div>
            </div>

            {/* Budget & Notes */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '4px' }}>
                  Budget mensuel prévu pour le salaire (FCFA)
                </label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="Entrez le budget mensuel prévu (FCFA)"
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
                  Notes ou exigences particulières
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Entrez les exigences spécifiques ou consignes particulières..."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px'
                  }}
                />
              </div>
            </div>

            {/* Boutons */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setIsAddClientOpen(false)}
                className="btn btn-outline"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn btn-navy"
                style={{ backgroundColor: 'var(--color-navy)' }}
              >
                Enregistrer la Famille / Client
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
