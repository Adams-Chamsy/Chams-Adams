import {
  Droplet,
  WashingMachine,
  Wind,
  Thermometer,
  Sparkles,
  Ban,
  Sun,
  Shirt,
} from 'lucide-react';

type Picto = {
  icon: typeof Droplet;
  label: string;
};

/**
 * Pictogrammes d'entretien — code → (icône, libellé).
 * Codes définis pour Chams Adams : précis, lisibles, sans ambiguïté.
 *
 * Les codes sont stockés dans `products.care_pictos` (text[]) en BDD.
 */
const PICTOS: Record<string, Picto> = {
  'lavage-main': { icon: Droplet, label: 'Lavage à la main uniquement' },
  'lavage-30': { icon: WashingMachine, label: 'Machine 30 °C, cycle délicat' },
  'pas-machine': { icon: Ban, label: 'Lavage en machine interdit' },
  'pressing-conseille': { icon: Sparkles, label: 'Pressing conseillé' },
  'pas-seche-linge': { icon: Wind, label: 'Pas de sèche-linge' },
  'pas-javel': { icon: Ban, label: 'Pas d’eau de Javel' },
  'fer-doux': { icon: Thermometer, label: 'Fer à repasser doux' },
  'pas-fer': { icon: Ban, label: 'Ne pas repasser' },
  'sechage-ombre': { icon: Sun, label: 'Séchage à l’ombre' },
  broderies: { icon: Shirt, label: 'Broderies fragiles — manipuler avec soin' },
};

export function CarePictos({ codes }: { codes: string[] }) {
  const valid = codes
    .map((c) => {
      const def = PICTOS[c];
      return def ? { code: c, def } : null;
    })
    .filter((x): x is { code: string; def: Picto } => x !== null);
  if (valid.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-or">
        Entretien
      </span>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {valid.map(({ code, def }) => {
          const Icon = def.icon;
          return (
            <li
              key={code}
              className="flex items-start gap-3 border border-bronze/20 p-3"
            >
              <Icon
                className="mt-0.5 h-5 w-5 shrink-0 text-or"
                aria-hidden
              />
              <span className="font-serif text-xs leading-snug text-ivoire/80">
                {def.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
