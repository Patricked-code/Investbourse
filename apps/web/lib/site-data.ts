export const siteConfig = {
  name: "Investbourse",
  legalName: "Investbourse Advisory",
  domain: "https://investbourse.com",
  tagline: "Conseil en investissements boursiers pour investisseurs institutionnels UEMOA",
  email: "contact@investbourse.com",
  phone: "+225 00 00 00 00 00",
  address: "Abidjan, Côte d’Ivoire — UEMOA",
  areaServed: "UEMOA",
};

export type SitePage = {
  slug: string;
  nav: string;
  schemaType: "FinancialService" | "Service" | "ContactPage" | "WebPage";
  title: string;
  metaTitle: string;
  description: string;
  h1: string;
  h2: string;
  h3: string;
  h4: string;
  h5: string;
  keywords: string[];
};

export const sitePages: Record<string, SitePage> = {
  "/": {
    slug: "/",
    nav: "Accueil",
    schemaType: "FinancialService",
    title: "Conseil en investissements boursiers institutionnels UEMOA",
    metaTitle: "Investbourse | Conseil en investissements boursiers institutionnels UEMOA",
    description: "Cabinet de conseil en investissements boursiers pour investisseurs institutionnels UEMOA : analyse de marchés, sélection de fonds OPCVM, appels d’offres, due diligence et suivi de portefeuille.",
    h1: "Conseil en investissements boursiers pour investisseurs institutionnels UEMOA",
    h2: "Analyse, sélection, appels d’offres et suivi des décisions d’investissement",
    h3: "Une approche construite pour les comités d’investissement",
    h4: "Traçabilité, gouvernance et transparence des recommandations",
    h5: "Cabinet sans réception de fonds ni conservation de titres",
    keywords: ["conseil investissement UEMOA", "OPCVM UEMOA", "investisseurs institutionnels", "appels d’offres société de gestion", "AMF UMOA"],
  },
  "/conseil-investissement-institutionnel": {
    slug: "/conseil-investissement-institutionnel",
    nav: "Conseil",
    schemaType: "Service",
    title: "Conseil en investissement institutionnel",
    metaTitle: "Conseil en investissement institutionnel UEMOA | Investbourse",
    description: "Accompagnement des caisses de retraite, assurances, banques, fondations et trésoreries d’entreprise dans leurs décisions d’investissement et leur politique de placement.",
    h1: "Conseil en investissement institutionnel dans l’UEMOA",
    h2: "Formaliser une politique de placement claire et défendable",
    h3: "Analyse du profil, contraintes, horizon, liquidité et tolérance au risque",
    h4: "Recommandations documentées pour comité d’investissement",
    h5: "Intervention encadrée par les habilitations réglementaires applicables",
    keywords: ["politique de placement", "conseil institutionnel", "allocation UEMOA", "comité d’investissement"],
  },
  "/analyse-marches-uemoa": {
    slug: "/analyse-marches-uemoa",
    nav: "Analyse marchés",
    schemaType: "Service",
    title: "Analyse récurrente des marchés UEMOA",
    metaTitle: "Analyse marchés UEMOA | Notes institutionnelles taux, BRVM et OPCVM",
    description: "Notes de marché récurrentes sur les taux, émissions souveraines, liquidité, OPCVM, BRVM et conditions financières de la zone UEMOA.",
    h1: "Analyse récurrente des marchés financiers UEMOA",
    h2: "Comprendre les taux, la liquidité, les OPCVM et les actions BRVM",
    h3: "Notes mensuelles, trimestrielles et alertes de marché",
    h4: "Indicateurs, risques, scénarios et implications d’allocation",
    h5: "Livrables adaptés aux comités d’investissement institutionnels",
    keywords: ["analyse marchés UEMOA", "BRVM", "UMOA Titres", "OPCVM", "note de marché"],
  },
  "/selection-fonds-opcvm": {
    slug: "/selection-fonds-opcvm",
    nav: "Sélection fonds",
    schemaType: "Service",
    title: "Sélection de fonds OPCVM et sociétés de gestion",
    metaTitle: "Sélection fonds OPCVM UEMOA | Investbourse",
    description: "Analyse qualitative et quantitative des OPCVM, comparaison des sociétés de gestion, sélection de fonds, scoring, risques, frais et reporting.",
    h1: "Sélection de fonds OPCVM et sociétés de gestion",
    h2: "Comparer les fonds au-delà de la performance brute",
    h3: "Performance, volatilité, drawdown, frais, liquidité et régularité",
    h4: "Analyse qualitative des équipes, processus et reporting",
    h5: "Scoring transparent et justification des choix",
    keywords: ["sélection OPCVM", "fonds UEMOA", "société de gestion", "due diligence fonds", "scoring OPCVM"],
  },
  "/appels-offres-institutionnels": {
    slug: "/appels-offres-institutionnels",
    nav: "Appels d’offres",
    schemaType: "Service",
    title: "Appels d’offres pour investisseurs institutionnels",
    metaTitle: "Appels d’offres sociétés de gestion | Investbourse",
    description: "Structuration d’appels d’offres pour sélectionner une société de gestion, un mandat, un fonds, une SGI ou un partenaire d’investissement.",
    h1: "Appels d’offres institutionnels pour sélectionner les meilleurs partenaires de gestion",
    h2: "Cahier des charges, short-list, scoring et analyse des réponses",
    h3: "Un processus transparent pour les directions financières et comités",
    h4: "Auditions, grille de notation et rapport de recommandation",
    h5: "Traçabilité complète de la sélection",
    keywords: ["appel d’offres société de gestion", "sélection gestionnaire", "cahier des charges investissement", "UEMOA"],
  },
  "/due-diligence-societes-gestion": {
    slug: "/due-diligence-societes-gestion",
    nav: "Due diligence",
    schemaType: "Service",
    title: "Due diligence sociétés de gestion",
    metaTitle: "Due diligence société de gestion UEMOA | Investbourse",
    description: "Revue de sociétés de gestion : organisation, processus d’investissement, risques opérationnels, frais, conformité, reporting et robustesse de gestion.",
    h1: "Due diligence des sociétés de gestion et partenaires financiers",
    h2: "Évaluer la solidité d’un partenaire avant d’investir",
    h3: "Organisation, équipe, processus, performance et contrôle des risques",
    h4: "Revue des frais, reporting, gouvernance et transparence",
    h5: "Rapport de synthèse pour décision institutionnelle",
    keywords: ["due diligence société de gestion", "risque opérationnel", "sélection gérant", "analyse partenaire financier"],
  },
  "/gouvernance-conformite": {
    slug: "/gouvernance-conformite",
    nav: "Gouvernance",
    schemaType: "Service",
    title: "Gouvernance et conformité des décisions d’investissement",
    metaTitle: "Gouvernance investissement UEMOA | Investbourse",
    description: "Aide à la formalisation de politiques de placement, processus de décision, documentation de comité, gestion des conflits d’intérêts et suivi des recommandations.",
    h1: "Gouvernance, conformité et traçabilité des décisions d’investissement",
    h2: "Sécuriser la décision, pas seulement sélectionner un fonds",
    h3: "Politique de placement, comité, limites, risques et documentation",
    h4: "Gestion des conflits d’intérêts et transparence des rémunérations",
    h5: "Cadre professionnel compatible avec les exigences institutionnelles",
    keywords: ["gouvernance investissement", "conflits d’intérêts", "politique de placement", "conformité AMF UMOA"],
  },
  "/contact": {
    slug: "/contact",
    nav: "Contact",
    schemaType: "ContactPage",
    title: "Contact et demande de diagnostic institutionnel",
    metaTitle: "Contact | Demander un diagnostic investissement institutionnel UEMOA",
    description: "Contactez Investbourse pour une mission de conseil, une analyse récurrente, une sélection de fonds, une due diligence ou un appel d’offres institutionnel.",
    h1: "Demander un diagnostic institutionnel",
    h2: "Présenter un besoin d’investissement, de sélection ou d’appel d’offres",
    h3: "Réception sécurisée des messages dans le cockpit administrateur",
    h4: "Qualification de la demande et réponse professionnelle",
    h5: "Confidentialité et traitement des informations institutionnelles",
    keywords: ["contact conseil investissement", "diagnostic institutionnel", "appel d’offres OPCVM", "UEMOA"],
  },
};

export const publicPages = Object.values(sitePages);

export const services = [
  { icon: "line", title: "Analyse récurrente des marchés", slug: "/analyse-marches-uemoa", text: "Notes périodiques sur marchés monétaires, obligataires, actions, OPCVM et conditions de liquidité dans l’UEMOA." },
  { icon: "pie", title: "Sélection de fonds et sociétés de gestion", slug: "/selection-fonds-opcvm", text: "Analyse qualitative et quantitative des OPCVM, mandats, sociétés de gestion, profils de risque, performances et cohérence d’allocation." },
  { icon: "clipboard", title: "Appels d’offres institutionnels", slug: "/appels-offres-institutionnels", text: "Cahiers des charges, short-listing, grilles de notation, analyse des réponses et accompagnement des comités de sélection." },
  { icon: "shield", title: "Gouvernance et conformité", slug: "/gouvernance-conformite", text: "Formalisation des processus d’investissement, politiques de placement, documentation de décision et suivi des risques." },
  { icon: "search", title: "Due diligence financière", slug: "/due-diligence-societes-gestion", text: "Revue des sociétés de gestion, processus d’investissement, risques opérationnels, frais, reporting et robustesse organisationnelle." },
  { icon: "users", title: "Mise en relation encadrée", slug: "/conseil-investissement-institutionnel", text: "Organisation de rencontres qualifiées entre investisseurs institutionnels et acteurs agréés, dans un cadre clair et transparent." },
];

export const clientTypes = ["Caisses de retraite", "Compagnies d’assurance", "Mutuelles et institutions de prévoyance", "Trésoreries d’entreprise", "Fondations et fonds de dotation", "Banques et institutions financières", "Organismes publics et parapublics", "Family offices institutionnels"];

export const processSteps = [
  { step: "01", title: "Diagnostic institutionnel", text: "Compréhension des contraintes : horizon, liquidité, gouvernance, politique de placement, tolérance au risque, contraintes réglementaires et objectifs de rendement." },
  { step: "02", title: "Cartographie des solutions", text: "Identification des classes d’actifs, véhicules, OPCVM, mandats de gestion, sociétés de gestion et solutions compatibles avec le profil institutionnel." },
  { step: "03", title: "Analyse et notation", text: "Évaluation multicritère : performance, risque, volatilité, drawdown, frais, liquidité, qualité de gestion, stabilité des équipes et transparence du reporting." },
  { step: "04", title: "Appel d’offres ou sélection directe", text: "Préparation du dossier, consultation d’acteurs agréés, collecte des réponses, grille de scoring, auditions et synthèse de recommandation." },
  { step: "05", title: "Décision et documentation", text: "Rédaction de notes de comité, justification des choix, formalisation des risques, traçabilité des recommandations et conservation des éléments de décision." },
  { step: "06", title: "Suivi récurrent", text: "Reporting périodique, alertes, suivi des performances, analyse des écarts, veille marché et revue annuelle ou trimestrielle de l’allocation." },
];

export const offers = [
  { name: "Veille Institutionnelle", tag: "Récurrent", price: "Sur devis", description: "Pour recevoir une lecture régulière des marchés et opportunités d’investissement.", features: ["Note mensuelle ou trimestrielle", "Suivi marchés UEMOA", "Analyse taux, liquidité, OPCVM et BRVM", "Tableau de bord synthétique", "Appel de revue périodique"] },
  { name: "Sélection & Conseil", tag: "Mandat de conseil", price: "Sur devis", description: "Pour accompagner une décision d’investissement, une allocation ou la sélection d’un fonds.", features: ["Diagnostic du besoin", "Analyse comparative des solutions", "Scoring qualitatif et quantitatif", "Note de recommandation", "Documentation des risques et conflits d’intérêts"] },
  { name: "Appel d’Offres Investissement", tag: "Mission structurée", price: "Sur devis", description: "Pour organiser une consultation robuste de sociétés de gestion, SGI, SGO ou acteurs agréés.", features: ["Cahier des charges", "Short-list d’acteurs agréés", "Grille de notation", "Analyse des réponses", "Support au comité de sélection"] },
];
