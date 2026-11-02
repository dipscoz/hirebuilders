export type TradeCategory = {
  name: string;
  slug: string;
  intro: string;
  description: string;
  aliases: string[];
};

export const tradeCategories: TradeCategory[] = [
  {
    name: "Maçon",
    slug: "macon",
    intro: "Murs, dalles et travaux de maçonnerie",
    description: "Consultez les profils de maçons pour vos travaux de construction, de rénovation, de murs, de fondations ou de dalles.",
    aliases: ["macon", "maconnerie", "maçonnerie", "macons"],
  },
  {
    name: "Électricien",
    slug: "electricien",
    intro: "Installation, câblage et dépannage électrique",
    description: "Parcourez les profils d’électriciens pour vos installations, travaux de câblage, éclairage ou demandes de dépannage.",
    aliases: ["electricien", "electricienne", "electricite", "électricité"],
  },
  {
    name: "Plombier",
    slug: "plombier",
    intro: "Réseaux d’eau, sanitaires et réparations",
    description: "Trouvez un profil de plomberie pour vos besoins en installation sanitaire, réseau d’eau ou réparation.",
    aliases: ["plombier", "plomberie", "plombiers"],
  },
  {
    name: "Peintre",
    slug: "peintre",
    intro: "Peinture intérieure, extérieure et finitions",
    description: "Consultez les profils de peintres pour vos travaux de peinture et de finition, à l’intérieur comme à l’extérieur.",
    aliases: ["peintre", "peinture", "peintres"],
  },
  {
    name: "Carreleur",
    slug: "carreleur",
    intro: "Carrelage et revêtements de sols et de murs",
    description: "Parcourez les profils de carreleurs pour la pose de carrelage, de faïence et d’autres revêtements.",
    aliases: ["carreleur", "carrelage", "carreleurs", "faience"],
  },
  {
    name: "Menuisier",
    slug: "menuisier",
    intro: "Portes, fenêtres et aménagements en bois",
    description: "Découvrez les profils de menuisiers pour vos besoins de fabrication, de pose ou d’aménagement en bois.",
    aliases: ["menuisier", "menuiserie", "menuisiers", "bois"],
  },
];

export function normalizeTrade(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr")
    .trim();
}
