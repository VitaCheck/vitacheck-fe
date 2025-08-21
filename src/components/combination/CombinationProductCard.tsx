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
          'relative box-border hidden cursor-default md:block',
          isSelected ? 'bg-[#EEEEEE]' : 'bg-white',
          'h-[220px] w-full rounded-[25px] p-6 shadow-[2px_3px_12.4px_0px_rgba(0,0,0,0.16)] hover:shadow-lg',
        )}
        title={item.supplementName} // 툴팁으로 전체명 제공
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
        >
          {isSelected ? '—' : '+'}
        </button>

        <img
          src={item.imageUrl}
          alt={item.supplementName}
          className="mx-auto mt-3 h-[100px] w-[130px] object-contain"
        />

        {/* 텍스트: 고정 높이(두 줄) + 말줄임 + 단어 제어 */}
        <div className="mt-3 flex h-[50px] items-center justify-center px-2">
          <p
            className={clsx(
              'font-pretendard text-center leading-[120%] font-medium tracking-[-0.02em]',
              isLongNamePC ? 'text-[16px]' : 'text-[18px]',
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
