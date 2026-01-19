export type DisplayCategoryKey =
  | "hoa-tuoi"
  | "huong-nen"
  | "hoa-qua"
  | "xoi-che"
  | "combo"
  | "chup-anh-le";

export interface DisplayCategoryDefinition {
  key: DisplayCategoryKey;
  name: string;
  route: string;
}

export const DISPLAY_CATEGORIES: DisplayCategoryDefinition[] = [
  { key: "hoa-tuoi", name: "Hoa Tươi", route: "/category/hoa-tuoi" },
  { key: "huong-nen", name: "Hương Nến", route: "/category/huong-nen" },
  { key: "hoa-qua", name: "Hoa Quả", route: "/category/hoa-qua" },
  { key: "xoi-che", name: "Xôi – Chè", route: "/category/xoi-che" },
  { key: "combo", name: "Combo Tiết Kiệm", route: "/category/combo" },
  { key: "chup-anh-le", name: "Chụp Ảnh Lễ", route: "/category/chup-anh-le" },
];
