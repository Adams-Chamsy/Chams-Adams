import { Heading, Section, Text } from '@react-email/components';
import { BrandEmailLayout } from './BrandEmailLayout';

const COLORS = {
  foreground: '#0A0A0A',
  subtle: '#595449',
  accent: '#C9A961',
} as const;

const heading: React.CSSProperties = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: '30px',
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

export type RestockProps = {
  productName: string;
  productSlug: string;
  size?: string | null;
  siteUrl?: string;
};

export function Restock({
  productName,
  productSlug,
  size,
  siteUrl = 'https://chams-adams.com',
}: RestockProps) {
  return (
    <BrandEmailLayout
      preview={`${productName} est à nouveau disponible — vous étiez sur la liste.`}
    >
      <Section>
        <Heading as="h1" style={heading}>
          Elle est de retour.
        </Heading>
        <Text style={lede}>
          {productName}
          {size ? `, taille ${size},` : ''} est à nouveau disponible. Vous
          étiez sur la liste — nous vous prévenons en premier, comme promis.
        </Text>
        <Text style={para}>
          Les pièces remises en ligne partent vite. Nous vous invitons à la
          composer rapidement si elle vous attendait.
        </Text>
        <a href={`${siteUrl}/produit/${productSlug}`} style={cta}>
          Composer la pièce
        </a>
      </Section>
    </BrandEmailLayout>
  );
}
