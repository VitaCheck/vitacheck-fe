import { useState, useEffect } from "react";
import type { IngredientDetail } from "@/types/ingredient";

interface Props {
  id: string;
  data: IngredientDetail;
}

const IngredientInfo = ({ id, data }: Props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // 임시로 true로 설정해서 테스트
  const [userProfile, setUserProfile] = useState<{
    gender?: string;
    ageGroup?: string;
  }>({});

  // 로그인 상태 및 사용자 프로필 확인
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsLoggedIn(true);
      // 사용자 프로필 정보 가져오기 (실제 API 호출로 대체 가능)
      fetchUserProfile();
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      // 실제 API 호출로 대체
      // const response = await fetchUserProfileAPI();
      // setUserProfile(response.data);

      // 임시 데이터 (실제로는 API에서 받아옴)
      setUserProfile({
        gender: "여성",
        ageGroup: "20대",
      });
    } catch (error) {
      console.error("사용자 프로필 로드 실패:", error);
    }
  };

  if (!id) return <div className="px-5 py-10">잘못된 접근입니다.</div>;

  return (
    <div className="space-y-8 max-w-screen-md mx-auto px-5 py-5 sm:px-8">
      {/* 이름 + 설명 */}
      <section>
        <h2 className="font-semibold text-2xl">{data.name || "이름 없음"}</h2>
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
            <p className="text-sm">
              {data.caution || "부작용 정보가 없습니다."}
            </p>
          </div>
        </div>
      </section>

      {/* 권장 섭취량 */}
      <section>
        <h2 className="font-semibold text-2xl">
          {isLoggedIn && userProfile.ageGroup && userProfile.gender
            ? `${userProfile.ageGroup} ${userProfile.gender} 권장 섭취량`
            : "권장 섭취량"}
        </h2>

        {data.recommendedDosage && data.upperLimit ? (
          <div className="mt-6">
            {(() => {
              const recommended = Number(data.recommendedDosage);
              const upper = Number(data.upperLimit);
              const unit = data.unit || "mg";
              // 권장과 상한 지점을 그래프 길이의 1/3과 2/3으로 고정
              const recPos = 33.33; // 1/3 지점
              const upperPos = 66.67; // 2/3 지점
              const fmt = (v: number) =>
                Number(v).toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                });

              return (
                <div className="relative w-full">
                  {/* 막대 (회색 배경 + 노란색 채움) */}
                  <div
                    className={`relative h-8 bg-gray-200 rounded-full overflow-hidden ${!isLoggedIn ? "blur-md" : ""} w-full sm:w-4/5 lg:w-3/4`}
                  >
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-[#FFE17E] rounded-full"
                      style={{ width: `${upperPos}%` }}
                      aria-hidden
                    />

                    {/* 권장 라벨 - 로그인 후에만 표시 */}
                    {isLoggedIn && (
                      <div
                        className="absolute -top-6 text-sm font-medium text-black z-10"
                        style={{
                          left: `${recPos}%`,
                          transform: "translateX(-50%)",
                        }}
                      >
                        권장
                      </div>
                    )}

                    {/* 상한 라벨 - 로그인 후에만 표시 */}
                    {isLoggedIn && (
                      <div
                        className="absolute -top-6 text-sm font-medium text-black z-10"
                        style={{
                          left: `${upperPos}%`,
                          transform: "translateX(-50%)",
                        }}
                      >
                        상한
                      </div>
                    )}

                    {/* 점선 마커: 권장 / 상한 */}
                    <div
                      className="absolute top-0 bottom-0 border-l border-black border-dotted opacity-70"
                      style={{ left: `${recPos}%` }}
                      aria-hidden
                    />
                    <div
                      className="absolute top-0 bottom-0 border-l border-black border-dotted opacity-70"
                      style={{ left: `${upperPos}%` }}
                      aria-hidden
                    />
                  </div>

                  {/* 하단 수치 */}
                  <div
                    className={`absolute -bottom-6 text-sm ${!isLoggedIn ? "blur-md" : ""}`}
                    style={{
                      left: `${recPos}%`,
                      transform: "translateX(-50%)",
                    }}
                  >
                    {fmt(recommended)}
                    {unit}
                  </div>
                  <div
                    className={`absolute -bottom-6 text-sm ${!isLoggedIn ? "blur-md" : ""}`}
                    style={{
                      left: `${upperPos}%`,
                      transform: "translateX(-50%)",
                    }}
                  >
                    {fmt(upper)}
                    {unit}
                  </div>

                  {/* 로그인 전 메시지 오버레이 - 그래프 위에 직접 표시 */}
                  {!isLoggedIn && (
                    <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center pointer-events-none">
                      <p className="text-black font-medium text-sm">
                        로그인 후 확인해보세요!
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        ) : (
          <p className="text-sm text-gray-500 mt-2">
            권장 섭취량 정보가 등록되지 않았습니다.
          </p>
        )}
      </section>
    </div>
  );
};

export default IngredientInfo;
