import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../ProductCard";
import { getUserInfo, type UserInfo } from "@/apis/user";
import {
  getPopularSupplementsByAge,
  type SupplementSummary,
  type Gender,
} from "@/apis/mainsupplements";
import { isAxiosError } from "axios";

const ageOptions = ["10대", "20대", "30대", "40대", "50대", "60대 이상"];

const ProductList = () => {
  const [selectedAge, setSelectedAge] = useState<string>("20대");
  const [gender, setGender] = useState<Gender>("ALL"); // 👈 기본 ALL
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [items, setItems] = useState<SupplementSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // PC 전용 페이지네이션
  const [currentPage, setCurrentPage] = useState<number>(0);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const paginatedItems = items.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  const mapAgeToGroup = (age: number): string => {
    if (age < 20) return "10대";
    if (age < 30) return "20대";
    if (age < 40) return "30대";
    if (age < 50) return "40대";
    if (age < 60) return "50대";
    return "60대 이상";
  };

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 최초 접속 시 사용자 나이/성별 → 기본 세팅 (비로그인/오류 무시)
  useEffect(() => {
    const fetchUserAgeGroup = async () => {
      try {
        const user: UserInfo = await getUserInfo();
        if (typeof user.age === "number") {
          setSelectedAge(mapAgeToGroup(user.age));
        }
        if (user.gender === "MALE" || user.gender === "FEMALE") {
          setGender(user.gender);
        } else {
          setGender("ALL");
        }
      } catch {
        // 비로그인/오류 시 ALL 유지
        setGender("ALL");
      }
    };
    fetchUserAgeGroup();
  }, []);

  // 나이대/성별 변경 시 인기 영양제 재조회
  useEffect(() => {
    let ignore = false;
    const fetchPopular = async () => {
      try {
        setLoading(true);
        setLoadError(null);
        const data = await getPopularSupplementsByAge({
          ageGroup: selectedAge,
          gender,
          page: 0,
          size: 10,
        });
        if (!ignore) {
          setItems(data.result.content);
          setCurrentPage(0);
        }
      } catch (err) {
        console.log(err);
        if (!ignore) {
          if (isAxiosError(err) && err.response?.status === 401) {
            setLoadError("로그인 후 확인이 가능합니다.");
          } else {
            setLoadError("인기 영양제 목록을 불러오지 못했습니다.");
          }
          setItems([]);
          setCurrentPage(0);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    fetchPopular();
    return () => {
      ignore = true;
    };
  }, [selectedAge, gender]);

  const handleNextPage = () => {
    setCurrentPage((p) => Math.min(p + 1, Math.max(totalPages - 1, 0)));
  };
  const handlePrevPage = () => {
    setCurrentPage((p) => Math.max(p - 1, 0));
  };

  return (
    <section className="px-[7%] lg:px-[16%] pb-25">
      {/* 상단 영역 */}
      <div className="flex items-center justify-between mb-4">
        {/* 왼쪽: 타이틀 + 드롭다운 */}
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">
            <span className="text-2xl">🔥 인기 영양제</span>
          </h2>

          {/* 나이대 드롭다운 */}
          <div
            className={`relative cursor-pointer ${
              selectedAge === "60대 이상" ? "w-[110px]" : "w-[85px]"
            }`}
            onClick={() => setOpen((prev) => !prev)}
            ref={dropdownRef}
            aria-label="나이대 선택"
          >
            <div className="flex items-center justify-between text-sm rounded-full px-3 py-[6px] bg-white border border-[#AAAAAA]">
              <span>{selectedAge}</span>
              <svg
                className={`w-4 h-4 ml-2 text-black transition-transform duration-200 ${
                  open ? "rotate-180" : ""
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {open && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded shadow z-10">
                {ageOptions.map((option) => (
                  <div
                    key={option}
                    className={`px-3 py-2 hover:bg-gray-100 text-sm ${
                      selectedAge === option ? "bg-gray-100 font-semibold" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAge(option);
                      setOpen(false);
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => navigate("/bestsupplement")}
          className="text-sm text-[#000000] cursor-pointer hover:text-gray-500 pr-3"
        >
          더보기 &gt;
        </button>
      </div>

      {/* 상태 뷰 */}
      {loading && (
        <div className="py-6 text-sm text-[#797979]">불러오는 중입니다…</div>
      )}
      {loadError && (
        <div className="py-6 text-sm text-red-600">{loadError}</div>
      )}
      {!loading && !loadError && items.length === 0 && (
        <div className="py-6 text-sm text-[#797979]">
          해당 나이대의 인기 영양제가 없습니다.
        </div>
      )}

      {/* 모바일: 가로 스크롤 리스트 */}
      {!loading && !loadError && items.length > 0 && (
        <div className="sm:hidden">
          <div className="flex overflow-x-auto gap-3 hide-scrollbar">
            {items.map((it) => (
              <ProductCard
                key={it.supplementId}
                id={it.supplementId}
                imageSrc={it.imageUrl}
                name={it.supplementName}
                widthClass="w-[110px]"
                heightClass="h-[100px]"
                fontSizeClass="text-[15px]"
              />
            ))}
          </div>
        </div>
      )}

      {/* PC: 4개 그리드 + 화살표 버튼 */}
      {!loading && !loadError && items.length > 0 && (
        <div className="relative hidden sm:block">
          <div className="grid grid-cols-4 gap-x-1 lg:gap-x-10 xl:gap-x-30">
            {paginatedItems.map((it) => (
              <ProductCard
                key={it.supplementId}
                id={it.supplementId}
                imageSrc={it.imageUrl}
                name={it.supplementName}
                widthClass="w-full"
                heightClass="h-[160px]"
                fontSizeClass="text-[20px]"
              />
            ))}
          </div>

          {currentPage < totalPages - 1 && totalPages > 1 && (
            <button
              type="button"
              onClick={handleNextPage}
              className="absolute right-[-25px] top-[55px] z-10 w-[49px] h-[49px] bg-white rounded-full shadow flex items-center justify-center"
              aria-label="다음 페이지"
            >
              <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]">
                <path
                  d="M9 18l6-6-6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}

          {currentPage > 0 && (
            <button
              type="button"
              onClick={handlePrevPage}
              className="absolute left-[-25px] top-[55px] z-10 w-[49px] h-[49px] bg-white rounded-full shadow flex items-center justify-center"
              aria-label="이전 페이지"
            >
              <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]">
                <path
                  d="M15 6l-6 6 6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default ProductList;
