import React, { useState } from 'react';

/**
 * Landing Page Officielle PlacePro (Côte d'Ivoire)
 * Design Haute Précision : Or (#D4AF37) & Bleu Nuit (#07152A)
 */
export default function LandingPage({ onNavigateToAuth }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="bg-night-deep text-cream font-sans antialiased selection:bg-gold selection:text-night-deep min-h-screen overflow-x-hidden">

{/* BEGIN: MainHeader */}
<header className="fixed top-0 left-0 right-0 z-50 bg-[#07152A]/85 backdrop-blur-md border-b border-gold/15 transition-all duration-300">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
{/* Brand Logo */}
<a aria-label="PlacePro Accueil" className="flex items-center gap-3 group" href="#">
<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-light via-gold to-amber-700 p-0.5 shadow-md shadow-gold/20 flex items-center justify-center">
<div className="w-full h-full bg-night-main rounded-[10px] flex items-center justify-center">
{/* Crown & Shield Crest Icon */}
<svg className="w-5 h-5 text-gold group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
<path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"></path>
</svg>
</div>
</div>
<div className="flex items-baseline">
<span className="text-2xl font-serif font-extrabold tracking-tight text-white">Place</span>
<span className="text-2xl font-serif font-extrabold tracking-tight text-gold">Pro</span>
<span className="ml-1.5 text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-gold/10 text-gold-light border border-gold/20">CI</span>
</div>
</a>
{/* Desktop Navigation Menu */}
<nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slateText">
<a className="hover:text-gold transition-colors" href="#features">Fonctionnalités</a>
<a className="hover:text-gold transition-colors" href="#how-it-works">Comment ça marche</a>
<a className="hover:text-gold transition-colors" href="#temoignages">Avis clients</a><a className="hover:text-gold transition-colors" href="#pricing">Tarifs</a>
<a className="hover:text-gold transition-colors" href="#assistance">Assistance</a>
</nav>
{/* Desktop Action CTA Buttons */}
<div className="hidden md:flex items-center gap-4">
<button type="button" onClick={() => onNavigateToAuth("login")} className="px-4 py-2.5 rounded-xl border border-gold/30 text-xs font-semibold tracking-wide text-cream hover:bg-gold/10 transition-colors cursor-pointer">🔐 Se connecter</button>
<button type="button" onClick={() => onNavigateToAuth("register")} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-light text-night-deep text-xs font-bold uppercase tracking-wider shadow-lg shadow-gold/20 hover:shadow-gold-glow hover:brightness-105 transition-all cursor-pointer">🚀 Essai 7j Gratuit</button>
</div>
{/* Mobile Hamburger Button */}
<button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Ouvrir le menu" className="md:hidden text-cream p-2 focus:outline-none focus:ring-2 focus:ring-gold" id="mobile-menu-toggle" type="button">
<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path d="M4 6h16M4 12h16m-7 6h7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
</svg>
</button>
</div>
{/* Mobile Dropdown Menu */}
<div className={`${isMobileMenuOpen ? "block" : "hidden"} md:hidden bg-night-main/95 border-b border-gold/20 px-6 py-6 transition-all duration-300`} id="mobile-menu">
<div className="flex flex-col gap-4 text-base font-medium">
<a onClick={() => setIsMobileMenuOpen(false)} className="mobile-nav-link text-slateText hover:text-gold py-1" href="#features">Fonctionnalités</a>
<a onClick={() => setIsMobileMenuOpen(false)} className="mobile-nav-link text-slateText hover:text-gold py-1" href="#how-it-works">Comment ça marche</a>
<a onClick={() => setIsMobileMenuOpen(false)} className="mobile-nav-link text-slateText hover:text-gold py-1" href="#pricing">Tarifs</a>
<a onClick={() => setIsMobileMenuOpen(false)} className="mobile-nav-link text-slateText hover:text-gold py-1" href="#assistance">Assistance</a>
<div className="pt-4 border-t border-white/10 flex flex-col gap-3">
<button type="button" onClick={() => { setIsMobileMenuOpen(false); onNavigateToAuth("login"); }} className="text-center py-2.5 rounded-xl border border-gold/30 text-sm font-semibold text-cream cursor-pointer">🔐 Se connecter</button>
<button type="button" onClick={() => { setIsMobileMenuOpen(false); onNavigateToAuth("register"); }} className="text-center py-3 rounded-xl bg-gradient-to-r from-gold to-gold-light text-night-deep text-sm font-bold shadow-md shadow-gold/20 cursor-pointer">🚀 Essai 7j Gratuit</button>
</div>
</div>
</div>
</header>
{/* END: MainHeader */}
<main>
{/* BEGIN: HeroSection */}
<section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden bg-hero-glow">
{/* Ambient Graphic Glow Spots */}
<div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gold/10 rounded-full blur-[140px] pointer-events-none"></div>
<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
{/* Location Pill Badge */}
<div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/40 bg-gold/10 text-gold-light text-xs font-semibold uppercase tracking-wider mb-8 shadow-sm">
<span>🇨🇮 LE 1ER LOGICIEL POUR AGENCES DE PLACEMENT EN CÔTE D'IVOIRE</span>
</div>
{/* Grand Prestige Headline */}
<h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white max-w-4xl font-bold leading-[1.15] tracking-tight">
          Gérez votre personnel de maison et <span className="text-gold-gradient italic font-normal">sécurisez vos commissions</span> en toute sérénité.
        </h1>
{/* Balanced Subtitle */}
<p className="mt-6 text-base sm:text-lg lg:text-xl text-slateText max-w-2xl font-normal leading-relaxed">
          Suivi en direct de vos nounous, servantes et chauffeurs. Encaissements Wave &amp; Orange Money simplifiés. Score de confiance anti-disparition certifié.
        </p>
{/* CTA Buttons Row */}
<div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
<button type="button" onClick={() => onNavigateToAuth("register")} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-gradient-to-r from-gold to-gold-light text-night-deep font-bold text-sm tracking-wide shadow-gold-glow hover:brightness-110 hover:-translate-y-0.5 transition-all cursor-pointer">
<span>🚀 Démarrer mes 7 jours d'essai gratuit</span>
<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path></svg>
</button>
<a className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-4 rounded-xl border border-gold/40 text-cream font-semibold text-sm hover:bg-gold/10 hover:border-gold transition-all" href="#assistance">
            📞 Réserver une démo
          </a>
</div>
{/* Reassurance Badges */}
<div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slateText font-medium">
<span className="flex items-center gap-1.5"><span className="text-gold font-bold">✓</span> Aucun paiement requis</span>
<span className="hidden sm:inline text-white/20">•</span>
<span className="flex items-center gap-1.5"><span className="text-gold font-bold">✓</span> Prêt en 30 secondes</span>
<span className="hidden sm:inline text-white/20">•</span>
<span className="flex items-center gap-1.5"><span className="text-gold font-bold">✓</span> Utilisable sur smartphone</span>
</div>
{/* Realistic Interactive SaaS UI Mockup */}
<div className="mt-14 w-full max-w-5xl relative">
{/* Outer Device Frame */}
<div className="relative rounded-2xl p-2 sm:p-4 bg-gradient-to-b from-gold/30 via-night-card to-night-deep border border-gold/35 shadow-2xl backdrop-blur-xl">
<div className="bg-night-main rounded-xl p-4 sm:p-6 border border-white/10 text-left overflow-hidden">
{/* Mockup Header Bar */}
<div className="flex items-center justify-between pb-4 border-b border-white/10">
<div className="flex items-center gap-2">
<span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
<span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
<span className="w-3 h-3 rounded-full bg-green-500/80 inline-block"></span>
<span className="ml-2 text-xs font-mono text-slateText">tableau-de-bord.placepro.ci</span>
</div>
<div className="flex items-center gap-2 text-xs text-gold">
<span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
<span>Connecté: Agence Ivoire Élite (Cocody)</span>
</div>
</div>
{/* Mockup Dashboard Layout Grid */}
<div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
{/* Card 1: Nounou Profile & Trust Score */}
<div className="bg-night-card p-4 rounded-xl border border-gold/20 flex flex-col justify-between">
<div>
<div className="flex items-center justify-between">
<span className="text-[11px] uppercase tracking-wider font-semibold text-slateText">Fiche Vérifiée</span>
<span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">Actif en poste</span>
</div>
<div className="mt-3 flex items-center gap-3">
<div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gold to-amber-200 p-0.5">
<div className="w-full h-full rounded-full bg-night-main flex items-center justify-center text-lg font-serif text-gold font-bold">AK</div>
</div>
<div>
<h4 className="text-sm font-bold text-white">Aminata K.</h4>
<p className="text-xs text-slateText">Nounou certifiée • 4 ans exp.</p>
</div>
</div>
</div>
<div className="mt-4 pt-3 border-t border-white/5">
<div className="flex justify-between items-center text-xs">
<span className="text-slateText">Score de Confiance</span>
<span className="text-gold font-bold">98%</span>
</div>
<div className="w-full bg-white/10 h-1.5 rounded-full mt-1.5 overflow-hidden">
<div className="bg-gradient-to-r from-gold to-gold-light h-full w-[98%]"></div>
</div>
<p className="mt-2 text-[10px] text-emerald-400 font-medium">✓ Vérifié CNI, CNPS &amp; Garant solvable</p>
</div>
</div>
{/* Card 2: Commissions & Monthly Flow */}
<div className="bg-night-card p-4 rounded-xl border border-gold/20 flex flex-col justify-between">
<div>
<span className="text-[11px] uppercase tracking-wider font-semibold text-slateText">Revenus de l'agence</span>
<h3 className="text-2xl font-serif font-bold text-white mt-2">1 450 000 <span className="text-xs font-sans text-gold">FCFA</span></h3>
<p className="text-xs text-slateText mt-1">Commissions nettes encaissées ce mois</p>
</div>
<div className="mt-4 space-y-2">
<div className="flex items-center justify-between text-xs p-2 rounded-lg bg-night-main/60 border border-white/5">
<span className="text-slateText">Paiements en attente</span>
<span className="font-bold text-amber-300">3 contrats</span>
</div>
<div className="flex items-center justify-between text-xs p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-emerald-300">
<span>Taux de recouvrement</span>
<span className="font-bold">96.8%</span>
</div>
</div>
</div>
{/* Card 3: Mobile Money Live Feeds */}
<div className="bg-night-card p-4 rounded-xl border border-gold/20 flex flex-col justify-between">
<div className="flex items-center justify-between">
<span className="text-[11px] uppercase tracking-wider font-semibold text-slateText">Flux Mobile Money</span>
<span className="text-[10px] text-gold font-mono">EN DIRECT</span>
</div>
<div className="mt-3 space-y-2">
{/* Notification 1 Wave */}
<div className="p-2.5 rounded-lg bg-sky-950/40 border border-sky-400/30 flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="w-6 h-6 rounded-full bg-sky-400/20 text-sky-400 flex items-center justify-center font-bold text-[10px]">🌊</span>
<div>
<p className="text-xs font-semibold text-white">Wave reçu</p>
<p className="text-[10px] text-slateText">Famille Bamba (Riviera 3)</p>
</div>
</div>
<span className="text-xs font-bold text-sky-300">+45 000 F</span>
</div>
{/* Notification 2 Orange Money */}
<div className="p-2.5 rounded-lg bg-orange-950/40 border border-orange-500/30 flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-[10px]">🍊</span>
<div>
<p className="text-xs font-semibold text-white">Orange Money validé</p>
<p className="text-[10px] text-slateText">Famille Touré (Zone 4)</p>
</div>
</div>
<span className="text-xs font-bold text-orange-300">+60 000 F</span>
</div>
</div>
<div className="mt-2 text-right">
<span className="text-[10px] text-slateText">Synchronisation instantanée ⚡</span>
</div>
</div>
</div>
</div>
</div>
</div>
{/* Social Proof Logos Section */}
<div className="mt-16 w-full max-w-4xl">
<p className="text-xs font-semibold uppercase tracking-widest text-slateText mb-6">
            Fait confiance par les meilleures agences d'Abidjan
          </p>
<div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm font-semibold text-slateText/80">
<span className="px-4 py-2 rounded-lg bg-white/5 border border-white/5 hover:border-gold/30 transition-colors">Cocody Ambassades</span>
<span className="px-4 py-2 rounded-lg bg-white/5 border border-white/5 hover:border-gold/30 transition-colors">Marcory Résidentiel</span>
<span className="px-4 py-2 rounded-lg bg-white/5 border border-white/5 hover:border-gold/30 transition-colors">Riviera Golf &amp; Beverly</span>
<span className="px-4 py-2 rounded-lg bg-white/5 border border-white/5 hover:border-gold/30 transition-colors">Zone 4 &amp; Biétry</span>
</div>
</div>
</div>
</section>
{/* END: HeroSection */}
{/* BEGIN: KeyFeaturesSection */}
<section className="py-20 bg-night-deep border-t border-gold/15 relative" id="features">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="text-center max-w-3xl mx-auto">
<span className="text-xs uppercase font-bold tracking-widest text-gold">Pensé pour le terrain ivoirien</span>
<h2 className="mt-3 font-serif text-3xl sm:text-4xl text-white font-bold">
            Les 4 grands atouts pour les agences d'Abidjan
          </h2>
<p className="mt-4 text-slateText text-base">
            Une suite d'outils digitaux forgée pour éliminer les litiges, professionnaliser vos équipes et garantir la rentabilité de votre cabinet.
          </p>
</div>
<div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
{/* Atout 1 */}
<div className="p-8 rounded-2xl bg-night-card border border-gold/25 hover:border-gold/60 transition-all duration-300 group hover:-translate-y-1">
<div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
              📋
            </div>
<h3 className="font-serif text-xl font-bold text-white group-hover:text-gold-light transition-colors">
              Fini la paperasse et les registres perdus
            </h3>
<p className="mt-3 text-sm text-slateText leading-relaxed">
              Centralisation complète des pièces d'identité, photos, contacts des garants et contrats en un seul endroit sécurisé. Retrouvez n'importe quel dossier en 3 secondes depuis votre téléphone.
            </p>
<ul className="mt-5 space-y-2 text-xs text-cream/90">
<li className="flex items-center gap-2"><span className="text-gold">✓</span> Archivage numérique des CNI &amp; passeports</li>
<li className="flex items-center gap-2"><span className="text-gold">✓</span> Fiches médicales et attestations téléchargeables</li>
</ul>
</div>
{/* Atout 2 */}
<div className="p-8 rounded-2xl bg-night-card border border-gold/25 hover:border-gold/60 transition-all duration-300 group hover:-translate-y-1">
<div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
              💰
            </div>
<h3 className="font-serif text-xl font-bold text-white group-hover:text-gold-light transition-colors">
              Zéro commission oubliée
            </h3>
<p className="mt-3 text-sm text-slateText leading-relaxed">
              Calendrier des échéances d'employeurs avec alertes automatiques et réconciliation des paiements Wave, Orange Money et MTN. Ne laissez plus un client en retard sans relance courtoise.
            </p>
<ul className="mt-5 space-y-2 text-xs text-cream/90">
<li className="flex items-center gap-2"><span className="text-gold">✓</span> Relances automatiques par SMS &amp; WhatsApp</li>
<li className="flex items-center gap-2"><span className="text-gold">✓</span> Reçus certifiés générés instantanément en PDF</li>
</ul>
</div>
{/* Atout 3 */}
<div className="p-8 rounded-2xl bg-night-card border border-gold/25 hover:border-gold/60 transition-all duration-300 group hover:-translate-y-1">
<div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
              🛡️
            </div>
<h3 className="font-serif text-xl font-bold text-white group-hover:text-gold-light transition-colors">
              Score de confiance &amp; Signalement disparition
            </h3>
<p className="mt-3 text-sm text-slateText leading-relaxed">
              Protection maximale de la réputation de votre agence contre les abandons de poste imprévus. Historique vérifié des placements antérieurs et blacklistage sécurisé des profils indélicats.
            </p>
<ul className="mt-5 space-y-2 text-xs text-cream/90">
<li className="flex items-center gap-2"><span className="text-gold">✓</span> Alerte immédiate entre agences partenaires</li>
<li className="flex items-center gap-2"><span className="text-gold">✓</span> Validation obligatoire d'un garant vérifié</li>
</ul>
</div>
{/* Atout 4 */}
<div className="p-8 rounded-2xl bg-night-card border border-gold/25 hover:border-gold/60 transition-all duration-300 group hover:-translate-y-1">
<div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
              📱
            </div>
<h3 className="font-serif text-xl font-bold text-white group-hover:text-gold-light transition-colors">
              Portails WhatsApp en 1 clic
            </h3>
<p className="mt-3 text-sm text-slateText leading-relaxed">
              Envoi direct d'un lien d'accès sécurisé à l'espace employé et à l'espace famille sans aucun mot de passe à retenir. Tout le monde communique dans un cadre clair et professionnel.
            </p>
<ul className="mt-5 space-y-2 text-xs text-cream/90">
<li className="flex items-center gap-2"><span className="text-gold">✓</span> Transmission de contrat via WhatsApp</li>
<li className="flex items-center gap-2"><span className="text-gold">✓</span> Zéro application lourde à télécharger</li>
</ul>
</div>
</div>
</div>
</section>
{/* END: KeyFeaturesSection */}
{/* BEGIN: HowItWorksSection */}
<section className="py-20 bg-night-main border-t border-gold/15 relative overflow-hidden" id="how-it-works">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="text-center max-w-3xl mx-auto">
<span className="text-xs uppercase font-bold tracking-widest text-gold">Démarrage Express</span>
<h2 className="mt-3 font-serif text-3xl sm:text-4xl text-white font-bold">
            Comment ça marche
          </h2>
<p className="mt-4 text-slateText text-base">
            Passez au numérique en trois étapes limpides, sans formation complexe requise.
          </p>
</div>
<div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 relative">
{/* Step 1 */}
<div className="relative bg-night-card/70 border border-gold/20 p-8 rounded-2xl text-center group hover:border-gold/50 transition-all">
<div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-gold to-gold-light text-night-deep font-bold font-serif text-xl flex items-center justify-center shadow-lg shadow-gold/20 mb-6">
              1
            </div>
<h3 className="text-lg font-bold text-white font-serif mb-3">Créez votre agence en 30 secondes</h3>
<p className="text-xs sm:text-sm text-slateText leading-relaxed">
              Configuration instantanée de votre profil agence sans aucune compétence technique. Indiquez simplement vos coordonnées et vos quartiers d'activité.
            </p>
</div>
{/* Step 2 */}
<div className="relative bg-night-card/70 border border-gold/20 p-8 rounded-2xl text-center group hover:border-gold/50 transition-all">
<div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-gold to-gold-light text-night-deep font-bold font-serif text-xl flex items-center justify-center shadow-lg shadow-gold/20 mb-6">
              2
            </div>
<h3 className="text-lg font-bold text-white font-serif mb-3">Ajoutez votre personnel et vos familles</h3>
<p className="text-xs sm:text-sm text-slateText leading-relaxed">
              Import rapide de fiches, pièces d'identité et garants. Associez chaque nounou ou chauffeur à un employeur en quelques pressions sur votre écran.
            </p>
</div>
{/* Step 3 */}
<div className="relative bg-night-card/70 border border-gold/20 p-8 rounded-2xl text-center group hover:border-gold/50 transition-all">
<div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-gold to-gold-light text-night-deep font-bold font-serif text-xl flex items-center justify-center shadow-lg shadow-gold/20 mb-6">
              3
            </div>
<h3 className="text-lg font-bold text-white font-serif mb-3">Suivez vos placements et encaissez vos commissions</h3>
<p className="text-xs sm:text-sm text-slateText leading-relaxed">
              Recevez les notifications de paiement Wave, Orange &amp; MTN automatiques. Gardez le contrôle total sur votre trésorerie et la satisfaction des foyers.
            </p>
</div>
</div>
</div>
</section>
{/* END: HowItWorksSection */}
{/* BEGIN: PricingSection */}
<section className="py-24 bg-night-main border-t border-gold/15 relative overflow-hidden" id="temoignages">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
<div className="text-center max-w-3xl mx-auto">
<span className="text-xs uppercase font-bold tracking-widest text-gold">Retour d'expérience</span>
<h2 className="mt-3 font-serif text-3xl sm:text-4xl text-white font-bold">
Ce que disent les directrices et directeurs d'agence
</h2>
<p className="mt-4 text-slateText text-base">
Découvrez comment les plus grandes agences de placement de Côte d'Ivoire sécurisent leurs opérations au quotidien.
</p>
</div>

<div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
<div className="bg-night-card/70 border border-gold/20 rounded-2xl p-5 text-center">
<span className="block font-serif text-3xl font-extrabold text-gold">+45</span>
<span className="text-xs text-slateText mt-1 block font-medium">Agences partenaires à Abidjan</span>
</div>
<div className="bg-night-card/70 border border-gold/20 rounded-2xl p-5 text-center">
<span className="block font-serif text-3xl font-extrabold text-gold">98.4%</span>
<span className="text-xs text-slateText mt-1 block font-medium">Taux de satisfaction global</span>
</div>
<div className="bg-night-card/70 border border-gold/20 rounded-2xl p-5 text-center">
<span className="block font-serif text-3xl font-extrabold text-gold">0 FCFA</span>
<span className="text-xs text-slateText mt-1 block font-medium">Perte de commission déclarée</span>
</div>
</div>

<div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
<div className="bg-night-card rounded-2xl p-8 border border-gold/25 hover:border-gold/60 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 shadow-lg">
<div>
<div className="flex items-center justify-between">
<div className="flex items-center gap-1 text-gold text-sm tracking-wider">
<span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
</div>
<span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-gold/10 text-gold-light border border-gold/20">Cocody</span>
</div>
<p className="mt-5 text-sm text-cream/90 leading-relaxed italic">
« Depuis qu'on utilise PlacePro, fini les nounous qui disparaissent sans prévenir. Le score de confiance et le contrat WhatsApp ont restauré la confiance totale de nos clients huppés. »
</p>
</div>
<div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-3.5">
<div className="w-11 h-11 rounded-full bg-gradient-to-tr from-gold to-amber-200 p-0.5 shrink-0">
<div className="w-full h-full rounded-full bg-night-main flex items-center justify-center font-serif text-gold font-bold text-sm">
EK
</div>
</div>
<div>
<h4 className="text-sm font-bold text-white">Mme Estelle Kouassi</h4>
<p className="text-xs text-slateText">Directrice, Agence Nounou d'Or</p>
</div>
</div>
</div>

<div className="bg-night-card rounded-2xl p-8 border border-gold/25 hover:border-gold/60 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 shadow-lg">
<div>
<div className="flex items-center justify-between">
<div className="flex items-center gap-1 text-gold text-sm tracking-wider">
<span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
</div>
<span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-gold/10 text-gold-light border border-gold/20">Marcory</span>
</div>
<p className="mt-5 text-sm text-cream/90 leading-relaxed italic">
« Les encaissements de commissions par Wave et Orange Money automatisés nous font gagner plus de 400 000 FCFA de commissions impayées chaque mois. Un outil indispensable. »
</p>
</div>
<div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-3.5">
<div className="w-11 h-11 rounded-full bg-gradient-to-tr from-gold to-amber-200 p-0.5 shrink-0">
<div className="w-full h-full rounded-full bg-night-main flex items-center justify-center font-serif text-gold font-bold text-sm">
IT
</div>
</div>
<div>
<h4 className="text-sm font-bold text-white">M. Ibrahim Traoré</h4>
<p className="text-xs text-slateText">Fondateur, Prestige Domestique</p>
</div>
</div>
</div>

<div className="bg-night-card rounded-2xl p-8 border border-gold/25 hover:border-gold/60 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 shadow-lg">
<div>
<div className="flex items-center justify-between">
<div className="flex items-center gap-1 text-gold text-sm tracking-wider">
<span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
</div>
<span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-gold/10 text-gold-light border border-gold/20">Riviera 3</span>
</div>
<p className="mt-5 text-sm text-cream/90 leading-relaxed italic">
« La centralisation des pièces CNI et des garants rassure énormément les employeurs. En 30 secondes, tout est envoyé proprement sur WhatsApp. »
</p>
</div>
<div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-3.5">
<div className="w-11 h-11 rounded-full bg-gradient-to-tr from-gold to-amber-200 p-0.5 shrink-0">
<div className="w-full h-full rounded-full bg-night-main flex items-center justify-center font-serif text-gold font-bold text-sm">
CB
</div>
</div>
<div>
<h4 className="text-sm font-bold text-white">Mme Chantal Bamba</h4>
<p className="text-xs text-slateText">Gérante, Sérénité Maison</p>
</div>
</div>
</div>
</div>
</div>
</section><section className="py-24 bg-night-deep border-t border-gold/15 relative" id="pricing">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="text-center max-w-3xl mx-auto">
{/* Festive Gift Ribbon */}
<div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gold/15 border border-gold/40 text-gold-light text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
<span>🎁 7 jours offerts sur toutes les formules</span>
</div>
<h2 className="font-serif text-3xl sm:text-4xl text-white font-bold">
            Tarifs transparents en FCFA
          </h2>
<p className="mt-4 text-slateText text-base">
            Aucun frais caché. Choisissez la formule qui correspond au volume actuel de votre cabinet de placement.
          </p>
</div>
<div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
{/* Plan Starter */}
<div className="rounded-2xl bg-night-card p-8 border border-white/10 flex flex-col justify-between hover:border-gold/30 transition-all">
<div>
<h3 className="text-xl font-serif font-bold text-white">Starter</h3>
<p className="text-xs text-slateText mt-1">Pour démarrer et structurer ses premiers placements</p>
<div className="mt-6 flex items-baseline">
<span className="text-3xl sm:text-4xl font-serif font-extrabold text-white">19 000 F</span>
<span className="text-xs text-slateText ml-2 font-medium">/ mois</span>
</div>
<ul className="mt-8 space-y-3.5 text-xs text-cream/90">
<li className="flex items-center gap-2.5"><span className="text-gold">✓</span> Gestion du personnel (pièces d'identité, photos, garants)</li>
<li className="flex items-center gap-2.5"><span className="text-gold">✓</span> Suivi des placements</li>
<li className="flex items-center gap-2.5"><span className="text-gold">✓</span> Calendrier des commissions</li>
<li className="flex items-center gap-2.5"><span className="text-gold">✓</span> Assistance WhatsApp</li>
</ul>
</div>
<div className="mt-8">
<button type="button" onClick={() => onNavigateToAuth("register")} className="w-full block text-center py-3 rounded-xl border border-gold/40 text-cream font-semibold text-xs hover:bg-gold/10 transition-colors cursor-pointer">Commencer l'essai gratuit</button>
</div>
</div>
{/* Plan Pro (Featured) */}
<div className="rounded-2xl bg-night-card p-8 border-2 border-gold shadow-gold-soft relative flex flex-col justify-between lg:-translate-y-3">
<div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gold to-gold-light text-night-deep text-[11px] font-bold uppercase tracking-wider px-4 py-1 rounded-full shadow-md">
              Recommandé
            </div>
<div>
<h3 className="text-xl font-serif font-bold text-white">Pro</h3>
<p className="text-xs text-slateText mt-1">La référence absolue des agences d'élite à Abidjan</p>
<div className="mt-6 flex items-baseline">
<span className="text-3xl sm:text-4xl font-serif font-extrabold text-gold-light">39 000 F</span>
<span className="text-xs text-slateText ml-2 font-medium">/ mois</span>
</div>
<ul className="mt-8 space-y-3.5 text-xs text-cream">
<li className="flex items-center gap-2.5 font-medium"><span className="text-gold">✓</span> Tout ce qui est inclus dans Starter</li>
<li className="flex items-center gap-2.5"><span className="text-gold">✓</span> Encaissements Wave, Orange Money et MTN</li>
<li className="flex items-center gap-2.5"><span className="text-gold">✓</span> Score de confiance &amp; signalement disparition</li>
<li className="flex items-center gap-2.5"><span className="text-gold">✓</span> Portails WhatsApp employé et famille en 1 clic</li>
<li className="flex items-center gap-2.5 text-gold-light font-semibold"><span className="text-gold">✓</span> Assistance prioritaire avec le fondateur</li>
</ul>
</div>
<div className="mt-8">
<button type="button" onClick={() => onNavigateToAuth("register")} className="w-full block text-center py-3.5 rounded-xl bg-gradient-to-r from-gold to-gold-light text-night-deep font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-105 transition-all cursor-pointer">Commencer l'essai gratuit</button>
</div>
</div>
{/* Plan Annuel */}
<div className="rounded-2xl bg-night-card p-8 border border-white/10 flex flex-col justify-between hover:border-gold/30 transition-all">
<div>
<div className="flex items-center justify-between">
<h3 className="text-xl font-serif font-bold text-white">Pack Annuel</h3>
<span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">Économisez 69 000 F</span>
</div>
<p className="text-xs text-slateText mt-1">Tranquillité d'esprit maximale pendant 1 an</p>
<div className="mt-6 flex items-baseline">
<span className="text-3xl sm:text-4xl font-serif font-extrabold text-white">399 000 F</span>
<span className="text-xs text-slateText ml-2 font-medium">/ an</span>
</div>
<ul className="mt-8 space-y-3.5 text-xs text-cream/90">
<li className="flex items-center gap-2.5"><span className="text-gold">✓</span> Toutes les fonctionnalités Pro pendant 12 mois</li>
<li className="flex items-center gap-2.5"><span className="text-gold">✓</span> Un seul paiement, aucun souci de renouvellement mensuel</li>
<li className="flex items-center gap-2.5"><span className="text-gold">✓</span> Accompagnement personnalisé à la mise en place</li>
</ul>
</div>
<div className="mt-8">
<button type="button" onClick={() => onNavigateToAuth("register")} className="w-full block text-center py-3 rounded-xl border border-gold/40 text-cream font-semibold text-xs hover:bg-gold/10 transition-colors cursor-pointer">Commencer l'essai gratuit</button>
</div>
</div>
</div>
{/* Payment Partners Visual Mention */}
<div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-slateText">
<span className="font-medium text-cream">Règlements d'abonnements par Wave et MTN MoMo</span>
<div className="flex items-center gap-2">
{/* Wave Badge */}
<span className="px-2.5 py-1 rounded bg-sky-500/10 border border-sky-400/30 text-sky-300 font-bold text-[11px] flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-sky-400"></span> Wave
            </span>
{/* MTN Badge */}
<span className="px-2.5 py-1 rounded bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 font-bold text-[11px] flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-yellow-400"></span> MTN MoMo
            </span>
{/* Orange Money Badge (Bientôt disponible) */}
<span className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700/60 text-slate-400 font-semibold text-[11px] flex items-center gap-1 opacity-60" title="Orange Money temporairement indisponible pour ce numéro">
<span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span> Orange Money (Bientôt)
            </span>
</div>
</div>
</div>
</section>
{/* END: PricingSection */}
{/* BEGIN: FounderAssistanceSection */}
<section className="py-20 bg-night-main border-t border-gold/15 relative" id="assistance">
<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="rounded-3xl bg-gradient-to-b from-night-card to-night-deep border border-gold/30 p-8 sm:p-12 shadow-2xl relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center gap-8">
{/* Cyrille Avatar Photo / Initials Frame */}
<div className="relative shrink-0">
<div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-gold via-amber-300 to-amber-700 p-1 shadow-xl shadow-gold/20">
<div className="w-full h-full rounded-full bg-[#07152A] flex flex-col items-center justify-center text-center p-2">
<span className="font-serif text-3xl font-extrabold text-gold">CK</span>
<span className="text-[10px] text-slateText uppercase tracking-wider mt-1">Fondateur</span>
</div>
</div>
{/* Live Indicator Badge */}
<div className="absolute bottom-1 right-1 px-2 py-0.5 rounded-full bg-night-deep border border-emerald-500/40 text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
<span>En ligne à Abidjan 🇨🇮</span>
</div>
</div>
{/* Content and Direct Contact Action */}
<div className="flex-1">
<span className="text-xs uppercase font-bold tracking-widest text-gold">Assistance directe avec le fondateur</span>
<h3 className="mt-2 font-serif text-2xl sm:text-3xl text-white font-bold">
              Une question ? Parlez directement à Cyrille, fondateur de PlacePro.
            </h3>
<p className="mt-3 text-sm text-slateText leading-relaxed">
              Nous connaissons intimement les spécificités de la gestion des employés de maison en Côte d'Ivoire. Obtenez une démonstration personnalisée ou une réponse en moins de 15 minutes.
            </p>
<div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
{/* Official WhatsApp Direct Action Button */}
<a className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-whatsapp hover:bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-whatsapp/20 transition-all hover:scale-102" href="https://wa.me/2250502629821?text=Bonjour%20Cyrille,%20je%20souhaite%20en%20savoir%20plus%20sur%20le%20logiciel%20PlacePro." rel="noopener noreferrer" target="_blank">
{/* WhatsApp SVG Icon */}
<svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
<path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"></path>
</svg>
<span>💬 Écrire sur WhatsApp : +225 05 02 62 98 21</span>
</a>
</div>
</div>
</div>
</div>
</section>
{/* END: FounderAssistanceSection */}
</main>
{/* BEGIN: MainFooter */}
<footer className="bg-night-deep border-t border-gold/15 py-12 text-slateText text-sm">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="flex flex-col md:flex-row items-center justify-between gap-6">
{/* Footer Brand */}
<div className="flex items-center gap-2">
<span className="text-xl font-serif font-extrabold text-white">Place</span>
<span className="text-xl font-serif font-extrabold text-gold">Pro</span>
<span className="text-xs text-slateText ml-2">Plateforme de gestion pour agences de maison</span>
</div>
{/* Links Navigation */}
<div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium">
<a className="hover:text-gold transition-colors" href="#features">Fonctionnalités</a>
<a className="hover:text-gold transition-colors" href="#how-it-works">Comment ça marche</a>
<a className="hover:text-gold transition-colors" href="#pricing">Tarifs</a>
<a className="hover:text-gold transition-colors" href="#assistance">Assistance</a>
<a className="text-whatsapp hover:underline" href="https://wa.me/2250502629821" rel="noopener noreferrer" target="_blank">Support WhatsApp Direct</a>
</div>
{/* Copyright */}
<div className="text-xs text-center md:text-right">
<p>© 2026 PlacePro – Abidjan, Côte d'Ivoire</p>
</div>
</div>
</div>
</footer>
{/* END: MainFooter */}
{/* BEGIN: FloatingWhatsAppWidget */}
<div className="fixed bottom-6 right-6 z-50 group flex items-center gap-3">
{/* Tooltip */}
<span className="hidden sm:inline-block px-3 py-1.5 rounded-lg bg-night-card border border-gold/30 text-xs font-semibold text-cream shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      Discuter avec l'équipe
    </span>
{/* Floating Circle Button */}
<a aria-label="Discuter sur WhatsApp" className="w-14 h-14 rounded-full bg-whatsapp hover:bg-emerald-600 text-white flex items-center justify-center shadow-2xl shadow-whatsapp/50 hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-whatsapp/30" href="https://wa.me/2250502629821?text=Bonjour,%20je%20souhaite%20une%20d%C3%A9mo%20de%20PlacePro." rel="noopener noreferrer" target="_blank">
<svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
<path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"></path>
</svg>
</a>
</div>
{/* END: FloatingWhatsAppWidget */}
{/* BEGIN: MobileMenuScript */}

    </div>
  );
}
