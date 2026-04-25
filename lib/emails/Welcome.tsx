import { Heading, Section, Text } from '@react-email/components';
import { BrandEmailLayout } from './BrandEmailLayout';

const COLORS = {
  foreground: '#0A0A0A',
  subtle: '#595449',
  accent: '#C9A961',
} as const;

const heading: React.CSSProperties = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: '32px',
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

export type WelcomeProps = {
  siteUrl?: string;
};

export function Welcome({ siteUrl = 'https://chams-adams.com' }: WelcomeProps) {
  return (
    <BrandEmailLayout preview="Bienvenue dans le cercle Chams Adams.">
      <Section>
        <Heading as="h1" style={heading}>
          Bienvenue dans le cercle.
        </Heading>
        <Text style={lede}>
          Vous rejoignez une maison qui prend le temps. Le temps des mains, des
          mesures, du tombé. Le temps que mérite chaque pièce qui sortira de
          notre atelier.
        </Text>
        <Text style={para}>
          Vous serez les premiers à découvrir nos collections, nos défilés, et
          les histoires d&apos;artisans que nous racontons dans le journal. Ni
          plus, ni moins.
        </Text>
        <Text style={para}>
          En attendant, ces portes vous sont ouvertes&nbsp;:
        </Text>
        <Text style={{ ...para, marginBottom: 0 }}>
          ·{' '}
          <a href={`${siteUrl}/collections`} style={{ color: COLORS.accent }}>
            Les collections
          </a>
        </Text>
        <Text style={{ ...para, marginBottom: 0 }}>
          ·{' '}
          <a href={`${siteUrl}/sur-mesure`} style={{ color: COLORS.accent }}>
            Le sur-mesure
          </a>
        </Text>
        <Text style={{ ...para, marginBottom: 0 }}>
          ·{' '}
          <a href={`${siteUrl}/savoir-faire`} style={{ color: COLORS.accent }}>
            Le savoir-faire
          </a>
        </Text>
        <a href={siteUrl} style={cta}>
          Visiter la maison
        </a>
      </Section>
    </BrandEmailLayout>
  );
}
