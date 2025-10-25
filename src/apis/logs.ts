import api from "@/lib/axios";

export type ClickCategory = "INGREDIENT" | "SUPPLEMENT" | "BRAND" | "PURPOSE";

export function logClick(clickedText: string, category: ClickCategory) {
  return api.get("/api/v1/logs/click", {
    params: { clickedText, category },
  });
}
