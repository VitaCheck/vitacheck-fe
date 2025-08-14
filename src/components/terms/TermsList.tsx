import React from "react";
import { useTerms } from "@/apis/terms";

const TermsList: React.FC = () => {
  const { data: terms, isLoading, error } = useTerms();

  if (isLoading) return <p>약관을 불러오는 중...</p>;
  if (error) return <p>약관을 불러오는 중 오류가 발생했습니다.</p>;

  return (
    <div>
      {terms && terms.length > 0 ? (
        terms.map((term) => (
          <div key={term.id} style={{ marginBottom: "2rem" }}>
            <h3>
              {term.title}{" "}
              {term.required && <span style={{ color: "red" }}>(필수)</span>}
            </h3>
            <p style={{ fontSize: "0.9rem", color: "#666" }}>
              버전 {term.version} | 시행일 {term.effectiveDate}
            </p>
            {/* HTML로 내려오는 경우 안전하게 표시 */}
            <div
              style={{
                padding: "1rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
                backgroundColor: "#fafafa",
              }}
              dangerouslySetInnerHTML={{ __html: term.content }}
            />
          </div>
        ))
      ) : (
        <p>등록된 약관이 없습니다.</p>
      )}
    </div>
  );
};

export default TermsList;
