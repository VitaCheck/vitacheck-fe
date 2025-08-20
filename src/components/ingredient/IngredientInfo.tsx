import { useState, useEffect } from "react";
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
    // 로그인 상태가 아닌 경우 API 호출하지 않음
    if (!localStorage.getItem("accessToken")) {
      return;
    }

    try {
      const user = await getUserInfo();
      setUserInfo(user);
    } catch (error) {
      setIsLoggedIn(false);
      setUserInfo(null);
    }
  };

  // 디버깅 로그
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

  // 부분 데이터(하나만 존재) - errorCode 명시 + 둘 중 하나라도 존재
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
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">
                {getDosageErrorMessage(data.dosageErrorCode)}
              </p>
            </div>
          )}

          {/* 로그인 미완료 → 블러 */}
          {!isLoggedIn ? (
            <div className="mt-6">
              <div className="relative w-full max-w-[400px]">
                <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden w-full">
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-[#FFE17E] rounded-full"
                    style={{ width: "66.67%" }}
                    aria-hidden
                  />
                </div>
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-full" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-sm font-medium text-black">
                    로그인 후 확인 해보세요!
                  </p>
                </div>
              </div>
            </div>
          ) : isUnauthorized || isNotFound ? null : canShowDetailedDosage() || // 로그인 완료 & 데이터 존재(완전/부분 공통 그래프) // 접속 권한 없음/데이터 없음 → 그래프 미노출
            canShowPartialDosage() ? (
            <div className="mt-6">
              <div className="relative w-full max-w-[400px]">
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

                {/* 수치: null/undefined만 회색 null, 0은 정상 출력 */}
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
