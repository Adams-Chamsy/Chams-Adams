export type FAQCategory =
  | 'livraison'
  | 'sur-mesure'
  | 'entretien'
  | 'paiement'
  | 'retours'
  | 'atelier';

export interface FAQItem {
  id: string;
  category: FAQCategory;
  question: string;
  answer: string;
}

export const FAQ_CATEGORY_LABELS: Record<FAQCategory, string> = {
  livraison: 'Livraison',
  'sur-mesure': 'Sur-mesure',
  entretien: 'Entretien',
  paiement: 'Paiement',
  retours: 'Retours & échanges',
  atelier: "L'atelier",
};

export const FAQ: FAQItem[] = [
  // LIVRAISON
  {
    id: 'f-liv-1',
    category: 'livraison',
    question: 'Quels sont vos délais de livraison ?',
    answer:
      "Les pièces en stock sont expédiées sous 48 heures ouvrées. France : 2 à 3 jours. Europe : 3 à 5 jours. Afrique de l'Ouest : 4 à 7 jours. Reste du monde : 5 à 10 jours. Les pièces sur-mesure suivent un calendrier dédié, communiqué dès la confirmation.",
  },
  {
    id: 'f-liv-2',
    category: 'livraison',
    question: 'Livrez-vous à l\u2019international ?',
    answer:
      "Oui, partout dans le monde. Les frais de douane et taxes d'importation restent à la charge du destinataire pour les livraisons hors Union européenne.",
  },
  {
    id: 'f-liv-3',
    category: 'livraison',
    question: 'Puis-je retirer ma commande en main propre ?',
    answer:
      'Oui, sur rendez-vous à Paris ou à Dakar. Contactez-nous après votre commande pour convenir d\u2019un créneau.',
  },

  // SUR-MESURE
  {
    id: 'f-sm-1',
    category: 'sur-mesure',
    question: 'Combien de temps pour une pièce sur-mesure ?',
    answer:
      "Comptez trois à six semaines selon la complexité de la pièce. Pour les commandes pressées, un délai express peut être négocié — contactez-nous.",
  },
  {
    id: 'f-sm-2',
    category: 'sur-mesure',
    question: 'Comment se passe la prise de mesures ?',
    answer:
      "Sur rendez-vous dans notre atelier ou en visioconférence guidée, nous prenons vingt-huit points de mesure. Aucune grille : chaque pièce est conçue pour votre corps, vos gestes, vos souvenirs.",
  },
  {
    id: 'f-sm-3',
    category: 'sur-mesure',
    question: 'Puis-je demander des modifications après commande ?',
    answer:
      "Jusqu'à la coupe du tissu, oui. Après, chaque changement est techniquement possible mais peut allonger les délais ou modifier le devis. Nous en discutons au cas par cas.",
  },

  // ENTRETIEN
  {
    id: 'f-ent-1',
    category: 'entretien',
    question: 'Comment nettoyer mon kaftan ?',
    answer:
      "La majorité de nos pièces se confient à un pressing spécialisé. Pour les pièces en bazin riche, évitez impérativement l'eau : seul le nettoyage à sec par des mains habituées préserve l'éclat indigo et les broderies.",
  },
  {
    id: 'f-ent-2',
    category: 'entretien',
    question: 'Comment ranger une pièce brodée ?',
    answer:
      "Suspendue, à l'abri de la lumière directe, dans une housse de coton respirante. Jamais de plastique — le tissu doit respirer. Les plis prolongés peuvent marquer les broderies en relief.",
  },

  // PAIEMENT
  {
    id: 'f-pay-1',
    category: 'paiement',
    question: 'Quels moyens de paiement acceptez-vous ?',
    answer:
      'Cartes bancaires (Visa, Mastercard, American Express) et Apple Pay via Stripe. Le paiement mobile (Wave, Orange Money, MTN Mobile Money) est en cours d\u2019activation.',
  },
  {
    id: 'f-pay-2',
    category: 'paiement',
    question: 'Le paiement est-il sécurisé ?',
    answer:
      "Oui. Nous n'avons jamais accès à vos données bancaires : elles sont chiffrées et traitées exclusivement par Stripe, certifié PCI-DSS niveau 1.",
  },
  {
    id: 'f-pay-3',
    category: 'paiement',
    question: 'Puis-je payer en plusieurs fois ?',
    answer:
      'Pour les pièces sur-mesure, un acompte est demandé à la commande, le solde au second essayage. Pour le prêt-à-porter, cette option est à l\u2019étude.',
  },

  // RETOURS
  {
    id: 'f-ret-1',
    category: 'retours',
    question: 'Puis-je retourner une pièce ?',
    answer:
      "Oui, sous 14 jours pour les pièces de prêt-à-porter — neuves, non portées, emballage et étiquettes intacts. Les pièces sur-mesure, confectionnées à vos mesures exactes, ne sont pas reprises (article L.221-28 du Code de la consommation).",
  },
  {
    id: 'f-ret-2',
    category: 'retours',
    question: 'Combien de temps pour être remboursé ?',
    answer:
      'Sous 14 jours après réception et contrôle de la pièce, sur votre moyen de paiement initial.',
  },
  {
    id: 'f-ret-3',
    category: 'retours',
    question: 'Les premières retouches sont-elles gratuites ?',
    answer:
      'Oui. Dans les trois mois suivant la livraison, notre atelier ajuste gratuitement ourlets, emmanchures, boutons. Au-delà, un devis est établi selon la prestation.',
  },

  // ATELIER
  {
    id: 'f-atl-1',
    category: 'atelier',
    question: "Où se situe votre atelier ?",
    answer:
      "Notre atelier principal est à {{VILLE}}. Nos showrooms itinérants s'installent quelques jours par an à Paris, Dakar, Abidjan.",
  },
  {
    id: 'f-atl-2',
    category: 'atelier',
    question: 'Combien d\u2019artisans travaillent sur une pièce ?',
    answer:
      "Au minimum quatre : la coupe, la broderie, la finition, le contrôle. Une pièce signature peut mobiliser jusqu'à huit mains sur trois semaines.",
  },
];

export function groupFAQ(items: FAQItem[] = FAQ): Record<FAQCategory, FAQItem[]> {
  return items.reduce<Record<FAQCategory, FAQItem[]>>(
    (acc, item) => {
      (acc[item.category] ??= []).push(item);
      return acc;
    },
    {} as Record<FAQCategory, FAQItem[]>
  );
}
