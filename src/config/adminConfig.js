// ========================================================
// CONFIGURATION OFFICIELLE PLACEPRO - ADMINISTRATION CYRILLE
// Centralise le numéro officiel pour Wave, MTN MoMo et WhatsApp.
// Tiré de la variable d'environnement VITE_ADMIN_PHONE dans .env
// ========================================================

const rawEnvPhone = import.meta.env.VITE_ADMIN_PHONE || "0502629821";
const digitsOnly = rawEnvPhone.replace(/[^0-9]/g, '');
const national10 = digitsOnly.length >= 10 ? digitsOnly.slice(-10) : digitsOnly;

export const ADMIN_CONFIG = {
  name: "Cyrille",
  title: "Fondateur PlacePro",
  company: "PlacePro Côte d'Ivoire",
  
  // Format local brut pour Wave / Mobile Money (ex: "0502629821")
  phoneRaw: national10,
  
  // Format international lisible pour affichage (ex: "+225 05 02 62 98 21")
  phoneFormatted: national10.length === 10 
    ? `+225 ${national10.slice(0, 2)} ${national10.slice(2, 4)} ${national10.slice(4, 6)} ${national10.slice(6, 8)} ${national10.slice(8, 10)}`
    : `+225 ${national10}`,

  // Format international sans signe pour les liens WhatsApp wa.me (ex: "2250502629821")
  phoneWhatsApp: `225${national10}`,

  // Générateur de lien WhatsApp de contact / support
  getWhatsAppLink: (messageText) => {
    return `https://wa.me/225${national10}?text=${encodeURIComponent(messageText)}`;
  }
};

// URL officielle de production PlacePro en ligne sur Vercel
export const PRODUCTION_URL = "https://place-pro-mu.vercel.app";

// Helper universel pour garantir que tous les liens partagés (WhatsApp / SMS)
// pointent toujours vers le vrai domaine HTTPS, même si testés depuis localhost
export const getPublicAppUrl = () => {
  const envUrl = import.meta.env.VITE_APP_URL;
  if (envUrl && !envUrl.includes('localhost')) {
    return envUrl.replace(/\/$/, '');
  }
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    if (origin && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
      return origin.replace(/\/$/, '');
    }
  }
  return PRODUCTION_URL;
};

// Formateur de numéro de téléphone ivoirien pour liens wa.me (ajoute 225 si 10 chiffres)
export const formatWhatsAppPhone = (phone) => {
  const digits = (phone || '').replace(/[^0-9]/g, '');
  if (!digits) return '';
  if (digits.startsWith('225') && digits.length >= 12) return digits;
  if (digits.length === 10) return `225${digits}`;
  return digits;
};
