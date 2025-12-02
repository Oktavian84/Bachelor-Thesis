import { getPageBySlug } from "@/data/loaders";
import { notFound } from "next/navigation";
import { BlockRenderer } from "@/components/BlockRenderer";

async function loader(slug: string) {
  const response = await getPageBySlug(slug);
  
  if (!response || !response.data) notFound();
  
  const data = response.data;
  
  if (!Array.isArray(data) || data.length === 0) notFound();
  
  const page = data[0];
  if (!page || !page.blocks) notFound();
  
  return { blocks: page.blocks };
}

interface PageProps {
  params: Promise<{ slug: string }>
}


export default async function DynamicPageRoute({ params }: PageProps) {
  const slug = (await params).slug;
  const { blocks } = await loader(slug);
  return <BlockRenderer blocks={blocks} />;
}