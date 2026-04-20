import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { TextReveal } from '@/components/animations/TextReveal';
import { ZoomReveal } from '@/components/animations/ZoomReveal';
import { EditorialBlock } from '@/components/editorial/EditorialBlock';

export const metadata: Metadata = {
  title: 'Savoir-faire — L’atelier',
  description:
    "Un voyage en cinq chapitres dans les ateliers Chams Adams : la matière, la teinture, la broderie, la coupe, l'assemblage. Des gestes transmis depuis six générations.",
  openGraph: {
    title: 'Savoir-faire — Chams Adams',
    description:
      "Cinq gestes, une tradition vivante. Découvrez l'atelier et ses artisans.",
  },
};

const ARTISANS = [
  {
    name: 'Fatou Diagne',
    specialty: 'Maîtresse brodeuse',
    years: 42,
    quote: 'Chaque motif est une prière silencieuse.',
    image: '/images/journal/portrait-artisan.svg',
  },
  {
    name: 'Amadou Sarr',
    specialty: 'Maître teinturier',
    years: 31,
    quote: "L'indigo a une mémoire. Il vit dans le tissu, il respire.",
    image: '/images/journal/portrait-artisan.svg',
  },
  {
    name: 'Mariama Ba',
    specialty: 'Maîtresse couturière',
    years: 28,
    quote: "La coupe honore le corps sans jamais le contraindre.",
    image: '/images/journal/portrait-artisan.svg',
  },
];

export default function SavoirFairePage() {
  return (
    <>
      {/* HERO */}
      <section
        aria-labelledby="sf-title"
        className="relative flex h-[80vh] min-h-[600px] items-end overflow-hidden bg-noir"
      >
        <Image
          src="/images/savoir-faire/broderie-macro.svg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          aria-hidden
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-noir/40 via-noir/50 to-noir" />
        <div className="container-content relative z-10 flex flex-col gap-6 pb-20 md:pb-28">
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
            L&apos;art et la main
          </span>
          <TextReveal
            as="h1"
            splitBy="words"
            stagger={0.06}
            className="font-serif font-light leading-[1.02] text-ivoire text-[clamp(3rem,7vw,6rem)]"
          >
            L&apos;Atelier
          </TextReveal>
          <p
            id="sf-title"
            className="max-w-prose font-serif italic text-ivoire/80 text-xl md:text-2xl"
          >
            Cinq gestes, une tradition vivante.
          </p>
        </div>
      </section>

      {/* CHAPITRE I — LA MATIÈRE */}
      <EditorialBlock
        variant="text-image"
        eyebrow="I — La matière"
        title="Le bazin qui se souvient"
        body={
          <>
            <p>
              Le bazin riche est le cœur battant de nos pièces de cérémonie.
              Tissé en coton damassé, il arrive dans nos ateliers écru, presque
              brut. C&apos;est entre nos mains qu&apos;il devient précieux.
            </p>
            <p>
              Nous travaillons principalement avec des tisserands de la région
              de Kaolack, au Sénégal. Certains ateliers nous fournissent depuis
              plus de trente ans. Leur trame, leur densité, leur poids : tout
              est reconnaissable à l&apos;œil averti.
            </p>
            <p>
              Le bazin se travaille au pilon, au fer, à la pierre. Il se lustre.
              Il se grève. Il se battra des milliers de fois avant de trouver
              son éclat définitif — cette lumière profonde qu&apos;aucune fibre
              synthétique n&apos;imite.
            </p>
          </>
        }
        image={{
          src: '/images/savoir-faire/broderie-macro.svg',
          alt: 'Détail macro du bazin écru et fini côte à côte',
          caption: 'Bazin riche écru (à gauche) et lustré (à droite) — atelier de Kaolack',
        }}
      />

      {/* CHAPITRE II — LA TEINTURE */}
      <EditorialBlock
        variant="image-text"
        eyebrow="II — La teinture"
        title="L'indigo en trois bains"
        body={
          <>
            <p>
              L&apos;indigo est notre matière signature. Pas celui, industriel,
              qui déteint sur les doigts. Le vrai : celui qui se cultive, qui
              fermente, qui attend son heure dans des jarres enterrées.
            </p>
            <p>
              Le tissu est plongé trois fois, quarante-huit heures de séchage
              entre chaque bain. Entre chaque plongée, il est battu au pilon
              pour révéler son éclat. Les mains de nos teinturiers portent
              cette bleue tenace qui ne s&apos;en va jamais complètement.
            </p>
            <p>
              C&apos;est pour cela que nous ne pouvons produire que quelques
              pièces par semaine. C&apos;est aussi pour cela qu&apos;elles durent
              trois générations.
            </p>
          </>
        }
        image={{
          src: '/images/savoir-faire/teinture-indigo.svg',
          alt: 'Mains teintes d’indigo sortant le tissu du bain',
          caption: 'Troisième bain d’indigo — atelier de Thiès',
        }}
      />

      {/* QUOTE */}
      <EditorialBlock
        variant="quote"
        eyebrow="Parole de l'atelier"
        quote={{
          text: "L'indigo ne sèche jamais vraiment. Il vit dans le tissu, il respire, il s'assombrit au fil des années. C'est une couleur qui a une mémoire.",
          author: 'Amadou, maître teinturier',
        }}
      />

      {/* CHAPITRE III — LA BRODERIE */}
      <EditorialBlock
        variant="triptych"
        eyebrow="III — La broderie"
        title="Le fil qui dessine"
        images={[
          { src: '/images/savoir-faire/broderie-macro.svg', alt: 'Brodeuse au travail, vue de dos' },
          { src: '/images/products/kaftan-or.svg', alt: 'Macro du fil d’or sur bazin' },
          { src: '/images/products/kaftan-indigo.svg', alt: 'Pièce brodée achevée' },
        ]}
        body={
          <>
            <p>
              Nos brodeuses travaillent au fil de soie dorée ou argentée, jamais
              au polyester. Les motifs sont d&apos;abord dessinés à la main sur
              papier, puis reportés à la craie sur le tissu. C&apos;est seulement
              alors que l&apos;aiguille entre en scène.
            </p>
            <p>
              Une broderie complexe — celle d&apos;un plastron de cérémonie, par
              exemple — demande jusqu&apos;à trois semaines de travail
              ininterrompu. Deux cent quatre-vingts heures pour une seule pièce.
              Cela se voit. Cela se sent, au toucher.
            </p>
          </>
        }
      />

      {/* CHAPITRE IV — LA COUPE */}
      <EditorialBlock
        variant="text-image"
        eyebrow="IV — La coupe"
        title="Vingt-huit mesures"
        body={
          <>
            <p>
              La coupe est la partie la plus silencieuse de l&apos;atelier. La
              plus concentrée. Un kaftan sur-mesure demande vingt-huit mesures
              précises : épaules, poitrine, ceinture, hanches, mais aussi
              longueur de bras, tour de poignet, hauteur de col.
            </p>
            <p>
              Ces mesures sont archivées. Si vous revenez dix ans plus tard pour
              une seconde pièce, nous les consultons. Votre corps aura un peu
              changé. Nous prenons de nouvelles mesures, et les comparons.
              C&apos;est une forme d&apos;histoire intime.
            </p>
            <p>
              La coupe se fait à la craie, aux ciseaux d&apos;orfèvre, sur un
              tissu préalablement lissé. Elle est irréversible. Elle demande
              vingt ans d&apos;apprentissage.
            </p>
          </>
        }
        image={{
          src: '/images/savoir-faire/coupe-craie.svg',
          alt: 'Mains qui tracent à la craie sur tissu noir',
          caption: 'Tracé du patron — atelier principal, Dakar',
        }}
      />

      {/* CHAPITRE V — L'ASSEMBLAGE */}
      <EditorialBlock
        variant="full-image"
        eyebrow="V — L'assemblage"
        title="La patience devient pièce"
        image={{
          src: '/videos/hero-placeholder-poster.jpg',
          alt: "Atelier principal Chams Adams à Dakar, en activité",
          caption: "Atelier principal, Dakar. Photographie d'Aïssa Diatta.",
        }}
        body={
          <>
            <p>
              C&apos;est le dernier geste. Tout converge. La matière, la
              teinture, la broderie, la coupe se rejoignent entre les mains de
              la couturière finale. Elle assemble les pièces, pose les
              fermetures invisibles, ajuste les manches, vérifie chaque couture.
            </p>
            <p>
              Puis vient l&apos;essayage. Si la pièce n&apos;est pas parfaite,
              elle est reprise. Si elle l&apos;est, elle est repassée à la
              vapeur, pliée dans du papier de soie, rangée dans une housse
              Chams Adams. Elle attend d&apos;être remise.
            </p>
          </>
        }
      />

      {/* SECTION ARTISANS */}
      <section aria-labelledby="artisans-title" className="bg-noir py-[120px] md:py-[180px]">
        <div className="container-content">
          <header className="mb-16 flex flex-col gap-4">
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
              L&apos;atelier
            </span>
            <h2
              id="artisans-title"
              className="font-serif font-light text-ivoire text-[clamp(2rem,4vw,3.5rem)] leading-tight"
            >
              Les mains de la maison
            </h2>
          </header>
          <ul className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">
            {ARTISANS.map((a) => (
              <li key={a.name} className="flex flex-col gap-5">
                <ZoomReveal scale={[1, 1.12]} className="relative aspect-[3/4] w-full overflow-hidden">
                  <div className="relative h-full w-full">
                    <Image
                      src={a.image}
                      alt={`Portrait de ${a.name}`}
                      fill
                      sizes="(max-width: 768px) 90vw, 30vw"
                      className="object-cover"
                    />
                  </div>
                </ZoomReveal>
                <div className="flex flex-col gap-2">
                  <h3 className="font-serif font-light text-ivoire text-xl md:text-2xl">
                    {a.name}
                  </h3>
                  <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-or/80">
                    {a.specialty} · {a.years} ans d&apos;atelier
                  </p>
                </div>
                <blockquote className="font-serif italic text-ivoire/70 text-base leading-relaxed">
                  « {a.quote} »
                </blockquote>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-noir py-[120px]">
        <div className="container-content flex flex-col items-center gap-6 text-center">
          <h2 className="font-serif font-light text-ivoire text-[clamp(2rem,4vw,3rem)]">
            Composer votre pièce
          </h2>
          <p className="max-w-prose font-serif italic text-ivoire/75 text-lg md:text-xl">
            Chaque geste décrit ici peut être mis au service d&apos;une pièce
            unique composée pour vous.
          </p>
          <Link href="/sur-mesure" data-cursor="magnetic" className="btn-or mt-4">
            Découvrir le sur-mesure
          </Link>
        </div>
      </section>
    </>
  );
}
