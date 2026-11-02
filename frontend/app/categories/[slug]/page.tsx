import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryDetail from "../CategoryDetail";
import { tradeCategories } from "../categoryData";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return tradeCategories.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = tradeCategories.find((item) => item.slug === slug);
  return {
    title: category ? `${category.name} à Dakar` : "Catégorie introuvable",
    description: category?.description || "Découvrez les métiers du BTP proposés par HireBuilders à Dakar.",
  };
}

export default async function TradeCategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = tradeCategories.find((item) => item.slug === slug);
  if (!category) notFound();
  return <CategoryDetail category={category} />;
}
