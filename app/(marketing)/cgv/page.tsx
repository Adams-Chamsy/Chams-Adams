import type { Metadata } from 'next';
import { LegalLayout } from '@/components/layout/LegalLayout';

export const metadata: Metadata = {
  title: 'Conditions générales de vente',
  description:
    'Conditions générales de vente de la Maison Chams Adams — commande, paiement, livraison, droit de rétractation, garanties.',
  robots: { index: true, follow: true },
};

export default function CGVPage() {
  return (
    <LegalLayout
      eyebrow="Ventes en ligne"
      title="Conditions générales de vente"
      lastUpdated="21 avril 2026"
    >
      <div className="callout">
        <strong>Modèle à valider par un avocat.</strong> Les CGV ci-dessous
        sont un modèle indicatif. Les montants, délais et clauses spécifiques
        (sur-mesure, livraison internationale, paiements mobile money) doivent
        être ajustés selon l&apos;activité réelle, puis validés juridiquement
        avant mise en production.
      </div>

      <h2>Article 1 — Objet</h2>
      <p>
        Les présentes conditions générales de vente (ci-après «{' '}
        <strong>CGV</strong> ») régissent les relations contractuelles entre{' '}
        <strong>{'{{RAISON SOCIALE}}'}</strong>, ci-après dénommée «{' '}
        <em>la Maison Chams Adams</em> », et toute personne physique non
        commerçante procédant à un achat sur le site{' '}
        <a href="https://chams-adams.com">chams-adams.com</a> (ci-après le «{' '}
        <strong>Client</strong> »).
      </p>

      <h2>Article 2 — Acceptation</h2>
      <p>
        Toute commande passée sur le site implique l&apos;acceptation pleine
        et entière des présentes CGV par le Client, qui reconnaît en avoir
        pris connaissance préalablement. Les CGV applicables sont celles en
        vigueur à la date de la commande.
      </p>

      <h2>Article 3 — Produits</h2>
      <p>
        La Maison Chams Adams propose des kaftans de prêt-à-porter et de
        sur-mesure, ainsi que des pièces signatures en édition limitée. Chaque
        pièce est présentée avec une fiche détaillée : matière, origine,
        dimensions, temps de création et informations d&apos;entretien.
      </p>
      <p>
        Les photographies des produits n&apos;ont pas de valeur contractuelle.
        Les variations de teinte sont inhérentes aux tissus teints à la main
        et ne sauraient constituer un défaut.
      </p>

      <h2>Article 4 — Prix</h2>
      <p>
        Les prix sont indiqués en euros, toutes taxes comprises, hors frais
        de livraison. Ces derniers sont calculés au moment du récapitulatif
        de commande en fonction de la destination et du mode choisi.
      </p>
      <p>
        La Maison se réserve le droit de modifier ses prix à tout moment ;
        les produits seront toutefois facturés sur la base des tarifs en
        vigueur au moment de la validation de la commande.
      </p>

      <h2>Article 5 — Commande</h2>
      <p>
        Le Client valide sa commande après avoir vérifié le contenu de son
        panier, indiqué son adresse de livraison et choisi son mode de
        paiement. Un courriel de confirmation récapitulant la commande lui
        est envoyé dès enregistrement.
      </p>
      <p>
        La Maison Chams Adams se réserve le droit d&apos;annuler ou de
        refuser toute commande d&apos;un Client présentant un litige antérieur
        ou pour tout motif légitime.
      </p>

      <h2>Article 6 — Paiement</h2>
      <p>
        Le paiement s&apos;effectue par carte bancaire via notre prestataire
        sécurisé <strong>Stripe</strong>. Les données bancaires sont chiffrées
        et ne transitent jamais par nos serveurs. D&apos;autres moyens de
        paiement pourront être proposés selon la destination (notamment{' '}
        {'{{Wave, Orange Money, MTN Mobile Money}}'}).
      </p>

      <h2>Article 7 — Livraison</h2>
      <p>
        Les modalités et délais de livraison sont détaillés sur la page{' '}
        <a href="/livraison-retours">Livraison &amp; retours</a>. Les délais
        courent à compter de la validation du paiement et n&apos;incluent pas
        les délais de confection pour les pièces sur-mesure.
      </p>

      <h2>Article 8 — Sur-mesure</h2>
      <p>
        Toute commande de kaftan sur-mesure fait l&apos;objet d&apos;un devis
        préalable, d&apos;une prise de mesures encadrée et d&apos;un accord
        écrit du Client. Le délai de confection est de{' '}
        <strong>trois à six semaines</strong> selon la complexité. Un acompte
        de <strong>{'{{30 %}}'}</strong> est demandé à la commande.
      </p>
      <p>
        Conformément à l&apos;article L.221-28 du Code de la consommation,
        les pièces sur-mesure, confectionnées aux dimensions et spécifications
        du Client, ne peuvent faire l&apos;objet d&apos;un droit de
        rétractation.
      </p>

      <h2>Article 9 — Droit de rétractation</h2>
      <p>
        Pour les pièces de prêt-à-porter, le Client dispose d&apos;un délai
        de <strong>quatorze (14) jours</strong> à compter de la réception
        pour exercer son droit de rétractation, sans avoir à motiver sa
        décision. Les produits doivent être retournés neufs, dans leur
        emballage d&apos;origine et avec toutes leurs étiquettes.
      </p>
      <p>
        Les modalités pratiques sont décrites sur la page{' '}
        <a href="/livraison-retours">Livraison &amp; retours</a>.
      </p>

      <h2>Article 10 — Garanties</h2>
      <p>
        Les produits bénéficient de la garantie légale de conformité
        (articles L.217-4 et suivants du Code de la consommation) et de la
        garantie des vices cachés (articles 1641 et suivants du Code civil).
      </p>

      <h2>Article 11 — Responsabilité</h2>
      <p>
        La Maison Chams Adams ne saurait être tenue responsable des
        dommages résultant d&apos;un mauvais usage, d&apos;un entretien non
        conforme aux recommandations ou de l&apos;usure normale du produit.
      </p>

      <h2>Article 12 — Données personnelles</h2>
      <p>
        Le traitement des données personnelles du Client est détaillé dans
        notre <a href="/confidentialite">politique de confidentialité</a>.
      </p>

      <h2>Article 13 — Litiges</h2>
      <p>
        En cas de litige, une solution amiable sera recherchée en priorité.
        À défaut, le Client peut saisir gratuitement le médiateur de la
        consommation compétent ou la plateforme européenne de règlement des
        litiges en ligne :{' '}
        <a
          href="https://ec.europa.eu/consumers/odr"
          target="_blank"
          rel="noopener noreferrer"
        >
          ec.europa.eu/consumers/odr
        </a>
        .
      </p>
      <p>
        Les présentes CGV sont soumises au droit français. Tout litige non
        résolu à l&apos;amiable relève de la compétence des tribunaux
        français.
      </p>
    </LegalLayout>
  );
}
