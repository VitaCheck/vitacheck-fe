import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { IngredientDetail } from "@/types/ingredient";
import { getUserInfo, type UserInfo } from "@/apis/user";

interface Props {
  id: string;
  data: IngredientDetail;
}

const IngredientInfo = ({ id, data }: Props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // 로그인 상태 및 사용자 프로필 확인
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsLoggedIn(true);
      fetchUserInfo();
    } else {
      setIsLoggedIn(false);
      setUserInfo(null);
    }
  }, []);

  const fetchUserInfo = async () => {
    if (!localStorage.getItem("accessToken")) return;
    try {
      const user = await getUserInfo();
      setUserInfo(user);
    } catch {
      setIsLoggedIn(false);
      setUserInfo(null);
    }
  };

  // 디버깅 로그 (필요시 유지)
  useEffect(() => {
    console.log("=== IngredientInfo 데이터 디버깅 ===");
    console.log("data:", data);
    console.log("================================");
  }, [data]);

  // 에러 코드 메시지
  const getDosageErrorMessage = (errorCode?: string): string => {
    switch (errorCode) {
      case "UNAUTHORIZED":
        return "로그인이 필요한 서비스입니다.";
      case "INGREDIENT_DOSAGE_NOT_FOUND":
        return "해당 성분의 권장 섭취량 정보가 없습니다.";
      case "INGREDIENT_DOSAGE_HAVE_NULL":
        return "권장 섭취량 정보가 일부 누락되었습니다.";
      default:
        return "";
    }
  };

  const getFoodErrorMessage = (errorCode?: string): string => {
    switch (errorCode) {
      case "INGREDIENT_FOOD_NOT_FOUND":
        return "해당 성분의 대체 식품 정보가 없습니다.";
      default:
        return "";
    }
  };

  // 섹션 표시는 항상
  const canShowDosageSection = () => true;

  // 유효 데이터(둘 다 존재) - 0도 유효값으로 인정 => != null 사용
  const hasValidDosageData = () =>
    !data.dosageErrorCode &&
    data.gender &&
    data.age != null &&
    data.upperLimit != null &&
    data.recommendedDosage != null;

  // 부분 데이터(하나만 존재)
  const hasPartialDosageData = () =>
    data.dosageErrorCode === "INGREDIENT_DOSAGE_HAVE_NULL" &&
    (data.recommendedDosage != null || data.upperLimit != null);

  const canShowDetailedDosage = () => isLoggedIn && hasValidDosageData();
  const canShowPartialDosage = () => isLoggedIn && hasPartialDosageData();

  const isUnauthorized = data.dosageErrorCode === "UNAUTHORIZED";
  const isNotFound = data.dosageErrorCode === "INGREDIENT_DOSAGE_NOT_FOUND";

  // 나이/성별 표기
  const getAgeGroup = (age: number): string => {
    if (age < 20) return "10대";
    if (age < 30) return "20대";
    if (age < 40) return "30대";
    if (age < 50) return "40대";
    if (age < 60) return "50대";
    return "60대 이상";
  };
  const getGenderText = (gender: string): string =>
    gender === "MALE" ? "남성" : "여성";

  if (!id) return <div className="px-5 py-10">잘못된 접근입니다.</div>;

  // 값 표시 유틸: null/undefined만 회색 null, 0은 정상 출력
  const renderValue = (val: number | null | undefined, unit?: string) =>
    val == null ? (
      <span className="text-gray-400 italic">null</span>
    ) : (
      `${val}${unit || "mg"}`
    );

  return (
    <div className="space-y-8 w-full px-4 sm:px-6 lg:px-8 mt-6">
      {/* 이름 + 설명 */}
      <section>
        <h2 className="font-semibold text-2xl mb-4">
          {data.name && data.name !== "NULL" && data.name !== "null"
            ? data.name
            : "이름 없음"}
        </h2>
        <p className="text-sm pb-6">
          {data.description &&
          data.description !== "NULL" &&
          data.description !== "null"
            ? data.description
            : "등록된 설명 정보가 없습니다."}
        </p>
      </section>

      {/* 효능 */}
      <section>
        <h2 className="font-semibold text-2xl pb-2">효능</h2>
        <p className="text-sm">
          {data.effect && data.effect !== "NULL" && data.effect !== "null"
            ? data.effect
            : "등록된 효능 정보가 없습니다."}
        </p>
        <div className="mt-4 border-b border-gray-300"></div>
      </section>

      {/* 부작용 및 주의사항 */}
      <section>
        <h2 className="font-semibold text-2xl mb-2">부작용 및 주의사항</h2>
        <div className="flex items-start gap-4">
          <div className="flex w-20 h-20">
            <img
              src="/images/PNG/성분 2-1/caution.png"
              alt="부작용 이미지"
              className="w-full h-full rounded-md"
            />
          </div>
          <div className="flex-1">
            {(() => {
              const cautionValue = data.caution;
              if (
                !cautionValue ||
                cautionValue.trim().toLowerCase() === "null" ||
                cautionValue.trim() === "" ||
                cautionValue.trim().toLowerCase() === "undefined"
              ) {
                return null;
              }
              return (
                <div className="space-y-1">
                  {cautionValue
                    .split(
                      /(?=\(가\)|\(나\)|\(다\)|\(라\)|\(마\)|\(바\)|\(사\)|\(아\)|\(자\)|\(차\))/g
                    )
                    .map((item, index) => (
                      <p key={index} className="text-sm leading-relaxed">
                        {item.trim()}
                      </p>
                    ))}
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* 권장 섭취량 */}
      {canShowDosageSection() && (
        <section>
          <h2 className="font-semibold text-2xl">
            {isLoggedIn && data.gender && data.age != null
              ? `${getAgeGroup(data.age!)} ${getGenderText(
                  data.gender!
                )} 권장 섭취량`
              : "권장 섭취량"}
          </h2>

          {/* 에러 메시지(로그인 후만 노출) */}
          {data.dosageErrorCode && isLoggedIn && (
            <div className="mt-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">
                {getDosageErrorMessage(data.dosageErrorCode)}
              </p>
            </div>
          )}

          {/* 로그인 미완료 → 블러 (PC: 제목 바로 밑 정렬/좌측 정렬, Mobile: 가운데) */}
          {!isLoggedIn ? (
            <div className="mt-3 md:mt-2">
              {/* 그래프 전체를 클릭 가능하게 */}
              <Link to="/login" className="block">
                <div className="relative w-full max-w-[400px] group cursor-pointer md:mx-0 mx-auto">
                  {/* 그래프 박스(오버레이와 정확히 겹치도록 하나의 컨테이너) */}
                  <div className="relative h-8 w-full rounded-full overflow-hidden">
                    {/* 배경 막대 */}
                    <div className="absolute inset-0 bg-gray-200" />
                    {/* 채워진 막대(예시) */}
                    <div
                      className="absolute left-0 top-0 h-full bg-[#FFE17E]"
                      style={{ width: "66.67%" }}
                      aria-hidden
                    />
                    {/* 블러/화이트 오버레이: 그래프와 정확히 일치 */}
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-full pointer-events-none" />
                    {/* 가운데 안내 문구 */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <p className="text-sm font-medium text-black">
                        로그인 후 확인해보세요!
                      </p>
                    </div>
                    {/* 호버 테두리 효과(데스크톱만 느낌) */}
                    <div className="absolute inset-0 border-2 border-transparent rounded-full group-hover:border-blue-300 transition-colors duration-200 pointer-events-none" />
                  </div>
                </div>
              </Link>

              {/* 안내 문구: 그래프 '아래'에 배치 */}
              <div className="mt-2 w-full max-w-[400px] md:mx-33 mx-auto md:text-left text-center">
                <p className="text-xs text-gray-600">
                  그래프 클릭하여 로그인하기
                </p>
              </div>
            </div>
          ) : isUnauthorized || isNotFound ? null : canShowDetailedDosage() ||
            canShowPartialDosage() ? (
            // 로그인 완료 & 데이터 존재(완전/부분 공통 그래프)
            <div className="mt-3 md:mt-2">
              <div className="relative w-full max-w-[400px] md:mx-0 mx-auto">
                {/* 막대 */}
                <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden w-full">
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-[#FFE17E] rounded-full"
                    style={{ width: "66.67%" }}
                    aria-hidden
                  />
                  {/* 마커 */}
                  <div
                    className="absolute top-0 bottom-0 border-l border-black border-dotted opacity-70"
                    style={{ left: "33.33%" }}
                    aria-hidden
                  />
                  <div
                    className="absolute top-0 bottom-0 border-l border-black border-dotted opacity-70"
                    style={{ left: "66.67%" }}
                    aria-hidden
                  />
                </div>

                {/* 라벨 */}
                <div
                  className="absolute text-sm font-medium text-black"
                  style={{
                    left: "33.33%",
                    transform: "translateX(-50%)",
                    top: "-24px",
                  }}
                >
                  권장
                </div>
                <div
                  className="absolute text-sm font-medium text-black"
                  style={{
                    left: "66.67%",
                    transform: "translateX(-50%)",
                    top: "-24px",
                  }}
                >
                  상한
                </div>

                {/* 수치 */}
                <div
                  className="absolute text-sm text-black"
                  style={{
                    left: "33.33%",
                    transform: "translateX(-50%)",
                    top: "40px",
                  }}
                >
                  {renderValue(data.recommendedDosage, data.unit)}
                </div>
                <div
                  className="absolute text-sm text-black"
                  style={{
                    left: "66.67%",
                    transform: "translateX(-50%)",
                    top: "40px",
                  }}
                >
                  {renderValue(data.upperLimit, data.unit)}
                </div>
              </div>
            </div>
          ) : null}
        </section>
      )}
    </div>
  );
};

export default IngredientInfo;
