import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';

export type OrderConfirmationItem = {
  name: string;
  description?: string;
  quantity: number;
  /** Prix unitaire en cents. */
  unitAmount: number;
  currency: string;
  imageUrl?: string;
};

export type OrderConfirmationProps = {
  orderNumber: string;
  orderDate: string; // ISO string
  customerName?: string | null;
  items: OrderConfirmationItem[];
  subtotalCents: number;
  totalCents: number;
  shippingCents?: number | null;
  currency: string;
  shippingAddress?: {
    line1?: string | null;
    line2?: string | null;
    postal_code?: string | null;
    city?: string | null;
    country?: string | null;
  } | null;
};

// --------------------------------------------------------------------
// Styles — Email-safe (Georgia fallback pour Cormorant, Helvetica pour Inter)
// --------------------------------------------------------------------
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
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: '#FFFFFF',
  padding: '40px 32px',
};

const logoTxt: React.CSSProperties = {
  fontFamily: 'Georgia, serif',
  fontWeight: 300,
  fontSize: '18px',
  letterSpacing: '0.3em',
  textAlign: 'center',
  color: COLORS.foreground,
  margin: '0 0 8px 0',
};

const lineOr: React.CSSProperties = {
  borderColor: COLORS.accent,
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  margin: '8px auto 32px auto',
  width: '64px',
};

const heading: React.CSSProperties = {
  fontFamily: 'Georgia, serif',
  fontWeight: 300,
  fontSize: '32px',
  lineHeight: '1.2',
  color: COLORS.foreground,
  margin: '0 0 16px 0',
};

const intro: React.CSSProperties = {
  fontFamily: 'Georgia, serif',
  fontStyle: 'italic',
  fontSize: '16px',
  lineHeight: '1.7',
  color: COLORS.subtle,
  margin: '0 0 32px 0',
};

const labelUp: React.CSSProperties = {
  fontFamily: 'Helvetica, Arial, sans-serif',
  fontSize: '11px',
  textTransform: 'uppercase',
  letterSpacing: '0.25em',
  color: COLORS.accent,
  margin: '0 0 6px 0',
};

const value: React.CSSProperties = {
  fontFamily: 'Georgia, serif',
  fontSize: '18px',
  color: COLORS.foreground,
  margin: '0 0 16px 0',
};

const itemName: React.CSSProperties = {
  fontFamily: 'Georgia, serif',
  fontSize: '16px',
  color: COLORS.foreground,
  margin: '0 0 4px 0',
};

const itemDesc: React.CSSProperties = {
  fontFamily: 'Helvetica, Arial, sans-serif',
  fontSize: '12px',
  color: COLORS.subtle,
  margin: '0',
};

const amount: React.CSSProperties = {
  fontFamily: 'Helvetica, Arial, sans-serif',
  fontSize: '14px',
  letterSpacing: '0.05em',
  color: COLORS.foreground,
  margin: '0',
  textAlign: 'right',
};

const total: React.CSSProperties = {
  ...amount,
  fontSize: '18px',
  fontWeight: 500,
};

const hr: React.CSSProperties = {
  borderColor: COLORS.border,
  margin: '24px 0',
};

const signature: React.CSSProperties = {
  fontFamily: 'Georgia, serif',
  fontStyle: 'italic',
  fontSize: '16px',
  color: COLORS.accent,
  margin: '40px 0 0 0',
  textAlign: 'center',
};

const footerNote: React.CSSProperties = {
  fontFamily: 'Helvetica, Arial, sans-serif',
  fontSize: '11px',
  color: COLORS.subtle,
  textAlign: 'center',
  margin: '32px 0 0 0',
  lineHeight: '1.6',
};

// --------------------------------------------------------------------
// Template
// --------------------------------------------------------------------

export function OrderConfirmation({
  orderNumber,
  orderDate,
  customerName,
  items,
  subtotalCents,
  totalCents,
  shippingCents,
  currency,
  shippingAddress,
}: OrderConfirmationProps) {
  const formatted = (cents: number) =>
    new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(cents / 100);

  const formattedDate = new Date(orderDate).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Html lang="fr">
      <Head />
      <Preview>
        Votre sélection est accueillie — commande n° {orderNumber.slice(-8).toUpperCase()}
      </Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Logo */}
          <Text style={logoTxt}>CHAMS ADAMS</Text>
          <Hr style={lineOr} />

          {/* Accueil */}
          <Heading style={heading}>Votre sélection est accueillie</Heading>
          <Text style={intro}>
            {customerName ? `${customerName},` : 'Madame, Monsieur,'}
            <br />
            Nous accusons réception de votre commande du {formattedDate}.
            Nos artisans prennent le relais avec soin.
          </Text>

          {/* Numéro de commande */}
          <Section>
            <Text style={labelUp}>Référence</Text>
            <Text style={value}>
              N° {orderNumber.slice(-8).toUpperCase()}
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Items */}
          <Section>
            <Text style={labelUp}>Pièces</Text>
            {items.map((item, i) => (
              <Row key={i} style={{ marginBottom: 16 }}>
                {item.imageUrl && (
                  <Column style={{ width: 72, verticalAlign: 'top' }}>
                    <Img
                      src={item.imageUrl}
                      alt=""
                      width={64}
                      height={80}
                      style={{ display: 'block', objectFit: 'cover' }}
                    />
                  </Column>
                )}
                <Column style={{ verticalAlign: 'top' }}>
                  <Text style={itemName}>{item.name}</Text>
                  {item.description && (
                    <Text style={itemDesc}>{item.description}</Text>
                  )}
                  <Text style={itemDesc}>Quantité : {item.quantity}</Text>
                </Column>
                <Column style={{ verticalAlign: 'top', width: 100 }}>
                  <Text style={amount}>
                    {formatted(item.unitAmount * item.quantity)}
                  </Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Hr style={hr} />

          {/* Totaux */}
          <Section>
            <Row>
              <Column>
                <Text style={itemName}>Sous-total</Text>
              </Column>
              <Column>
                <Text style={amount}>{formatted(subtotalCents)}</Text>
              </Column>
            </Row>
            {typeof shippingCents === 'number' && (
              <Row>
                <Column>
                  <Text style={itemName}>Livraison</Text>
                </Column>
                <Column>
                  <Text style={amount}>
                    {shippingCents === 0 ? 'Offerte' : formatted(shippingCents)}
                  </Text>
                </Column>
              </Row>
            )}
            <Row>
              <Column>
                <Text style={{ ...itemName, fontSize: 18, fontWeight: 500 }}>
                  Total
                </Text>
              </Column>
              <Column>
                <Text style={total}>{formatted(totalCents)}</Text>
              </Column>
            </Row>
          </Section>

          {shippingAddress && (shippingAddress.line1 || shippingAddress.city) && (
            <>
              <Hr style={hr} />
              <Section>
                <Text style={labelUp}>Livraison</Text>
                <Text style={{ ...itemName, fontSize: 14, lineHeight: '1.6' }}>
                  {customerName ? `${customerName}\n` : ''}
                  {shippingAddress.line1 ?? ''}
                  {shippingAddress.line2 ? `\n${shippingAddress.line2}` : ''}
                  {shippingAddress.postal_code || shippingAddress.city
                    ? `\n${shippingAddress.postal_code ?? ''} ${shippingAddress.city ?? ''}`
                    : ''}
                  {shippingAddress.country ? `\n${shippingAddress.country}` : ''}
                </Text>
              </Section>
            </>
          )}

          {/* Informations */}
          <Hr style={hr} />
          <Section>
            <Text style={intro}>
              Les pièces en disponibilité sont expédiées sous 3 à 5 jours
              ouvrés. Les pièces sur-mesure bénéficient d&apos;un suivi dédié.
              Nous reviendrons vers vous par écrit pour toute étape importante.
            </Text>
            <Text style={intro}>
              Pour toute question, notre équipe est joignable à{' '}
              <a
                href={`mailto:${process.env.CONTACT_EMAIL ?? 'contact@chams-adams.com'}`}
                style={{ color: COLORS.accent, textDecoration: 'none' }}
              >
                {process.env.CONTACT_EMAIL ?? 'contact@chams-adams.com'}
              </a>
              .
            </Text>
          </Section>

          {/* Signature */}
          <Text style={signature}>
            — Chams Adams, Maison de couture —
          </Text>

          {/* Footer */}
          <Text style={footerNote}>
            Vous recevez ce courriel car une commande a été passée avec cette
            adresse sur chams-adams.com.
            <br />© {new Date().getFullYear()} Chams Adams. Tous droits réservés.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default OrderConfirmation;
