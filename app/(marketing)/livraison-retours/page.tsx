import type { Metadata } from 'next';
import { LegalLayout } from '@/components/layout/LegalLayout';

export const metadata: Metadata = {
  title: 'Livraison & retours',
  description:
    'Modalités de livraison en France, en Europe et à l\'international. Conditions de retour et de remboursement.',
  robots: { index: true, follow: true },
};

export default function LivraisonRetoursPage() {
  return (
    <LegalLayout
      eyebrow="Notre engagement"
      title="Livraison & retours"
      lastUpdated="21 avril 2026"
    >
      <div className="callout">
        <strong>À personnaliser.</strong> Les délais, tarifs et transporteurs
        ci-dessous sont indicatifs. Les ajuster selon les contrats de
        transport réels avant mise en production.
      </div>

      <h2>Expédition</h2>
      <p>
        Chaque kaftan est préparé avec soin dans notre atelier et emballé
        dans un écrin signature Chams Adams — papier de soie couleur ivoire,
        ruban de satin noir, boîte cartonnée noire cachetée d&apos;un sceau
        doré.
      </p>
      <p>
        Les commandes sont expédiées sous <strong>48 heures ouvrées</strong>{' '}
        pour les pièces en stock. Les pièces en précommande ou sur-mesure
        suivent leur propre calendrier, communiqué dès la confirmation.
      </p>

      <h2>Délais &amp; tarifs — France métropolitaine</h2>
      <ul>
        <li>
          <strong>Standard</strong> — 2 à 3 jours ouvrés — <em>offert dès
          350 €, sinon {'{{9,90 €}}'}</em>.
        </li>
        <li>
          <strong>Express (avant midi)</strong> — 24 h — {'{{19,90 €}}'}.
        </li>
        <li>
          <strong>Remise en main propre</strong> — {'{{Paris, Dakar}}'} —
          sur rendez-vous.
        </li>
      </ul>

      <h2>Délais &amp; tarifs — International</h2>
      <ul>
        <li>
          <strong>Union européenne :</strong> 3 à 5 jours ouvrés — dès{' '}
          {'{{14,90 €}}'}.
        </li>
        <li>
          <strong>Afrique de l&apos;Ouest :</strong> 4 à 7 jours ouvrés — dès{' '}
          {'{{24,90 €}}'}.
        </li>
        <li>
          <strong>Reste du monde :</strong> 5 à 10 jours ouvrés — dès{' '}
          {'{{39,90 €}}'}.
        </li>
      </ul>
      <p>
        <em>
          Les frais de douane et taxes d&apos;importation restent à la charge
          du destinataire pour les livraisons hors UE.
        </em>
      </p>

      <h2>Suivi</h2>
      <p>
        Dès l&apos;expédition, vous recevez un courriel contenant un numéro
        de suivi et le lien du transporteur. Notre service client est à
        votre disposition en cas de difficulté :{' '}
        <a href="mailto:service@chams-adams.com">service@chams-adams.com</a>.
      </p>

      <h2>Retours — Prêt-à-porter</h2>
      <p>
        Vous disposez de <strong>quatorze (14) jours</strong> à compter de
        la réception pour retourner une pièce de prêt-à-porter, sans avoir
        à motiver votre décision.
      </p>
      <p>Conditions impératives :</p>
      <ul>
        <li>Pièce neuve, non portée, non lavée, non parfumée.</li>
        <li>Étiquettes d&apos;origine présentes et non détachées.</li>
        <li>Emballage d&apos;origine intact.</li>
      </ul>

      <h3>Procédure</h3>
      <ol>
        <li>
          Initier la demande depuis le{' '}
          <a href="/retours/demande">formulaire de retour en ligne</a>{' '}
          ou nous écrire à{' '}
          <a href="mailto:service@chams-adams.com">
            service@chams-adams.com
          </a>{' '}
          en précisant votre numéro de commande.
        </li>
        <li>
          Vous recevrez un bordereau de retour prépayé sous 24 h ouvrées.
        </li>
        <li>
          Déposez le colis chez le transporteur indiqué dans les 7 jours
          suivants.
        </li>
        <li>
          Remboursement intégral sous 14 jours après réception et contrôle
          de la pièce, sur le moyen de paiement initial.
        </li>
      </ol>

      <h2>Retours — Sur-mesure</h2>
      <p>
        Conformément à l&apos;article L.221-28 du Code de la consommation,
        les pièces sur-mesure — confectionnées selon vos spécifications
        propres — ne peuvent faire l&apos;objet d&apos;un droit de
        rétractation.
      </p>
      <p>
        En cas de défaut manifeste de conformité ou de vice caché, notre
        atelier reprendra la pièce à ses frais et procédera à l&apos;ajustement,
        à la réparation ou, à défaut, au remboursement intégral.
      </p>

      <h2>Échanges</h2>
      <p>
        Un échange de taille ou de coloris est possible dans les mêmes
        délais que les retours, sous réserve de disponibilité. Les frais
        de renvoi sont offerts pour le premier échange.
      </p>

      <h2>Service après-vente &amp; retouches</h2>
      <p>
        Notre atelier effectue gratuitement les premières retouches dans
        les trois mois suivant la livraison : ajustement d&apos;ourlet,
        reprise d&apos;emmanchures, repositionnement de boutons brodés.
        Au-delà, un devis sera établi selon la prestation.
      </p>
    </LegalLayout>
  );
}
