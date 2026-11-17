// PlacePro - Données et configuration officielles (Côte d'Ivoire)
// Toutes les données applicatives (agences, candidats, clients, contrats, paiements)
// proviennent exclusivement de la base de données PostgreSQL Supabase.

export const SUBSCRIPTION_PLANS = [
  {
    id: "starter",
    name: "Starter",
    billingCycle: "mensuel",
    price: 19000,
    formattedPrice: "19 000 FCFA",
    period: "/mois",
    badge: null,
    highlight: false,
    description: "Idéal pour démarrer ou pour les agences en phase de lancement.",
    features: [
      "Personnel actif sans coupure",
      "Contrats de placement & reçus officiels",
      "Alertes fins de contrats & relances",
      "Suivi des commissions agence",
      "Support standard par WhatsApp"
    ]
  },
  {
    id: "pro",
    name: "Pro",
    billingCycle: "mensuel",
    price: 39000,
    formattedPrice: "39 000 FCFA",
    period: "/mois",
    badge: "Recommandé",
    highlight: true,
    description: "La formule complète pour les agences en pleine activité à Abidjan.",
    features: [
      "Personnel & Placements illimités",
      "Portails WhatsApp dédiés (Employés & Familles)",
      "Gestion des urgences & signalements en direct",
      "Reçus officiels PDF & suivi financier poussé",
      "Support prioritaire 7j/7"
    ]
  },
  {
    id: "annuel",
    name: "Pack Annuel",
    billingCycle: "annuel",
    price: 399000,
    formattedPrice: "399 000 FCFA",
    period: "/an",
    badge: "Économie Maxi",
    highlight: false,
    description: "Une année complète de sérénité avec près de 2 mois offerts !",
    features: [
      "Toutes les options du plan Pro en illimité",
      "12 mois d'accès sans coupure",
      "Économisez 69 000 FCFA sur l'année (près de 2 mois offerts)",
      "Accompagnement VIP dédié par Cyrille (Fondateur)",
      "Mises à jour et évolutions prioritaires"
    ]
  }
];

// Données initiales vides : Tout est lu et écrit depuis Supabase
export const AGENCY_CONFIG = null;
export const INITIAL_AGENCIES = [];
export const INITIAL_CANDIDATES = [];
export const INITIAL_CLIENTS = [];
export const INITIAL_PLACEMENTS = [];
export const INITIAL_PAYMENTS = [];
export const INITIAL_NOTIFICATIONS = [];
export const INITIAL_SUPER_ADMIN_PAYMENTS = [];
