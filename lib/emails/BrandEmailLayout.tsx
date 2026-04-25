import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

const COLORS = {
  background: '#F5F0E6',
  foreground: '#0A0A0A',
  subtle: '#595449',
  accent: '#C9A961',
  border: '#D9CDA8',
} as const;

const body: React.CSSProperties = {
  backgroundColor: COLORS.background,
  margin: 0,
  padding: '40px 0',
  fontFamily: 'Helvetica, Arial, sans-serif',
  color: COLORS.foreground,
};

const container: React.CSSProperties = {
  margin: '0 auto',
  width: '100%',
  maxWidth: '560px',
  padding: '0 24px',
};

const eyebrow: React.CSSProperties = {
  fontSize: '11px',
  letterSpacing: '0.3em',
  textTransform: 'uppercase',
  color: COLORS.accent,
  margin: 0,
};

const wordmark: React.CSSProperties = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: '28px',
  fontWeight: 300,
  letterSpacing: '0.05em',
  color: COLORS.foreground,
  margin: '8px 0 0 0',
};

const footer: React.CSSProperties = {
  fontSize: '11px',
  color: COLORS.subtle,
  margin: '8px 0',
  fontStyle: 'italic',
};

type Props = {
  preview: string;
  children: React.ReactNode;
};

/**
 * Wrapper visuel commun à tous les emails éditoriaux.
 * Fond ivoire, wordmark en haut, signature et mentions en pied.
 */
export function BrandEmailLayout({ preview, children }: Props) {
  return (
    <Html lang="fr">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={{ textAlign: 'center', padding: '8px 0 32px 0' }}>
            <Text style={eyebrow}>Maison de couture</Text>
            <Text style={wordmark}>Chams Adams</Text>
          </Section>

          {children}

          <Hr style={{ borderColor: COLORS.border, margin: '40px 0 16px 0' }} />
          <Section style={{ textAlign: 'center' }}>
            <Text style={footer}>
              Chams Adams — Maison de couture · Paris · Dakar
            </Text>
            <Text style={footer}>contact@chams-adams.com</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
