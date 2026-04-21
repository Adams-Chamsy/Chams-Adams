import type { Metadata } from 'next';
import { LegalLayout } from '@/components/layout/LegalLayout';

export const metadata: Metadata = {
  title: 'Mentions légales',
  description:
    'Informations légales concernant la Maison Chams Adams — éditeur, hébergeur, propriété intellectuelle.',
  robots: { index: true, follow: true },
};

export default function MentionsLegalesPage() {
  return (
    <LegalLayout
      eyebrow="Informations légales"
      title="Mentions légales"
      lastUpdated="21 avril 2026"
    >
      <div className="callout">
        <strong>Modèle à valider par un avocat.</strong> Les mentions ci-dessous
        sont un modèle indicatif. Les informations entre accolades{' '}
        <code>{'{{…}}'}</code> doivent être complétées et l&apos;ensemble
        validé juridiquement avant mise en production.
      </div>

      <h2>Éditeur du site</h2>
      <p>
        Le présent site <em>chams-adams.com</em> est édité par{' '}
        <strong>{'{{RAISON SOCIALE}}'}</strong>,{' '}
        {'{{FORME JURIDIQUE — SARL, SAS, EURL, etc.}}'} au capital social de{' '}
        {'{{MONTANT}}'} euros, immatriculée au Registre du Commerce et des
        Sociétés de {'{{VILLE}}'} sous le numéro {'{{SIREN / RCS}}'}.
      </p>
      <ul>
        <li>
          <strong>Siège social :</strong> {'{{ADRESSE COMPLÈTE}}'}
        </li>
        <li>
          <strong>N° TVA intracommunautaire :</strong> {'{{FR…}}'}
        </li>
        <li>
          <strong>Téléphone :</strong> {'{{+…}}'}
        </li>
        <li>
          <strong>Courriel :</strong>{' '}
          <a href="mailto:contact@chams-adams.com">contact@chams-adams.com</a>
        </li>
      </ul>

      <h2>Directeur de la publication</h2>
      <p>
        {'{{NOM PRÉNOM}}'}, en sa qualité de{' '}
        {'{{FONCTION — gérant, président, etc.}}'} de la société{' '}
        {'{{RAISON SOCIALE}}'}.
      </p>

      <h2>Hébergeur</h2>
      <p>
        Le site est hébergé par <strong>Vercel Inc.</strong>, 440 N Barranca
        Ave #4133, Covina, CA 91723, États-Unis —{' '}
        <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">
          vercel.com
        </a>
        .
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble des éléments composant ce site — textes, photographies,
        vidéos, illustrations, modèles, graphisme, marques, logos, savoir-faire
        et création des kaftans — est la propriété exclusive de{' '}
        <strong>{'{{RAISON SOCIALE}}'}</strong> ou de ses partenaires, et est
        protégé par les lois françaises et internationales relatives à la
        propriété intellectuelle.
      </p>
      <p>
        Toute reproduction, représentation, diffusion ou exploitation, totale
        ou partielle, sous quelque forme que ce soit, sans l&apos;autorisation
        écrite préalable de la Maison Chams Adams, est strictement interdite
        et constitue une contrefaçon sanctionnée par les articles L.335-2 et
        suivants du Code de la propriété intellectuelle.
      </p>

      <h2>Données personnelles</h2>
      <p>
        Le traitement des données personnelles recueillies sur ce site est
        détaillé dans notre{' '}
        <a href="/confidentialite">politique de confidentialité</a>.
      </p>

      <h2>Cookies</h2>
      <p>
        Ce site utilise des cookies strictement nécessaires à son
        fonctionnement ainsi que des cookies de mesure d&apos;audience soumis
        à votre consentement. Vous pouvez à tout moment modifier vos
        préférences via le bandeau dédié.
      </p>

      <h2>Droit applicable — litiges</h2>
      <p>
        Les présentes mentions sont régies par le droit français. Tout litige
        relatif à l&apos;interprétation ou à l&apos;exécution de ces mentions
        relève de la compétence exclusive des tribunaux de {'{{VILLE}}'}, sauf
        dispositions légales impératives contraires.
      </p>

      <h2>Crédits</h2>
      <p>
        Conception & développement : {'{{AGENCE OU NOM}}'}. Typographies{' '}
        <em>Cormorant Garamond</em>, <em>Inter</em> et <em>Italianno</em>{' '}
        diffusées par Google Fonts sous licence libre.
      </p>
    </LegalLayout>
  );
}
