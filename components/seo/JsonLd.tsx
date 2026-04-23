/**
 * Tag `<script type="application/ld+json">` réutilisable.
 * Le rendu se fait toujours côté serveur — la donnée est statique à l'émission.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
