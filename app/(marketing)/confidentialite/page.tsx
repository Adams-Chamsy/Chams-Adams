import type { Metadata } from 'next';
import { LegalLayout } from '@/components/layout/LegalLayout';

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description:
    'Politique de confidentialité de la Maison Chams Adams — collecte, utilisation et protection des données personnelles conformément au RGPD.',
  robots: { index: true, follow: true },
};

export default function ConfidentialitePage() {
  return (
    <LegalLayout
      eyebrow="Protection des données"
      title="Politique de confidentialité"
      lastUpdated="21 avril 2026"
    >
      <div className="callout">
        <strong>Modèle à valider par un avocat / DPO.</strong> Cette politique
        suit la structure imposée par le RGPD (UE 2016/679) et la loi
        «&nbsp;Informatique et Libertés&nbsp;». Les finalités, durées de
        conservation et sous-traitants doivent être ajustés à l&apos;activité
        réelle avant publication.
      </div>

      <h2>Préambule</h2>
      <p>
        La Maison Chams Adams accorde à la protection de votre vie privée
        la même exigence qu&apos;au soin apporté à chacune de ses pièces. La
        présente politique explique quelles données personnelles nous
        collectons, pourquoi et comment nous les traitons, et quels sont vos
        droits.
      </p>

      <h2>Responsable du traitement</h2>
      <p>
        <strong>{'{{RAISON SOCIALE}}'}</strong>, {'{{FORME JURIDIQUE}}'},
        siège social {'{{ADRESSE}}'}, immatriculée au RCS de{' '}
        {'{{VILLE}}'} sous le numéro {'{{SIREN}}'}.
      </p>
      <p>
        Contact — protection des données :{' '}
        <a href="mailto:privacy@chams-adams.com">privacy@chams-adams.com</a>.
      </p>

      <h2>Données collectées</h2>
      <p>Nous collectons les catégories de données suivantes :</p>
      <ul>
        <li>
          <strong>Identification :</strong> nom, prénom, civilité, date de
          naissance (facultative).
        </li>
        <li>
          <strong>Coordonnées :</strong> adresse postale, courriel, téléphone.
        </li>
        <li>
          <strong>Commande :</strong> produits achetés, montant, mode de
          paiement, historique.
        </li>
        <li>
          <strong>Sur-mesure :</strong> mesures corporelles, préférences de
          coupe et matières, rendez-vous.
        </li>
        <li>
          <strong>Navigation :</strong> adresse IP, pages consultées, cookies
          (voir section dédiée).
        </li>
      </ul>

      <h2>Finalités &amp; bases légales</h2>
      <h3>Exécution du contrat</h3>
      <p>
        Traitement de votre commande, livraison, facturation, service
        après-vente, gestion des retours. Base légale :{' '}
        <em>exécution d&apos;un contrat</em>.
      </p>
      <h3>Obligations légales</h3>
      <p>
        Conservation des factures et justificatifs comptables. Base légale :{' '}
        <em>obligation légale</em>.
      </p>
      <h3>Relation client &amp; intérêt légitime</h3>
      <p>
        Réponse à vos demandes, amélioration de l&apos;expérience, détection
        de la fraude. Base légale : <em>intérêt légitime</em>.
      </p>
      <h3>Communication marketing</h3>
      <p>
        Envoi de la newsletter «&nbsp;Correspondances&nbsp;» et invitations aux
        événements. Base légale : <em>consentement</em>, révocable à tout
        moment via le lien de désabonnement.
      </p>

      <h2>Durées de conservation</h2>
      <ul>
        <li>
          <strong>Compte client :</strong> pendant la durée d&apos;activité,
          puis {'{{3 ans}}'} après la dernière interaction.
        </li>
        <li>
          <strong>Commandes &amp; factures :</strong> 10 ans (obligation
          comptable).
        </li>
        <li>
          <strong>Données marketing :</strong> jusqu&apos;au retrait du
          consentement, puis 3 ans maximum.
        </li>
        <li>
          <strong>Cookies :</strong> 13 mois maximum.
        </li>
      </ul>

      <h2>Destinataires &amp; sous-traitants</h2>
      <p>
        Vos données ne sont jamais vendues. Elles sont partagées, dans la
        stricte limite nécessaire, avec les prestataires suivants :
      </p>
      <ul>
        <li>
          <strong>Stripe</strong> (paiement sécurisé) — Irlande.
        </li>
        <li>
          <strong>Vercel</strong> (hébergement) — États-Unis (clauses
          contractuelles types UE).
        </li>
        <li>
          <strong>Resend</strong> (envoi des courriels transactionnels) —{' '}
          {'{{zone}}'}.
        </li>
        <li>
          <strong>{'{{TRANSPORTEURS}}'}</strong> pour la livraison des
          commandes.
        </li>
      </ul>

      <h2>Transferts hors Union européenne</h2>
      <p>
        Certains sous-traitants sont situés hors UE. Ces transferts sont
        encadrés par les <em>clauses contractuelles types</em> adoptées par
        la Commission européenne et, le cas échéant, par des mesures
        techniques complémentaires (chiffrement, pseudonymisation).
      </p>

      <h2>Vos droits</h2>
      <p>Conformément au RGPD, vous disposez des droits suivants :</p>
      <ul>
        <li>
          <strong>Accès :</strong> obtenir copie de vos données.
        </li>
        <li>
          <strong>Rectification :</strong> corriger vos données si elles sont
          inexactes.
        </li>
        <li>
          <strong>Effacement :</strong> demander la suppression de vos
          données.
        </li>
        <li>
          <strong>Limitation :</strong> restreindre le traitement.
        </li>
        <li>
          <strong>Portabilité :</strong> recevoir vos données dans un format
          structuré.
        </li>
        <li>
          <strong>Opposition :</strong> vous opposer à certains traitements.
        </li>
        <li>
          <strong>Directives post-mortem :</strong> définir le sort de vos
          données après votre décès.
        </li>
      </ul>
      <p>
        Pour exercer ces droits, écrivez-nous à{' '}
        <a href="mailto:privacy@chams-adams.com">privacy@chams-adams.com</a>{' '}
        en joignant une preuve d&apos;identité. Une réponse vous sera apportée
        sous un mois.
      </p>
      <p>
        Vous pouvez également introduire une réclamation auprès de la{' '}
        <strong>CNIL</strong> —{' '}
        <a
          href="https://www.cnil.fr"
          target="_blank"
          rel="noopener noreferrer"
        >
          cnil.fr
        </a>
        .
      </p>

      <h2>Cookies</h2>
      <p>
        Nous utilisons trois catégories de cookies :
      </p>
      <ul>
        <li>
          <strong>Nécessaires :</strong> indispensables au fonctionnement du
          site (panier, session) — exempts de consentement.
        </li>
        <li>
          <strong>Mesure d&apos;audience :</strong> statistiques anonymisées
          — soumis à consentement.
        </li>
        <li>
          <strong>Marketing :</strong> personnalisation et remarketing —
          soumis à consentement explicite.
        </li>
      </ul>
      <p>
        Vos préférences peuvent être modifiées à tout moment via le bandeau
        de gestion des cookies.
      </p>

      <h2>Sécurité</h2>
      <p>
        Nous mettons en œuvre des mesures techniques et organisationnelles
        adaptées : chiffrement TLS, hachage des mots de passe, contrôle des
        accès, audits réguliers.
      </p>

      <h2>Modifications</h2>
      <p>
        La présente politique peut être mise à jour. La date figurant en
        tête de page reflète la dernière révision. Toute modification
        substantielle vous sera notifiée.
      </p>
    </LegalLayout>
  );
}
