import { HeroCinematic } from '@/components/sections/HeroCinematic';
import { ManifesteSection } from '@/components/sections/ManifesteSection';
import { CollectionsShowcase } from '@/components/sections/CollectionsShowcase';
import { SignaturePiece } from '@/components/sections/SignaturePiece';
import { SavoirFaireSection } from '@/components/sections/SavoirFaireSection';
import { JournalPreview } from '@/components/sections/JournalPreview';
import { NewsletterSection } from '@/components/sections/NewsletterSection';
import { FabricTransition } from '@/components/animations/FabricTransition';

/**
 * Home — séquence finale de l'étape 5.
 *
 * Flux narratif :
 *  1. Entrée cinématique (Hero)
 *  2. Manifeste — respire, pose le ton
 *  3. Univers — défilé horizontal des 4 collections
 *  4. Pièce signature — L'Aïcha (rotation 360°)
 *  5. Savoir-faire — 3 métiers, humain et chiffré
 *  6. Journal — 3 articles éditoriaux en grille asymétrique
 *  7. Newsletter — correspondances mensuelles
 *
 * Transitions <FabricTransition> volontairement sobres (2 au total) :
 *  - Entre Hero et Manifeste (marque la bascule vers le récit)
 *  - Entre SignaturePiece et SavoirFaire (flip : referme le défilé objet
 *    et ouvre le chapitre humain)
 */
export default function HomePage() {
  return (
    <>
      <HeroCinematic />
      <FabricTransition />
      <ManifesteSection />
      <CollectionsShowcase />
      <SignaturePiece />
      <FabricTransition flip />
      <SavoirFaireSection />
      <JournalPreview />
      <NewsletterSection />
    </>
  );
}
