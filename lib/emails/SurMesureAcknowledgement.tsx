import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';

const COLORS = {
  background: '#F5F0E6',
  foreground: '#0A0A0A',
  subtle: '#595449',
  accent: '#C9A961',
} as const;

const body: React.CSSProperties = {
  backgroundColor: COLORS.background,
  margin: 0,
  padding: '40px 0',
  fontFamily: 'Helvetica, Arial, sans-serif',
  color: COLORS.foreground,
};
const container: React.CSSProperties = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: '#FFFFFF',
  padding: '48px 32px',
};
const logoTxt: React.CSSProperties = {
  fontFamily: 'Georgia, serif',
  fontSize: '18px',
  letterSpacing: '0.3em',
  textAlign: 'center',
  color: COLORS.foreground,
  margin: '0 0 8px',
};
const lineOr: React.CSSProperties = {
  borderColor: COLORS.accent,
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  margin: '8px auto 40px',
  width: '64px',
};
const heading: React.CSSProperties = {
  fontFamily: 'Georgia, serif',
  fontWeight: 300,
  fontSize: '30px',
  lineHeight: '1.3',
  margin: '0 0 16px',
};
const intro: React.CSSProperties = {
  fontFamily: 'Georgia, serif',
  fontStyle: 'italic',
  fontSize: '16px',
  lineHeight: '1.7',
  color: COLORS.subtle,
  margin: '0 0 24px',
};
const body16: React.CSSProperties = {
  fontFamily: 'Georgia, serif',
  fontSize: '16px',
  lineHeight: '1.7',
  color: COLORS.foreground,
  margin: '0 0 16px',
};
const signature: React.CSSProperties = {
  fontFamily: 'Georgia, serif',
  fontStyle: 'italic',
  fontSize: '16px',
  color: COLORS.accent,
  margin: '32px 0 0',
  textAlign: 'center',
};
const footerNote: React.CSSProperties = {
  fontFamily: 'Helvetica, Arial, sans-serif',
  fontSize: '11px',
  color: COLORS.subtle,
  textAlign: 'center',
  margin: '32px 0 0',
};

export type SurMesureAcknowledgementProps = {
  firstName: string;
  dateFr: string;
};

export function SurMesureAcknowledgement({ firstName, dateFr }: SurMesureAcknowledgementProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  return (
    <Html lang="fr">
      <Head />
      <Preview>Votre demande sur-mesure a été transmise — Chams Adams</Preview>
      <Body style={body}>
        <Container style={container}>
          {siteUrl && (
            <Img
              src={`${siteUrl}/icon.svg`}
              alt=""
              width={52}
              height={47}
              style={{ display: 'block', margin: '0 auto 8px' }}
            />
          )}
          <Text style={logoTxt}>CHAMS ADAMS</Text>
          <Hr style={lineOr} />

          <Heading style={heading}>Votre demande a été transmise</Heading>
          <Text style={intro}>
            Chère Madame, Cher Monsieur {firstName},
            <br />
            Nous avons bien reçu votre demande du {dateFr}.
          </Text>

          <Section>
            <Text style={body16}>
              Un de nos conseillers vous contactera sous 48 heures au plus tard
              pour convenir d&apos;un premier entretien, en atelier ou à distance.
            </Text>
            <Text style={body16}>
              Pensez à nous adresser toute image d&apos;inspiration ou pièce de
              référence qui vous semblerait utile — nous les étudierons avec
              attention avant notre conversation.
            </Text>
          </Section>

          <Hr style={{ borderColor: '#D9CDA8', margin: '32px 0' }} />

          <Section>
            <Text style={{ ...intro, fontSize: '15px' }}>
              Le sur-mesure est la manière la plus ancienne et la plus vivante
              d&apos;habiller un corps. Chez Chams Adams, il n&apos;est pas une option.
              Il est la pratique fondatrice de la maison.
            </Text>
          </Section>

          <Text style={signature}>— La Maison Chams Adams —</Text>

          <Text style={footerNote}>
            Vous recevez ce courriel car vous avez soumis une demande sur-mesure
            depuis chams-adams.com.
            <br />© {new Date().getFullYear()} Chams Adams. Tous droits réservés.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default SurMesureAcknowledgement;
