import CategoryDetail from "../CategoryDetail";
import { normalizeTrade, tradeCategories } from "../categoryData";
import { notFound, redirect } from "next/navigation";

type PageProps = {
  searchParams: Promise<{ metier?: string | string[] }>;
};

export default async function LegacyTradePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const requested = Array.isArray(params.metier) ? params.metier[0] : params.metier;
  if (!requested) redirect("/categories");
  const normalized = normalizeTrade(requested || "");
  const category = tradeCategories.find((item) =>
    normalizeTrade(item.name) === normalized ||
    item.aliases.some((alias) => normalizeTrade(alias) === normalized),
  );
  if (!category) notFound();
  return <CategoryDetail category={category} />;
}
