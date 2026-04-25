import { Heading, Section, Text } from '@react-email/components';
import { BrandEmailLayout } from './BrandEmailLayout';

const COLORS = {
  foreground: '#0A0A0A',
  subtle: '#595449',
  accent: '#C9A961',
} as const;

const heading: React.CSSProperties = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: '28px',
  fontWeight: 300,
  lineHeight: 1.2,
  color: COLORS.foreground,
  margin: '0 0 16px 0',
};

const lede: React.CSSProperties = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontStyle: 'italic',
  fontSize: '17px',
  lineHeight: 1.6,
  color: COLORS.subtle,
  margin: '0 0 24px 0',
};

const para: React.CSSProperties = {
  fontSize: '15px',
  lineHeight: 1.7,
  color: COLORS.foreground,
  margin: '0 0 16px 0',
};

const cta: React.CSSProperties = {
  display: 'inline-block',
  marginTop: '24px',
  padding: '14px 28px',
  border: `1px solid ${COLORS.accent}`,
  color: COLORS.accent,
  textDecoration: 'none',
  letterSpacing: '0.25em',
  textTransform: 'uppercase',
  fontSize: '11px',
};

export type ReturnStatusProps = {
  status: 'approved' | 'received' | 'refunded' | 'rejected';
  reason: string;
  siteUrl?: string;
};

const COPY: Record<
  ReturnStatusProps['status'],
  { title: string; lede: string; body: string }
> = {
  approved: {
    title: 'Votre demande de retour est approuvée.',
    lede:
      'Vous trouverez ci-dessous les instructions pour nous renvoyer votre pièce.',
    body:
      'Notre service vous transmet sous peu l\u2019étiquette prépayée. Renvoi sous 7 jours, dans l\u2019emballage d\u2019origine.',
  },
  received: {
    title: 'Pièce bien reçue.',
    lede:
      'Votre retour est entre nos mains. Nous procédons à son contrôle.',
    body:
      'Notre atelier vérifie chaque pièce avec soin. Vous serez notifié(e) dès que le remboursement sera lancé.',
  },
  refunded: {
    title: 'Remboursement émis.',
    lede:
      'Votre remboursement vient d\u2019être déclenché vers le moyen de paiement initial.',
    body:
      'Comptez 3 à 7 jours ouvrés selon votre banque pour le voir apparaître. Merci de votre confiance — nous restons à votre écoute.',
  },
  rejected: {
    title: 'Votre demande n\u2019a pas pu être approuvée.',
    lede:
      'Après examen, nous ne pouvons pas accepter le retour. Le détail vous a été communiqué par notre service.',
    body:
      'Pour toute question, écrivez-nous : nous prendrons le temps qu\u2019il faut pour comprendre la situation et trouver une solution.',
  },
};

export function ReturnStatus({
  status,
  reason,
  siteUrl = 'https://chams-adams.com',
}: ReturnStatusProps) {
  const copy = COPY[status];
  return (
    <BrandEmailLayout preview={copy.title}>
      <Section>
        <Heading as="h1" style={heading}>
          {copy.title}
        </Heading>
        <Text style={lede}>{copy.lede}</Text>
        <Text style={para}>{copy.body}</Text>
        <Text style={{ ...para, fontStyle: 'italic', color: COLORS.subtle }}>
          Motif de la demande : {reason}.
        </Text>
        <a href={`${siteUrl}/compte/retours`} style={cta}>
          Suivre dans mon compte
        </a>
      </Section>
    </BrandEmailLayout>
  );
}
