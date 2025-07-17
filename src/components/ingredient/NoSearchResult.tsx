import noResultCat from "../../assets/NoResultCat.png";

const NoSearchResult = () => {
  return (
    <div className="flex flex-col items-center justify-center py-30">
      <img
        src={noResultCat}
        alt="검색 결과 없음 캐릭터"
        className="w-36 h-36 mb-10"
      />
      <p className="text-gray-500 text-sm font-medium">일치하는 검색 결과가 없습니다.</p>
    </div>
  );
};

export default NoSearchResult;
