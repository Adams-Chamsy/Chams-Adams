import { HeroCinematic } from '@/components/sections/HeroCinematic';
import { ManifesteSection } from '@/components/sections/ManifesteSection';
import { CollectionsShowcase } from '@/components/sections/CollectionsShowcase';
import { SignaturePiece } from '@/components/sections/SignaturePiece';
import { FabricTransition } from '@/components/animations/FabricTransition';

export default function HomePage() {
  return (
    <>
      <HeroCinematic />
      <FabricTransition />
      <ManifesteSection />
      <CollectionsShowcase />
      <SignaturePiece />
      {/* Placeholder — étape 5 : Savoir-faire + Journal + Newsletter */}
      <div aria-hidden className="h-screen bg-noir" />
    </>
  );
}
