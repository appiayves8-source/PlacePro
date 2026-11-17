import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function AddCandidateModal() {
  const { isAddCandidateOpen, setIsAddCandidateOpen, addCandidate, agency, navigateTo } = useApp();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    job: 'Nounou',
    customJob: '',
    neighborhood: 'Cocody',
    desiredSalary: '',
    idCardRef: '',
    guarantorName: '',
    guarantorRelation: 'Parent',
    guarantorPhone: '',
    guarantorNeighborhood: 'Yopougon',
    references: '',
    dataConsent: false
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);

  if (!isAddCandidateOpen) return null;

  const abidjanNeighborhoods = [
    'Cocody',
    'Cocody Angré',
    'Cocody Riviera',
    'Cocody Danga',
    'Yopougon',
    'Marcory',
    'Marcory Zone 4',
    'Plateau',
    'Treichville',
    'Abobo',
    'Adjamé',
    'Koumassi',
    'Port-Bouët',
    'Bingerville'
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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "Veuillez entrer le prénom.";
    if (!formData.lastName.trim()) newErrors.lastName = "Veuillez entrer le nom de famille.";
    if (!formData.phone.trim()) newErrors.phone = "Veuillez entrer le numéro de téléphone.";
    if (formData.job === 'Autre' && !formData.customJob.trim()) {
      newErrors.customJob = "Veuillez préciser le métier.";
    }
    if (!formData.desiredSalary || Number(formData.desiredSalary) <= 0) {
      newErrors.desiredSalary = "Veuillez indiquer un salaire demandé valide (en FCFA).";
    }
    if (!formData.guarantorName.trim()) {
      newErrors.guarantorName = "Le garant est obligatoire pour tout placement.";
    }
    if (!formData.guarantorPhone.trim()) {
      newErrors.guarantorPhone = "Veuillez indiquer le contact du garant.";
    }
    if (!formData.dataConsent) {
      newErrors.dataConsent = "L'accord de la personne est obligatoire avant tout enregistrement.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const finalJob = formData.job === 'Autre' ? (formData.customJob.trim() || 'Autre') : formData.job;

    const created = addCandidate({
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      phone: formData.phone.trim(),
      job: finalJob,
      neighborhood: formData.neighborhood,
      desiredSalary: Number(formData.desiredSalary),
      idCardRef: formData.idCardRef.trim() || "Attestation en cours",
      guarantor: {
        name: formData.guarantorName.trim(),
        relation: formData.guarantorRelation,
        phone: formData.guarantorPhone.trim(),
        neighborhood: formData.guarantorNeighborhood
      },
      references: formData.references.trim() || "Aucune référence renseignée",
      dataConsent: true
    });

    setSuccessMessage(`${created.firstName} ${created.lastName} a été enregistré(e) avec succès ! (Score de confiance initial : 70/100)`);

    setTimeout(() => {
      setSuccessMessage(null);
      setIsAddCandidateOpen(false);
      navigateTo('candidates');
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
        {/* En-tête de la modale */}
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
              Ajouter un Candidat
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '2px 0 0 0' }}>
              Espace : {agency.name}
            </p>
          </div>

          <button
            onClick={() => setIsAddCandidateOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '22px',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            ×
          </button>
        </div>

        {/* Message de confirmation */}
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
              Enregistrement réussi
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '6px' }}>
              {successMessage}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: '20px 24px' }}>
            {/* Section 1 : Identité */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-gold)', textTransform: 'uppercase', marginBottom: '10px' }}>
                1. Identité du candidat
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '4px' }}>
                    Prénom *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Entrez le prénom"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: `1px solid ${errors.firstName ? '#EF4444' : '#CBD5E1'}`,
                      fontSize: '13px'
                    }}
                  />
                  {errors.firstName && <span style={{ color: '#EF4444', fontSize: '11px' }}>{errors.firstName}</span>}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '4px' }}>
                    Nom de famille *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Entrez le nom de famille"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: `1px solid ${errors.lastName ? '#EF4444' : '#CBD5E1'}`,
                      fontSize: '13px'
                    }}
                  />
                  {errors.lastName && <span style={{ color: '#EF4444', fontSize: '11px' }}>{errors.lastName}</span>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '4px' }}>
                    Métier recherché *
                  </label>
                  <select
                    name="job"
                    value={formData.job}
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

                  {formData.job === 'Autre' && (
                    <div style={{ marginTop: '8px' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--color-gold)', marginBottom: '4px' }}>
                        Précisez le métier *
                      </label>
                      <input
                        type="text"
                        name="customJob"
                        value={formData.customJob}
                        onChange={handleChange}
                        placeholder="Entrez le métier personnalisé"
                        autoFocus
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: `1.5px solid ${errors.customJob ? '#EF4444' : 'var(--color-gold)'}`,
                          fontSize: '13px',
                          backgroundColor: '#FFFDF5'
                        }}
                      />
                      {errors.customJob && <span style={{ color: '#EF4444', fontSize: '11px' }}>{errors.customJob}</span>}
                    </div>
                  )}
                </div>

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
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '4px' }}>
                    Téléphone (+225) *
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Entrez le numéro de téléphone WhatsApp"
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
                    Salaire demandé (FCFA) *
                  </label>
                  <input
                    type="number"
                    name="desiredSalary"
                    value={formData.desiredSalary}
                    onChange={handleChange}
                    placeholder="Entrez le salaire souhaité (FCFA)"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: `1px solid ${errors.desiredSalary ? '#EF4444' : '#CBD5E1'}`,
                      fontSize: '13px'
                    }}
                  />
                  {errors.desiredSalary && <span style={{ color: '#EF4444', fontSize: '11px' }}>{errors.desiredSalary}</span>}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '4px' }}>
                  Numéro CNI ou Pièce d'identité
                </label>
                <input
                  type="text"
                  name="idCardRef"
                  value={formData.idCardRef}
                  onChange={handleChange}
                  placeholder="Entrez le numéro de la pièce d'identité"
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

            {/* Section 2 : Garant légal */}
            <div style={{ marginBottom: '18px', paddingTop: '14px', borderTop: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-gold)', textTransform: 'uppercase', marginBottom: '10px' }}>
                2. Garant obligatoire
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '4px' }}>
                    Nom complet du garant *
                  </label>
                  <input
                    type="text"
                    name="guarantorName"
                    value={formData.guarantorName}
                    onChange={handleChange}
                    placeholder="Entrez le nom et prénom du garant"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: `1px solid ${errors.guarantorName ? '#EF4444' : '#CBD5E1'}`,
                      fontSize: '13px'
                    }}
                  />
                  {errors.guarantorName && <span style={{ color: '#EF4444', fontSize: '11px' }}>{errors.guarantorName}</span>}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '4px' }}>
                    Lien de parenté *
                  </label>
                  <select
                    name="guarantorRelation"
                    value={formData.guarantorRelation}
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
                    <option value="Père">Père</option>
                    <option value="Mère">Mère</option>
                    <option value="Frère">Frère</option>
                    <option value="Sœur">Sœur</option>
                    <option value="Oncle">Oncle</option>
                    <option value="Tuteur">Tuteur</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '4px' }}>
                    Téléphone du garant *
                  </label>
                  <input
                    type="text"
                    name="guarantorPhone"
                    value={formData.guarantorPhone}
                    onChange={handleChange}
                    placeholder="Entrez le numéro de téléphone du garant"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: `1px solid ${errors.guarantorPhone ? '#EF4444' : '#CBD5E1'}`,
                      fontSize: '13px'
                    }}
                  />
                  {errors.guarantorPhone && <span style={{ color: '#EF4444', fontSize: '11px' }}>{errors.guarantorPhone}</span>}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '4px' }}>
                    Quartier du garant
                  </label>
                  <input
                    type="text"
                    name="guarantorNeighborhood"
                    value={formData.guarantorNeighborhood}
                    onChange={handleChange}
                    placeholder="Entrez le quartier du garant"
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
            </div>

            {/* Section 3 : Références et Accord obligatoire */}
            <div style={{ marginBottom: '20px', paddingTop: '14px', borderTop: '1px solid var(--color-border)' }}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '4px' }}>
                  Références / Expérience antérieure
                </label>
                <textarea
                  name="references"
                  value={formData.references}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Entrez les expériences professionnelles et références précédentes..."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px'
                  }}
                />
              </div>

              {/* Case obligatoire de consentement (Loi sur la protection des données) */}
              <div style={{
                backgroundColor: '#FEF3C7',
                border: '1px solid #FDE68A',
                borderRadius: '10px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <input
                  type="checkbox"
                  id="dataConsent"
                  name="dataConsent"
                  checked={formData.dataConsent}
                  onChange={handleChange}
                  style={{ width: '18px', height: '18px', marginTop: '2px', cursor: 'pointer', flexShrink: 0 }}
                />
                <label htmlFor="dataConsent" style={{ fontSize: '12px', color: '#92400E', lineHeight: '1.4', cursor: 'pointer' }}>
                  <strong>Consentement obligatoire (Loi n° 2013-450) :</strong> J'atteste avoir recueilli l'accord express et éclairé de la personne pour l'enregistrement et le traitement de ses données au sein de PlacePro.
                </label>
              </div>
              {errors.dataConsent && (
                <div style={{ color: '#EF4444', fontSize: '11px', marginTop: '4px' }}>
                  {errors.dataConsent}
                </div>
              )}
            </div>

            {/* Boutons d'action */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setIsAddCandidateOpen(false)}
                className="btn btn-outline"
                style={{ minHeight: '44px' }}
              >
                Annuler
              </button>

              <button
                type="submit"
                className="btn btn-navy"
                style={{ minHeight: '44px', padding: '10px 24px', backgroundColor: 'var(--color-navy)' }}
              >
                Enregistrer le candidat (Score 70)
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
