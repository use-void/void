import { LucideIcon, Package, FileDigit } from "lucide-react";

export type ProductType = "physical" | "digital";

export interface ProductTypeConfig {
  id: ProductType;
  title: string;
  description: string;
  icon: LucideIcon;
  visibleSections: ProductEditorSection[];
  color?: string;
}

export type ProductEditorSection = 
  | "basic-info" 
  | "pricing" 
  | "inventory" 
  | "shipping" 
  | "digital-delivery"
  | "status"
  | "media"
  | "analytics";

export const PRODUCT_TYPES: Record<ProductType, ProductTypeConfig> = {
  physical: {
    id: "physical",
    title: "Physical Product",
    description: "Tangible items needing shipping & inventory.",
    icon: Package,
    visibleSections: ["basic-info", "pricing", "inventory", "shipping"],
  },
  digital: {
    id: "digital",
    title: "Digital Product",
    description: "Services, files, or downloadable content.",
    icon: FileDigit,
    visibleSections: ["basic-info", "pricing", "inventory", "digital-delivery"],
  },
};
