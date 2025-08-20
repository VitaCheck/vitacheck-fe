import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useTerms, type Term } from "@/apis/terms";

type Slug = "privacy" | "service" | "marketing";

/** 슬러그 기준으로 약관 선택 */
function pickTermBySlug(list: Term[], slug: Slug): Term | undefined {
  const find = (kw: string) => list.find((t) => t.title?.includes(kw));

  switch (slug) {
    case "privacy":
      return find("개인정보") || list.filter((t) => t.required)[1] || list[0];
    case "service":
      return (
        find("이용약관") ||
        find("서비스") ||
        list.filter((t) => t.required)[0] ||
        list[0]
      );
    case "marketing":
      return find("마케팅") || list.find((t) => !t.required) || list[0];
    default:
      return list[0];
  }
}

const TermsViewPage: React.FC = () => {
  const { slug = "privacy" } = useParams<{ slug: Slug }>();
  const { data: terms, isLoading, error } = useTerms();

  const picked = useMemo(
    () =>
      terms && terms.length ? pickTermBySlug(terms, slug as Slug) : undefined,
    [terms, slug]
  );

  if (isLoading) return <main className="p-6">약관을 불러오는 중...</main>;
  if (error)
    return (
      <main className="p-6 text-red-500">
        약관 조회 중 오류가 발생했습니다.
      </main>
    );
  if (!picked) return <main className="p-6">표시할 약관이 없습니다.</main>;

  const pageTitle =
    slug === "privacy"
      ? "개인정보 처리방침"
      : slug === "service"
        ? "서비스 이용약관"
        : "마케팅 이용 동의";

  return (
    <main className="mx-auto w-full max-w-3xl p-6">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold">{pageTitle}</h1>
        <p className="mt-1 text-sm text-gray-500">
          {picked.title} · 버전 {picked.version} · 시행일 {picked.effectiveDate}
        </p>
      </header>

      <article
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: picked.content }}
      />
    </main>
  );
};

export default TermsViewPage;
