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
      <section>
        <h2 className="font-semibold text-2xl">
          {isLoggedIn && userProfile.ageGroup && userProfile.gender
            ? `${userProfile.ageGroup} ${userProfile.gender} 권장 섭취량`
            : "권장 섭취량"}
        </h2>

        {/* 테스트용 그래프 - 항상 표시 */}
        <div className="mt-6">
          <div className="relative w-full max-w-[400px]">
            {/* 막대 (회색 배경 + 노란색 채움) */}
            <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden w-full">
              <div
                className="absolute left-0 top-0 bottom-0 bg-[#FFE17E] rounded-full"
                style={{ width: "66.67%" }}
                aria-hidden
              />

              {/* 점선 마커: 권장 / 상한 */}
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

            {/* 하단 수치 */}
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

        {/* 기존 조건부 렌더링 제거 */}
      </section>
    </div>
  );
};

export default IngredientInfo;
