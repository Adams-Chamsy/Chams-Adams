import { HeroCinematic } from '@/components/sections/HeroCinematic';
import { ManifesteSection } from '@/components/sections/ManifesteSection';
import { FabricTransition } from '@/components/animations/FabricTransition';

export default function HomePage() {
  return (
    <>
      <HeroCinematic />
      <FabricTransition />
      <ManifesteSection />
      {/* Placeholder — étape 4 : HorizontalScroll des collections */}
      <div aria-hidden className="h-screen bg-noir" />
    </>
  );
}
