import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Column,
  Section,
  Text,
  Link,
} from '@react-email/components';
import type { SurMesureInput } from '@/lib/schemas/surMesure';
import {
  OCCASION_LABELS,
  BUDGET_LABELS,
  CONTACT_MODE_LABELS,
  CRENEAU_LABELS,
} from '@/lib/schemas/surMesure';

const body: React.CSSProperties = {
  backgroundColor: '#F5F0E6',
  margin: 0,
  padding: '24px 0',
  fontFamily: 'Helvetica, Arial, sans-serif',
  color: '#0A0A0A',
};
const container: React.CSSProperties = {
  maxWidth: '640px',
  margin: '0 auto',
  backgroundColor: '#FFFFFF',
  padding: '32px',
};
const labelUp: React.CSSProperties = {
  fontFamily: 'Helvetica, Arial, sans-serif',
  fontSize: '10px',
  textTransform: 'uppercase',
  letterSpacing: '0.25em',
  color: '#C9A961',
  margin: '0 0 4px',
};
const value: React.CSSProperties = {
  fontFamily: 'Georgia, serif',
  fontSize: '15px',
  color: '#0A0A0A',
  margin: '0 0 16px',
  lineHeight: '1.5',
};
const heading: React.CSSProperties = {
  fontFamily: 'Georgia, serif',
  fontWeight: 300,
  fontSize: '22px',
  margin: '0 0 8px',
};

export type SurMesureNotificationProps = {
  data: SurMesureInput;
  submittedAt: string; // ISO
};

export function SurMesureNotification({ data, submittedAt }: SurMesureNotificationProps) {
  const submittedFr = new Date(submittedAt).toLocaleString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const replyBody = encodeURIComponent(
    `Bonjour ${data.firstName},\n\nMerci pour votre demande du ${submittedFr}. Nous vous proposons de convenir d'un entretien...\n\nLa Maison Chams Adams`
  );
  const replySubject = encodeURIComponent(
    `Votre demande sur-mesure — Chams Adams`
  );

  return (
    <Html lang="fr">
      <Head />
      <Preview>Nouvelle demande sur-mesure — {data.firstName} {data.lastName}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Text style={labelUp}>Interne · Demande sur-mesure</Text>
          <Heading style={heading}>
            {data.firstName} {data.lastName}
          </Heading>
          <Text style={{ ...value, fontStyle: 'italic', color: '#595449' }}>
            Reçue le {submittedFr}
          </Text>

          <Hr style={{ borderColor: '#D9CDA8', margin: '16px 0 24px' }} />

          <Row>
            <Column style={{ verticalAlign: 'top', paddingRight: 16 }}>
              <Text style={labelUp}>Contact</Text>
              <Text style={value}>
                <Link href={`mailto:${data.email}?subject=${replySubject}&body=${replyBody}`}>
                  {data.email}
                </Link>
                {data.phone ? <><br />{data.phone}</> : null}
              </Text>
              <Text style={labelUp}>Lieu</Text>
              <Text style={value}>
                {data.city}, {data.country}
              </Text>
              <Text style={labelUp}>Préférences</Text>
              <Text style={value}>
                {CONTACT_MODE_LABELS[data.contactMode]} · {CRENEAU_LABELS[data.creneau]}
              </Text>
            </Column>
            <Column style={{ verticalAlign: 'top', paddingLeft: 16 }}>
              <Text style={labelUp}>Occasion</Text>
              <Text style={value}>{OCCASION_LABELS[data.occasion]}</Text>
              {data.eventDate && (
                <>
                  <Text style={labelUp}>Date</Text>
                  <Text style={value}>{data.eventDate}</Text>
                </>
              )}
              <Text style={labelUp}>Budget</Text>
              <Text style={value}>{BUDGET_LABELS[data.budget]}</Text>
            </Column>
          </Row>

          <Hr style={{ borderColor: '#D9CDA8', margin: '8px 0 24px' }} />

          <Section>
            <Text style={labelUp}>Vision</Text>
            <Text style={{ ...value, whiteSpace: 'pre-wrap' }}>
              {data.vision}
            </Text>
          </Section>

          <Hr style={{ borderColor: '#D9CDA8', margin: '24px 0' }} />

          <Section>
            <Link
              href={`mailto:${data.email}?subject=${replySubject}&body=${replyBody}`}
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                border: '1px solid #C9A961',
                color: '#0A0A0A',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontSize: '12px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                textDecoration: 'none',
              }}
            >
              Répondre à {data.firstName}
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default SurMesureNotification;
