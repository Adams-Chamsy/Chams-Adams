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

export type PieceTransferProps = {
  pieceNumber: string;
  productName: string;
  fromEmail: string;
  fromName?: string | null;
  siteUrl?: string;
};

export function PieceTransfer({
  pieceNumber,
  productName,
  fromEmail,
  fromName,
  siteUrl = 'https://chams-adams.com',
}: PieceTransferProps) {
  const senderLabel = fromName ? `${fromName} (${fromEmail})` : fromEmail;
  return (
    <BrandEmailLayout
      preview={`${productName} vous a été transmise — pièce N° ${pieceNumber}`}
    >
      <Section>
        <Heading as="h1" style={heading}>
          Une pièce vient à vous.
        </Heading>
        <Text style={lede}>
          {senderLabel} vous transmet « {productName} ».
        </Text>
        <Text style={para}>
          La pièce porte le numéro{' '}
          <strong>N° {pieceNumber}</strong> et son registre — confection,
          retouches, entretiens — vous suit désormais. La maison reste à vos
          côtés pour toute l&apos;histoire que cette pièce continuera d&apos;écrire
          avec vous.
        </Text>
        <Text style={{ ...para, fontStyle: 'italic', color: COLORS.subtle }}>
          Pour consulter le registre, créez ou connectez-vous à votre espace
          avec la même adresse de courriel que celle où ce message vous est
          parvenu.
        </Text>
        <a href={`${siteUrl}/compte/pieces`} style={cta}>
          Découvrir le registre
        </a>
      </Section>
    </BrandEmailLayout>
  );
}
