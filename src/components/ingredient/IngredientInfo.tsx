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

  const canShowDosageSection = () => true;

  const hasValidDosageData = () =>
    !data.dosageErrorCode &&
    data.gender &&
    data.age != null &&
    data.upperLimit != null &&
    data.recommendedDosage != null;

  const hasPartialDosageData = () =>
    data.dosageErrorCode === "INGREDIENT_DOSAGE_HAVE_NULL" &&
    (data.recommendedDosage != null || data.upperLimit != null);

  const canShowDetailedDosage = () => isLoggedIn && hasValidDosageData();
  const canShowPartialDosage = () => isLoggedIn && hasPartialDosageData();

  const isUnauthorized = data.dosageErrorCode === "UNAUTHORIZED";
  const isNotFound = data.dosageErrorCode === "INGREDIENT_DOSAGE_NOT_FOUND";

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

  return (
    <div className="space-y-8 w-full px-4 sm:px-6 lg:px-8 mt-6">
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

      <section>
        <h2 className="font-semibold text-2xl pb-2">효능</h2>
        <p className="text-sm">
          {data.effect && data.effect !== "NULL" && data.effect !== "null"
            ? data.effect
            : "등록된 효능 정보가 없습니다."}
        </p>
        <div className="mt-4 border-b border-gray-300"></div>
      </section>

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
            {data.caution &&
              !["", "null", "undefined"].includes(
                data.caution.trim().toLowerCase()
              ) && (
                <div className="space-y-1">
                  {data.caution
                    .split(
                      /(?=\(가\)|\(나\)|\(다\)|\(라\)|\(마\)|\(바\)|\(사\)|\(아\)|\(자\)|\(차\))/g
                    )
                    .map((item, index) => (
                      <p key={index} className="text-sm leading-relaxed">
                        {item.trim()}
                      </p>
                    ))}
                </div>
              )}
          </div>
        </div>
      </section>

      {canShowDosageSection() && (
        <section>
          <h2 className="font-semibold text-2xl">
            {isLoggedIn && data.gender && data.age != null
              ? `${getAgeGroup(data.age!)} ${getGenderText(
                  data.gender!
                )} 권장 섭취량`
              : "권장 섭취량"}
          </h2>

          {data.dosageErrorCode &&
            isLoggedIn &&
            data.dosageErrorCode !== "INGREDIENT_DOSAGE_NOT_FOUND" && (
              <div className="mt-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">
                  {getDosageErrorMessage(data.dosageErrorCode)}
                </p>
              </div>
            )}

          {!isLoggedIn ? (
            <div className="mt-3 md:mt-2">
              <Link to="/login" className="block">
                <div className="relative w-full max-w-[400px] group cursor-pointer md:mx-0 mx-auto">
                  <div className="relative h-8 w-full rounded-full overflow-hidden">
                    <div className="absolute inset-0 bg-gray-200" />
                    <div
                      className="absolute left-0 top-0 h-full bg-[#FFE17E]"
                      style={{ width: "66.67%" }}
                      aria-hidden
                    />
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-full pointer-events-none" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <p className="text-sm font-medium text-black">
                        로그인 후 확인해보세요!
                      </p>
                    </div>
                    <div className="absolute inset-0 border-2 border-transparent rounded-full group-hover:border-blue-300 transition-colors duration-200 pointer-events-none" />
                  </div>
                </div>
              </Link>
              <div className="mt-2 w-full max-w-[400px] md:mx-33 mx-auto md:text-left text-center">
                <p className="text-xs text-gray-600">
                  그래프 클릭하여 로그인하기
                </p>
              </div>
            </div>
          ) : isUnauthorized ? null : (
            (() => {
              // dosageErrorCode에 따른 처리
              if (data.dosageErrorCode === "INGREDIENT_DOSAGE_NOT_FOUND") {
                // 해당 성분의 상한과 권장량 데이터 아예 없음
                return (
                  <div className="mt-8 md:mt-10">
                    <div className="relative w-full max-w-[400px] md:mx-0 mx-auto">
                      <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden w-full">
                        {/* 회색 바만 표시 (채움 0%) */}
                      </div>
                      <div className="text-center mt-4">
                        <p className="text-gray-500 text-sm">
                          해당 성분의 권장 섭취량 정보가 없습니다.
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }

              // 기존 로직 유지 (데이터가 잘 받아올 때)
              const hasRec =
                data.recommendedDosage != null && data.recommendedDosage !== 0;
              const hasUpper = data.upperLimit != null && data.upperLimit !== 0;
              const unit = data.unit || "mg";

              // 노란색 바 너비 계산
              let fillWidth = "0%";
              if (hasRec && hasUpper) {
                // 둘 다 있음: 기존과 동일하게 66.67%
                fillWidth = "66.67%";
              } else if (hasUpper) {
                // 상한만 있음: 66.67%
                fillWidth = "66.67%";
              } else if (hasRec) {
                // 권장만 있음: 33.33%
                fillWidth = "33.33%";
              }
              // 둘 다 없음: 0% (회색 바만)

              return (
                <div className="mt-12 md:mt-10">
                  <div className="relative w-full max-w-[400px] md:mx-0 mx-auto">
                    <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden w-full">
                      {/* 노란색 바 */}
                      <div
                        className="absolute left-0 top-0 bottom-0 bg-[#FFE17E] rounded-full"
                        style={{ width: fillWidth }}
                        aria-hidden
                      />

                      {/* 권장 점선 - 권장 데이터가 있을 때만 표시 */}
                      {hasRec && (
                        <div
                          className="absolute top-0 bottom-0 border-l border-black border-dotted opacity-70"
                          style={{ left: "33.33%" }}
                          aria-hidden
                        />
                      )}

                      {/* 상한 점선 - 상한 데이터가 있을 때만 표시 */}
                      {hasUpper && (
                        <div
                          className="absolute top-0 bottom-0 border-l border-black border-dotted opacity-70"
                          style={{ left: "66.67%" }}
                          aria-hidden
                        />
                      )}
                    </div>

                    {/* 권장 라벨 - 권장 데이터가 있을 때만 표시 */}
                    {hasRec && (
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
                    )}

                    {/* 상한 라벨 - 상한 데이터가 있을 때만 표시 */}
                    {hasUpper && (
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
                    )}

                    {/* 권장 수치 - 권장 데이터가 있을 때만 표시 */}
                    {hasRec && (
                      <div
                        className="absolute text-sm text-black"
                        style={{
                          left: "33.33%",
                          transform: "translateX(-50%)",
                          top: "40px",
                        }}
                      >
                        {`${data.recommendedDosage}${unit}`}
                      </div>
                    )}

                    {/* 상한 수치 - 상한 데이터가 있을 때만 표시 */}
                    {hasUpper && (
                      <div
                        className="absolute text-sm text-black"
                        style={{
                          left: "66.67%",
                          transform: "translateX(-50%)",
                          top: "40px",
                        }}
                      >
                        {`${data.upperLimit}${unit}`}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()
          )}
        </section>
      )}
      {/* 모바일에서 맨 아래 여백 추가 */}
      <div className="pb-16 md:pb-8"></div>
    </div>
  );
};

export default IngredientInfo;
