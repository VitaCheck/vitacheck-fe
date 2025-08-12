import { useMemo, useState } from "react";
import Picker from "react-mobile-picker";

type PickerValue = { hour: string; minute: string };

interface TimePickerModalProps {
  onClose: () => void;
  onConfirm: (value: PickerValue) => void;
  defaultValue?: PickerValue; // 기본값 없으면 09:00
}

const TimePickerModal = ({
  onClose,
  onConfirm,
  defaultValue,
}: TimePickerModalProps) => {
  const selections = useMemo(
    () => ({
      hour: Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0")),
      minute: Array.from({ length: 60 }, (_, i) =>
        i.toString().padStart(2, "0")
      ),
    }),
    []
  );

  const [pickerValue, setPickerValue] = useState<PickerValue>(
    defaultValue ?? { hour: "09", minute: "00" }
  );

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-end z-[60]"
      onClick={onClose}
    >
      <div
        className="w-full bg-white rounded-t-2xl px-6 pt-4 pb-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-3">
          <button onClick={onClose} className="text-[18px]">
            취소
          </button>
          <div className="text-[20px] font-semibold">시간 선택</div>
          <button
            onClick={() => onConfirm(pickerValue)}
            className="text-[18px] font-semibold"
          >
            완료
          </button>
        </div>

        {/* 휠 피커 (스크린샷 스타일) */}
        <div className="relative flex justify-center items-center w-full h-[180px]">
          {/* 선택 하이라이트 바 */}
          <div className="absolute top-1/2 -translate-y-1/2 w-full h-[36px] bg-[#F1F1F1] rounded-md z-0" />
          <div className="relative z-10 flex gap-3">
            <Picker
              value={pickerValue}
              onChange={setPickerValue}
              height={180}
              itemHeight={36}
              className="flex gap-3"
            >
              <Picker.Column name="hour" className="flex flex-col items-center">
                {selections.hour.map((h) => (
                  <Picker.Item
                    key={h}
                    value={h}
                    className="text-[24px] leading-[36px]"
                  >
                    {h}
                  </Picker.Item>
                ))}
              </Picker.Column>

              <div className="flex items-center justify-center text-[24px] w-[20px]">
                :
              </div>

              <Picker.Column
                name="minute"
                className="flex flex-col items-center"
              >
                {selections.minute.map((m) => (
                  <Picker.Item
                    key={m}
                    value={m}
                    className="text-[24px] leading-[36px]"
                  >
                    {m}
                  </Picker.Item>
                ))}
              </Picker.Column>
            </Picker>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimePickerModal;
