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

export type CarnetReservationProps = {
  carnetName: string;
  carnetSlug: string;
  productName: string;
  reservedByEmail: string;
  siteUrl?: string;
};

export function CarnetReservation({
  carnetName,
  carnetSlug,
  productName,
  reservedByEmail,
  siteUrl = 'https://chams-adams.com',
}: CarnetReservationProps) {
  return (
    <BrandEmailLayout
      preview={`${productName} vient d'être réservée dans votre carnet « ${carnetName} »`}
    >
      <Section>
        <Heading as="h1" style={heading}>
          Une attention vous est promise.
        </Heading>
        <Text style={lede}>
          {productName} vient d&apos;être réservée dans votre carnet «{' '}
          {carnetName} ». Quelqu&apos;un de proche prévoit de vous l&apos;offrir.
        </Text>
        <Text style={para}>
          La pièce reste visible dans votre carnet — marquée comme «&nbsp;réservée&nbsp;»
          pour éviter qu&apos;elle ne soit choisie deux fois.
        </Text>
        <Text style={{ ...para, fontStyle: 'italic', color: COLORS.subtle }}>
          Réservation par : {reservedByEmail}
        </Text>
        <a href={`${siteUrl}/compte/carnets/${carnetSlug}`} style={cta}>
          Voir mon carnet
        </a>
      </Section>
    </BrandEmailLayout>
  );
}
