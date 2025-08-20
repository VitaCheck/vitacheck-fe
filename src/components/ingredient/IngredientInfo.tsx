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

  // data props 변경 시마다 콘솔에 출력
  useEffect(() => {
    console.log("=== IngredientInfo 데이터 디버깅 ===");
    console.log("전체 data 객체:", data);
    console.log("data.gender:", data.gender);
    console.log("data.age:", data.age);
    console.log("data.gender 타입:", typeof data.gender);
    console.log("data.age 타입:", typeof data.age);
    console.log("data.recommendedDosage:", data.recommendedDosage);
    console.log("data.upperLimit:", data.upperLimit);
    console.log("data.unit:", data.unit);
    console.log("=== 에러 코드 디버깅 ===");
    console.log("data.dosageErrorCode:", data.dosageErrorCode);
    console.log("data.foodErrorCode:", data.foodErrorCode);
    console.log("================================");
  }, [data]);

  // 에러 코드에 따른 메시지 반환
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

  // 권장 섭취량 섹션을 렌더링할 수 있는지 확인
  const canShowDosageSection = () => {
    // 항상 표시 (에러가 있어도 사용자에게 상황을 알려야 함)
    return true;
  };

  // 권장 섭취량 데이터가 유효한지 확인
  const hasValidDosageData = () => {
    // API에서 정상적으로 데이터가 제공된 경우
    if (
      !data.dosageErrorCode &&
      data.gender &&
      data.age &&
      data.upperLimit &&
      data.recommendedDosage
    ) {
      return true;
    }
    return false;
  };

  // 로그인 후 권장 섭취량을 표시할 수 있는지 확인
  const canShowDetailedDosage = () => {
    return isLoggedIn && hasValidDosageData();
  };

  const fetchUserInfo = async () => {
    try {
      const user = await getUserInfo();
      console.log("=== 사용자 정보 디버깅 ===");
      console.log("전체 user 객체:", user);
      console.log("user.age:", user.age);
      console.log("user.provider:", user.provider);
      console.log("==========================");
      setUserInfo(user);
    } catch (error) {
      console.error("사용자 정보 로드 실패:", error);
      setIsLoggedIn(false);
      setUserInfo(null);
    }
  };

  // 나이 그룹 계산 함수
  const getAgeGroup = (age: number): string => {
    if (age < 20) return "10대";
    if (age < 30) return "20대";
    if (age < 40) return "30대";
    if (age < 50) return "40대";
    if (age < 60) return "50대";
    return "60대 이상";
  };

  // 성별 한글 변환 함수
  const getGenderText = (gender: string): string => {
    return gender === "MALE" ? "남성" : "여성";
  };

  if (!id) return <div className="px-5 py-10">잘못된 접근입니다.</div>;

  return (
    <div className="space-y-8 w-full px-4 sm:px-6 lg:px-8">
      {/* 이름 + 설명 */}
      <section>
        <h2 className="font-semibold text-2xl mb-4">
          {data.name || "이름 없음"}
        </h2>
        <p className="text-sm pb-6">{data.description || "설명 없음"}</p>
      </section>

      {/* 효능 */}
      <section>
        <h2 className="font-semibold text-2xl pb-2">효능</h2>
        <p className="text-sm">
          {data.effect || "등록된 효능 정보가 없습니다."}
        </p>
        {/* 회색 밑줄 */}
        <div className="mt-4 border-b border-gray-300"></div>
      </section>

      {/* 부작용 및 주의사항 */}
      <section>
        <h2 className="font-semibold text-2xl mb-2">부작용 및 주의사항</h2>
        <div className="flex items-start gap-4">
          {/* 왼쪽 이미지 */}
          <div className="flex w-20 h-20">
            <img
              src="/images/PNG/성분 2-1/caution.png"
              alt="부작용 이미지"
              className="w-full h-full rounded-md"
            />
          </div>
          {/* 오른쪽 텍스트 영역 */}
          <div className="flex-1">
            {(() => {
              const cautionValue = data.caution;
              console.log("부작용 데이터:", cautionValue, typeof cautionValue);

              // API에서 "NULL" 문자열이 들어올 때 완전히 제거
              if (
                !cautionValue ||
                cautionValue === "NULL" ||
                cautionValue === "null" ||
                cautionValue === "" ||
                cautionValue === "undefined" ||
                cautionValue === "Null" ||
                cautionValue === "Null" ||
                String(cautionValue).toLowerCase() === "null"
              ) {
                return <div style={{ display: "none" }}></div>; // 완전히 숨김
              }

              return <p className="text-sm">{cautionValue}</p>;
            })()}
          </div>
        </div>
      </section>

      {/* 권장 섭취량 */}
      {canShowDosageSection() && (
        <section>
          <h2 className="font-semibold text-2xl">
            {canShowDetailedDosage()
              ? `${getAgeGroup(data.age!)} ${getGenderText(data.gender!)} 권장 섭취량`
              : "권장 섭취량"}
          </h2>

          {/* 에러 메시지 표시 */}
          {data.dosageErrorCode && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">
                {getDosageErrorMessage(data.dosageErrorCode)}
              </p>
            </div>
          )}

          {/* 권장 섭취량 그래프 또는 블러 처리 */}
          {canShowDetailedDosage() ? (
            // 로그인 후: 실제 그래프 표시 (현재 그래프와 동일하게 고정)
            <div className="mt-6">
              <div className="relative w-full max-w-[400px]">
                {/* 막대 (회색 배경 + 노란색 채움) - 고정 형태 */}
                <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden w-full">
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-[#FFE17E] rounded-full"
                    style={{ width: "66.67%" }}
                    aria-hidden
                  />

                  {/* 점선 마커: 권장 / 상한 - 고정 위치 */}
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

                {/* 권장 라벨 - 막대 아래에 별도 배치 */}
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

                {/* 상한 라벨 - 막대 아래에 별도 배치 */}
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

                {/* 하단 수치 - API 데이터 사용 */}
                <div
                  className="absolute text-sm text-black"
                  style={{
                    left: "33.33%",
                    transform: "translateX(-50%)",
                    top: "40px",
                  }}
                >
                  {data.recommendedDosage
                    ? `${data.recommendedDosage}${data.unit || "mg"}`
                    : "0.6mg"}
                </div>
                <div
                  className="absolute text-sm text-black"
                  style={{
                    left: "66.67%",
                    transform: "translateX(-50%)",
                    top: "40px",
                  }}
                >
                  {data.upperLimit
                    ? `${data.upperLimit}${data.unit || "mg"}`
                    : "50mg"}
                </div>
              </div>
            </div>
          ) : (
            // 로그인 전 또는 데이터 없음: 블러 효과와 로그인 안내 메시지
            <div className="mt-6">
              <div className="relative w-full max-w-[400px]">
                {/* 막대 (회색 배경 + 노란색 채움) - 형태만 표시 */}
                <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden w-full">
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-[#FFE17E] rounded-full"
                    style={{ width: "66.67%" }}
                    aria-hidden
                  />
                </div>

                {/* 블러 효과 오버레이 */}
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-full" />

                {/* 로그인 안내 메시지 */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-sm font-medium text-black">
                    로그인 후 확인 해보세요!
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default IngredientInfo;
