import { useState, useMemo } from 'react';
import clsx from 'clsx';
import boxIcon from '../../assets/box.png';
import checkboxIcon from '../../assets/check box.png';

interface Product {
  supplementId: number;
  supplementName: string;
  imageUrl: string;
  price: number;
  description: string;
  method: string;
  caution: string;
  brandName: string;
  ingredients: {
    ingredientName: string;
    amount: number;
    unit: string;
  }[];
}

interface Props {
  item: Product;
  isSelected: boolean;
  onToggle: () => void;
}

export default function CombinationProductCard({ item, isSelected, onToggle }: Props) {
  // 모바일/PC 임계 길이 분리
  const isLongNameMobile = useMemo(() => item.supplementName.length > 18, [item.supplementName]);
  const isLongNamePC = useMemo(() => item.supplementName.length > 24, [item.supplementName]);

  return (
    <>
      {/* 모바일 카드 */}
      <div
        onClick={onToggle}
        className={clsx(
          'relative box-border cursor-pointer md:hidden',
          isSelected ? 'bg-[#EFEFEF]' : 'bg-white',
          'aspect-square w-full min-w-0 rounded-[13px] p-4 pt-8 shadow-md',
        )}
      >
        <img
          src={isSelected ? checkboxIcon : boxIcon}
          alt="check"
          onClick={(e) => e.stopPropagation()}
          className="absolute top-[12px] left-[12px] h-[30px] w-[30px] cursor-pointer"
        />
        <img
          src={item.imageUrl}
          alt={item.supplementName}
          className="mx-auto -mt-2 h-[80px] w-[80px] object-contain"
        />
        {/* 텍스트: 두 줄 고정 + 말줄임 */}
        <div className="mt-2 flex min-h-[36px] items-center justify-center px-2">
          <p
            className={clsx(
              'font-Pretendard text-center text-[13px] leading-[140%] font-medium tracking-[-0.02em]',
              'line-clamp-2 overflow-hidden break-words break-keep',
            )}
          >
            {item.supplementName}
          </p>
        </div>
      </div>

      {/* PC 카드 */}
      <div
        onClick={onToggle}
        className={clsx(
          'relative box-border hidden flex-col items-center justify-start md:flex',
          isSelected ? 'bg-[#EEEEEE]' : 'bg-white',
          // 👇 고정 크기 + 넘침 방지
          'h-[200px] w-[200px] overflow-hidden rounded-[25px] p-3 shadow-[2px_3px_12.4px_0px_rgba(0,0,0,0.16)] hover:shadow-lg',
        )}
        title={item.supplementName}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className={clsx(
            'absolute top-[10px] right-[15px] text-[#1C1B1F]',
            isSelected ? 'mt-2 text-[20px] font-bold' : 'text-[30px]',
          )}
          aria-label={isSelected ? '제거' : '추가'}
        >
          {isSelected ? '—' : '+'}
        </button>

        {/* 이미지 영역: 고정 높이 박스 안에서 가운데 정렬 */}
        <div className="mt-4 flex h-[120px] w-full items-center justify-center">
          <img
            src={item.imageUrl}
            alt={item.supplementName}
            className="max-h-[100px] max-w-[120px] object-contain"
          />
        </div>

        {/* 텍스트: 고정 높이(두 줄) */}
        <div className="mt-3 flex h-[48px] w-full items-center justify-center px-2">
          <p
            className={clsx(
              'font-pretendard text-center leading-[120%] font-medium tracking-[-0.02em]',
              // PC도 길이에 따라 살짝만 줄임
              item.supplementName.length > 24 ? 'text-[16px]' : 'text-[18px]',
              'line-clamp-2 overflow-hidden break-words break-keep',
            )}
          >
            {item.supplementName}
          </p>
        </div>
      </div>
    </>
  );
}
