import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function NewPlacementModal() {
  const { 
    isNewPlacementOpen, 
    setIsNewPlacementOpen, 
    candidates, 
    clients, 
    addPlacement,
    navigateTo,
    agency 
  } = useApp();

  const [candidateId, setCandidateId] = useState('');
  const [clientId, setClientId] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1); // Échéance par mois (mensuelle) et non par an
    return d.toISOString().split('T')[0];
  });
  const [monthlySalary, setMonthlySalary] = useState('');

  // ========================================================
  // MOTEUR DE COMMISSION FLEXIBLE SELON LES CONDITIONS DE L'AGENCE
  // ========================================================
  // Modes de calcul : '100_percent' | '50_percent' | 'custom_percent' | 'fixed_amount' | 'custom_free'
  const [commissionModel, setCommissionModel] = useState('100_percent');
  const [customPercentage, setCustomPercentage] = useState(75);
  const [fixedAmount, setFixedAmount] = useState(50000);
  const [totalCommission, setTotalCommission] = useState('');
  
  // Payeur de la commission : 'client' (Famille) | 'candidate' (Employé) | 'shared' (Partagé 50/50)
  const [commissionPayer, setCommissionPayer] = useState('client');

  // Découpage en tranches : '1_shot' | '2_split' | '3_split' | 'custom'
  const [splitMode, setSplitMode] = useState('2_split');
  const [installments, setInstallments] = useState([]);

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);

  // Calcul automatique de la commission totale selon le modèle choisi
  useEffect(() => {
    if (!isNewPlacementOpen) return;
    const sal = Number(monthlySalary) || 0;
    if (sal > 0) {
      if (commissionModel === '100_percent') {
        setTotalCommission(sal.toString());
      } else if (commissionModel === '50_percent') {
        setTotalCommission(Math.round(sal * 0.5).toString());
      } else if (commissionModel === 'custom_percent') {
        setTotalCommission(Math.round(sal * (Number(customPercentage) / 100)).toString());
      } else if (commissionModel === 'fixed_amount') {
        setTotalCommission(fixedAmount.toString());
      }
    }
  }, [monthlySalary, commissionModel, customPercentage, fixedAmount, isNewPlacementOpen]);

  // Recalcul automatique des tranches quand la commission ou la date changent
  useEffect(() => {
    if (!isNewPlacementOpen) return;
    const comm = Number(totalCommission) || 0;
    if (comm <= 0) {
      setInstallments([]);
      return;
    }

    const start = new Date(startDate || new Date());
    const date1 = start.toISOString().split('T')[0];
    const date2 = new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const date3 = new Date(start.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    if (splitMode === '1_shot') {
      setInstallments([
        {
          id: `inst-1`,
          label: "Paiement comptant (100% à la prise de service)",
          amount: comm,
          dueDate: date1,
          status: "en_attente",
          payer: commissionPayer
        }
      ]);
    } else if (splitMode === '2_split') {
      const half1 = Math.round(comm / 2);
      const half2 = comm - half1;
      setInstallments([
        {
          id: `inst-1`,
          label: "Tranche 1 (50% à la prise de service)",
          amount: half1,
          dueDate: date1,
          status: "en_attente",
          payer: commissionPayer
        },
        {
          id: `inst-2`,
          label: "Tranche 2 (50% à 30 jours)",
          amount: half2,
          dueDate: date2,
          status: "en_attente",
          payer: commissionPayer
        }
      ]);
    } else if (splitMode === '3_split') {
      const part1 = Math.round(comm / 3);
      const part2 = Math.round(comm / 3);
      const part3 = comm - (part1 + part2);
      setInstallments([
        {
          id: `inst-1`,
          label: "Tranche 1 (33% prise de service)",
          amount: part1,
          dueDate: date1,
          status: "en_attente",
          payer: commissionPayer
        },
        {
          id: `inst-2`,
          label: "Tranche 2 (33% à 30 jours)",
          amount: part2,
          dueDate: date2,
          status: "en_attente",
          payer: commissionPayer
        },
        {
          id: `inst-3`,
          label: "Tranche 3 (Solde à 60 jours)",
          amount: part3,
          dueDate: date3,
          status: "en_attente",
          payer: commissionPayer
        }
      ]);
    }
  }, [totalCommission, startDate, splitMode, commissionPayer, isNewPlacementOpen]);

  // Initialisation par défaut à l'ouverture de la modale
  useEffect(() => {
    if (isNewPlacementOpen) {
      setErrors({});
      setSuccessMessage(null);
      if (!candidateId && candidates.length > 0) {
        setCandidateId(candidates[0].id);
        setMonthlySalary(candidates[0].desiredSalary.toString());
      }
      if (!clientId && clients.length > 0) {
        setClientId(clients[0].id);
      }
    }
  }, [isNewPlacementOpen, candidates, clients]);

  // Ne pas afficher si la modale est fermée (après TOUS les hooks React)
  if (!isNewPlacementOpen) return null;

  // Modification manuelle d'une tranche spécifique
  const handleInstallmentChange = (index, field, value) => {
    const updated = [...installments];
    updated[index] = {
      ...updated[index],
      [field]: field === 'amount' ? Number(value) : value
    };
    setInstallments(updated);
  };

  // Ajouter une tranche personnalisée
  const addCustomInstallment = () => {
    setSplitMode('custom');
    setInstallments([
      ...installments,
      {
        id: `inst-${installments.length + 1}`,
        label: `Tranche ${installments.length + 1}`,
        amount: 0,
        dueDate: startDate,
        status: "en_attente",
        payer: commissionPayer
      }
    ]);
  };

  // Suppression d'une tranche
  const removeInstallment = (index) => {
    setSplitMode('custom');
    setInstallments(installments.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!candidateId) newErrors.candidateId = "Veuillez sélectionner un candidat.";
    if (!clientId) newErrors.clientId = "Veuillez sélectionner une famille ou client.";
    if (!monthlySalary || Number(monthlySalary) <= 0) newErrors.monthlySalary = "Indiquez le salaire mensuel négocié.";
    if (!totalCommission || Number(totalCommission) <= 0) newErrors.totalCommission = "Indiquez la commission d'agence.";

    // Vérifier que la somme des tranches correspond au total
    const sumTranches = installments.reduce((s, i) => s + (Number(i.amount) || 0), 0);
    if (installments.length > 0 && sumTranches !== Number(totalCommission)) {
      newErrors.installments = `La somme des tranches (${sumTranches.toLocaleString('fr-FR')} FCFA) ne correspond pas au total de la commission (${Number(totalCommission).toLocaleString('fr-FR')} FCFA). Ajustez les montants.`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const selectedCand = candidates.find(c => c.id === candidateId);
    const selectedCli = clients.find(cl => cl.id === clientId);

    addPlacement({
      candidateId,
      clientId,
      candidateName: `${selectedCand?.firstName} ${selectedCand?.lastName}`,
      clientName: selectedCli?.name,
      startDate,
      endDate,
      monthlySalary: Number(monthlySalary),
      totalCommission: Number(totalCommission),
      commissionModel,
      commissionPayer,
      installments: installments.map((inst, idx) => ({
        ...inst,
        id: `inst-${Date.now()}-${idx + 1}`,
        paidAt: null,
        paymentMethod: null,
        receiptNumber: null
      }))
    });

    setSuccessMessage(`Placement enregistré selon les conditions de ${agency.name} ! ${selectedCand?.firstName} est placé(e) chez ${selectedCli?.name}.`);

    setTimeout(() => {
      setSuccessMessage(null);
      setIsNewPlacementOpen(false);
      navigateTo('placements');
    }, 1200);
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
      zIndex: 100,
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '620px',
        maxHeight: '92vh',
        overflowY: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.25)',
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
              Nouveau Placement & Conditions de Commission
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '2px 0 0 0' }}>
              Espace : {agency.name} • Paramétrage sur mesure
            </p>
          </div>

          <button
            onClick={() => setIsNewPlacementOpen(false)}
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
              Contrat validé
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '6px' }}>
              {successMessage}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: '20px 24px' }}>
            
            {/* 1. BINÔME CANDIDAT & FAMILLE */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-gold)', textTransform: 'uppercase', marginBottom: '8px' }}>
                1. Attribution du Poste
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-navy)', marginBottom: '4px' }}>
                    Candidat *
                  </label>
                  <select
                    value={candidateId}
                    onChange={(e) => {
                      setCandidateId(e.target.value);
                      const c = candidates.find(cand => cand.id === e.target.value);
                      if (c && !monthlySalary) {
                        setMonthlySalary(c.desiredSalary);
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: `1px solid ${errors.candidateId ? '#EF4444' : '#CBD5E1'}`,
                      fontSize: '13px',
                      backgroundColor: '#FFFFFF'
                    }}
                  >
                    <option value="">-- Choisir un candidat --</option>
                    {candidates.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.firstName} {c.lastName} ({c.job} • {c.neighborhood})
                      </option>
                    ))}
                  </select>
                  {errors.candidateId && <span style={{ color: '#EF4444', fontSize: '11px' }}>{errors.candidateId}</span>}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-navy)', marginBottom: '4px' }}>
                    Employeur / Famille *
                  </label>
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: `1px solid ${errors.clientId ? '#EF4444' : '#CBD5E1'}`,
                      fontSize: '13px',
                      backgroundColor: '#FFFFFF'
                    }}
                  >
                    <option value="">-- Choisir un client --</option>
                    {clients.map(cl => (
                      <option key={cl.id} value={cl.id}>
                        {cl.name} ({cl.neighborhood})
                      </option>
                    ))}
                  </select>
                  {errors.clientId && <span style={{ color: '#EF4444', fontSize: '11px' }}>{errors.clientId}</span>}
                </div>
              </div>
            </div>

            {/* 2. DATES ET SALAIRE */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-navy)', marginBottom: '4px' }}>
                  Date d'embauche *
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    const newStart = e.target.value;
                    setStartDate(newStart);
                    if (newStart) {
                      const d = new Date(newStart);
                      d.setMonth(d.getMonth() + 1);
                      setEndDate(d.toISOString().split('T')[0]);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '12px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-navy)', marginBottom: '4px' }}>
                  Fin du contrat (Mensuel) *
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '12px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-navy)', marginBottom: '4px' }}>
                  Salaire employé (FCFA) *
                </label>
                <input
                  type="number"
                  value={monthlySalary}
                  onChange={(e) => setMonthlySalary(e.target.value)}
                  placeholder="Entrez le salaire convenu (FCFA)"
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: `1px solid ${errors.monthlySalary ? '#EF4444' : '#CBD5E1'}`,
                    fontSize: '13px',
                    fontWeight: '700'
                  }}
                />
              </div>
            </div>

            {/* 3. CONDITIONS DE LA COMMISSION PROPRES À L'AGENCE */}
            <div style={{
              backgroundColor: '#FAF5EA',
              border: '1.5px solid var(--color-gold-border)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '18px'
            }}>
              <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-navy)', textTransform: 'uppercase', marginBottom: '10px' }}>
                2. Conditions de Commission de l'Agence
              </div>

              {/* Choix du modèle de calcul */}
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--color-navy)', marginBottom: '6px' }}>
                  Règle de calcul appliquée :
                </label>
                <select
                  value={commissionModel}
                  onChange={(e) => setCommissionModel(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    backgroundColor: '#FFFFFF',
                    fontWeight: '600'
                  }}
                >
                  <option value="100_percent">100% du 1er mois de salaire (Pratique standard Abidjan)</option>
                  <option value="50_percent">50% du 1er mois de salaire</option>
                  <option value="custom_percent">Pourcentage personnalisé sur le salaire</option>
                  <option value="fixed_amount">Montant Forfaitaire fixe de l'agence</option>
                  <option value="custom_free">Saisie libre du montant négocié</option>
                </select>
              </div>

              {/* Champs conditionnels selon le modèle */}
              {commissionModel === 'custom_percent' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <label style={{ fontSize: '12px', color: 'var(--color-navy)', fontWeight: '600' }}>
                    Pourcentage appliqué :
                  </label>
                  <input
                    type="number"
                    value={customPercentage}
                    onChange={(e) => setCustomPercentage(e.target.value)}
                    style={{ width: '80px', padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                  />
                  <span style={{ fontSize: '12px', fontWeight: '700' }}>%</span>
                </div>
              )}

              {commissionModel === 'fixed_amount' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <label style={{ fontSize: '12px', color: 'var(--color-navy)', fontWeight: '600' }}>
                    Montant forfaitaire :
                  </label>
                  <input
                    type="number"
                    value={fixedAmount}
                    onChange={(e) => setFixedAmount(Number(e.target.value))}
                    style={{ width: '120px', padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                  />
                  <span style={{ fontSize: '12px', fontWeight: '700' }}>FCFA</span>
                </div>
              )}

              {/* Commission Totale Calculée & Payeur */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--color-navy)', marginBottom: '4px' }}>
                    Commission totale due (FCFA) *
                  </label>
                  <input
                    type="number"
                    value={totalCommission}
                    onChange={(e) => {
                      setCommissionModel('custom_free');
                      setTotalCommission(e.target.value);
                    }}
                    placeholder="Entrez la commission totale (FCFA)"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid var(--color-gold)',
                      fontSize: '15px',
                      fontWeight: '800',
                      color: 'var(--color-navy)',
                      backgroundColor: '#FFFFFF'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--color-navy)', marginBottom: '4px' }}>
                    Qui règle cette commission ?
                  </label>
                  <select
                    value={commissionPayer}
                    onChange={(e) => setCommissionPayer(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '12px',
                      backgroundColor: '#FFFFFF'
                    }}
                  >
                    <option value="client">La Famille / Employeur (Frais d'agence)</option>
                    <option value="candidate">Retenue sur l'Employé (Sur 1er salaire)</option>
                    <option value="shared">Partagé (50% Famille / 50% Employé)</option>
                  </select>
                </div>
              </div>

              {/* Mode de découpage en tranches */}
              <div style={{ borderTop: '1px solid var(--color-gold-border)', paddingTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-navy)' }}>
                    Échéances de paiement :
                  </label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setSplitMode('1_shot')}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '700',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: splitMode === '1_shot' ? 'var(--color-navy)' : '#E2E8F0',
                        color: splitMode === '1_shot' ? '#FFFFFF' : 'var(--color-navy)'
                      }}
                    >
                      Comptant (1x)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSplitMode('2_split')}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '700',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: splitMode === '2_split' ? 'var(--color-navy)' : '#E2E8F0',
                        color: splitMode === '2_split' ? '#FFFFFF' : 'var(--color-navy)'
                      }}
                    >
                      2 Tranches (50/50)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSplitMode('3_split')}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '700',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: splitMode === '3_split' ? 'var(--color-navy)' : '#E2E8F0',
                        color: splitMode === '3_split' ? '#FFFFFF' : 'var(--color-navy)'
                      }}
                    >
                      3 Tranches
                    </button>
                  </div>
                </div>

                {/* Liste modifiable des tranches générées */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {installments.map((inst, idx) => (
                    <div 
                      key={idx}
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        padding: '8px 10px',
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr 1fr auto',
                        gap: '8px',
                        alignItems: 'center'
                      }}
                    >
                      <input
                        type="text"
                        value={inst.label}
                        onChange={(e) => handleInstallmentChange(idx, 'label', e.target.value)}
                        style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #CBD5E1' }}
                      />

                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <input
                          type="number"
                          value={inst.amount}
                          onChange={(e) => handleInstallmentChange(idx, 'amount', e.target.value)}
                          style={{ width: '100%', fontSize: '12px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #CBD5E1', fontWeight: '700' }}
                        />
                        <span style={{ fontSize: '10px' }}>F</span>
                      </div>

                      <input
                        type="date"
                        value={inst.dueDate}
                        onChange={(e) => handleInstallmentChange(idx, 'dueDate', e.target.value)}
                        style={{ fontSize: '11px', padding: '4px 6px', borderRadius: '4px', border: '1px solid #CBD5E1' }}
                      />

                      {installments.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeInstallment(idx)}
                          style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '14px', padding: '2px 4px' }}
                          title="Supprimer cette tranche"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {errors.installments && (
                  <div style={{ color: '#EF4444', fontSize: '11px', marginTop: '6px', fontWeight: '600' }}>
                    {errors.installments}
                  </div>
                )}

                <button
                  type="button"
                  onClick={addCustomInstallment}
                  style={{
                    marginTop: '8px',
                    background: 'none',
                    border: '1px dashed var(--color-navy)',
                    color: 'var(--color-navy)',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  + Ajouter une tranche manuelle
                </button>
              </div>
            </div>

            {/* Boutons d'action */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setIsNewPlacementOpen(false)}
                className="btn btn-outline"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn btn-navy"
                style={{ backgroundColor: 'var(--color-navy)', padding: '10px 20px' }}
              >
                Enregistrer le Contrat selon ces conditions
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
