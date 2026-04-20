import { Resend } from 'resend';
import { render } from '@react-email/render';
import { SurMesureAcknowledgement } from './SurMesureAcknowledgement';
import { SurMesureNotification } from './SurMesureNotification';
import type { SurMesureInput } from '@/lib/schemas/surMesure';

/**
 * Envoie les deux emails liés à une demande sur-mesure :
 *  1. Accusé de réception au client
 *  2. Notification interne à la maison (CONTACT_EMAIL)
 *
 * Retourne un objet détaillant chaque envoi. Ne throw pas — log et continue
 * pour qu'une erreur d'envoi d'un côté ne bloque pas l'autre.
 */
export async function sendSurMesureEmails(
  data: SurMesureInput,
  submittedAt: string
): Promise<{ acknowledgement: boolean; notification: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL ?? 'contact@chams-adams.com';

  if (!apiKey) {
    console.warn('[sur-mesure] RESEND_API_KEY manquante — emails non envoyés.');
    return { acknowledgement: false, notification: false };
  }

  const resend = new Resend(apiKey);
  const from = `Chams Adams <${contactEmail}>`;
  const dateFr = new Date(submittedAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const results = { acknowledgement: false, notification: false };

  // 1. Accusé de réception client
  try {
    const html = await render(
      SurMesureAcknowledgement({ firstName: data.firstName, dateFr }),
      { pretty: false }
    );
    const { error } = await resend.emails.send({
      from,
      to: data.email,
      subject: 'Votre demande a été transmise — Chams Adams',
      html,
      text: `Chère Madame, Cher Monsieur ${data.firstName},\n\nNous avons bien reçu votre demande du ${dateFr}. Un de nos conseillers vous contactera sous 48 heures au plus tard.\n\n— La Maison Chams Adams`,
      replyTo: contactEmail,
    });
    if (error) console.error('[sur-mesure] ack failed:', error);
    else results.acknowledgement = true;
  } catch (err) {
    console.error('[sur-mesure] ack throw:', err);
  }

  // 2. Notification interne
  try {
    const html = await render(SurMesureNotification({ data, submittedAt }), { pretty: false });
    const { error } = await resend.emails.send({
      from,
      to: contactEmail,
      subject: `Nouvelle demande sur-mesure — ${data.firstName} ${data.lastName}`,
      html,
      replyTo: data.email,
    });
    if (error) console.error('[sur-mesure] notif failed:', error);
    else results.notification = true;
  } catch (err) {
    console.error('[sur-mesure] notif throw:', err);
  }

  return results;
}
