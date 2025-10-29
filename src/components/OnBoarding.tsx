// import React, { useState, useEffect } from "react";
// import styled from "styled-components";
// import lemonLogo from "/images/onboarding.png";

// interface OnboardingScreenProps {
//   onComplete: () => void;
// }

// const StyledContainer = styled.div<{ $animationState: number }>`
//   background: #ffffff;
//   height: 100vh;
//   position: relative;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   overflow: hidden;
//   isolation: isolate;

//   &::before {
//     content: "";
//     position: absolute;
//     inset: 0;
//     background-image: linear-gradient(
//       to bottom,
//       #ffe16b 0%,
//       #ffea8c 53.38%,
//       #fcffea 100%
//     );
//     opacity: ${({ $animationState }) => ($animationState >= 1 ? 0 : 1)};
//     transition: opacity 0.22s ease-in-out; /* 부드러운 페이드 */
//     z-index: 0;
//     will-change: opacity;
//   }
// `;

// const StyledLogoWrapper = styled.div<{ $animationState: number }>`
//   position: relative;
//   z-index: 1;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   gap: ${({ $animationState }) => ($animationState >= 1 ? "10px" : "0")};
//   transition: gap 0.2s cubic-bezier(0.22, 1, 0.36, 1);
// `;

// const StyledVitaCheckText = styled.h1<{ $animationState: number }>`
//   margin: 0;
//   font-weight: 700;
//   font-family: "Lemonada", cursive;
//   font-optical-sizing: auto;
//   font-style: normal;

//   font-size: 26px;
//   color: ${({ $animationState }) =>
//     $animationState >= 1 ? "#505050" : "white"};

//   transform: translateX(
//     ${({ $animationState }) => ($animationState >= 1 ? "-20px" : "0")}
//   );
//   transition:
//     color 0.2s ease-in-out,
//     transform 0.26s cubic-bezier(0.22, 1, 0.36, 1);
//   will-change: transform, color;
// `;

// const StyledLogoImage = styled.img<{ $animationState: number }>`
//   height: 109px;
//   width: ${({ $animationState }) => ($animationState >= 1 ? "109px" : "0px")};
//   opacity: ${({ $animationState }) => ($animationState >= 1 ? 1 : 0)};
//   transform: scale(
//       ${({ $animationState }) => ($animationState >= 1 ? 1 : 0.92)}
//     )
//     translateZ(0); /* GPU 힌트 */
//   transition:
//     width 0.22s cubic-bezier(0.22, 1, 0.36, 1),
//     opacity 0.22s ease-out,
//     transform 0.26s cubic-bezier(0.22, 1, 0.36, 1);
//   overflow: hidden;
//   will-change: width, opacity, transform;
// `;

// /* 사용자 접근성: 애니메이션 최소화 */
// const GlobalReducedMotion = styled.div`
//   @media (prefers-reduced-motion: reduce) {
//     * {
//       transition: none !important;
//       animation: none !important;
//     }
//   }
// `;

// const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
//   const [animationState, setAnimationState] = useState(0);

//   useEffect(() => {
//     const lemonAppearTimer = setTimeout(() => setAnimationState(1), 500); // 로고 등장 + 배경 페이드 동시
//     const completeTimer = setTimeout(() => onComplete(), 1500);

//     return () => {
//       clearTimeout(lemonAppearTimer);
//       // clearTimeout(finalStateTimer);
//       clearTimeout(completeTimer);
//     };
//   }, [onComplete]);

//   return (
//     <StyledContainer $animationState={animationState}>
//       <StyledLogoWrapper $animationState={animationState}>
//         <StyledLogoImage
//           src={lemonLogo}
//           alt="VitaCheck Logo"
//           $animationState={animationState}
//         />
//         <StyledVitaCheckText $animationState={animationState}>
//           VitaCheck
//         </StyledVitaCheckText>
//       </StyledLogoWrapper>
//     </StyledContainer>
//   );
// };

// export default OnboardingScreen;
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import lemonLogo from "/images/onboarding.png";

interface OnboardingScreenProps {
  onComplete: () => void;
}

const StyledContainer = styled.div<{ $animationState: number }>`
  background: #ffffff;
  height: 100vh;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  isolation: isolate;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: linear-gradient(
      to bottom,
      #ffe16b 0%,
      #ffea8c 53.38%,
      #fcffea 100%
    );
    opacity: ${({ $animationState }) => ($animationState >= 1 ? 0 : 1)};
    transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1); /* 더 부드러운 ease-in-out */
    z-index: 0;
    will-change: opacity;
  }
`;

const StyledLogoWrapper = styled.div<{ $animationState: number }>`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ $animationState }) => ($animationState >= 1 ? "10px" : "0")};
  transition: gap 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); /* 살짝 바운스 효과 */
`;

const StyledVitaCheckText = styled.h1<{ $animationState: number }>`
  margin: 0;
  font-weight: 700;
  font-family: "Lemonada", cursive;
  font-optical-sizing: auto;
  font-style: normal;

  font-size: 26px;
  color: ${({ $animationState }) =>
    $animationState >= 1 ? "#505050" : "white"};

  transform: translateX(
    ${({ $animationState }) => ($animationState >= 1 ? "-20px" : "0")}
  );
  transition:
    color 0.5s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); /* 부드러운 이동 + 바운스 */
  will-change: transform, color;
`;

const StyledLogoImage = styled.img<{ $animationState: number }>`
  height: 109px;
  width: ${({ $animationState }) => ($animationState >= 1 ? "109px" : "0px")};
  opacity: ${({ $animationState }) => ($animationState >= 1 ? 1 : 0)};
  transform: scale(${({ $animationState }) => ($animationState >= 1 ? 1 : 0.8)})
    translateZ(0); /* 더 작은 스케일에서 시작 */
  transition:
    width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
    /* 바운스 효과 */ opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1),
    /* 부드러운 페이드 */ transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); /* 부드러운 스케일 + 바운스 */
  overflow: hidden;
  will-change: width, opacity, transform;
`;

/* 사용자 접근성: 애니메이션 최소화 */
const GlobalReducedMotion = styled.div`
  @media (prefers-reduced-motion: reduce) {
    * {
      transition: none !important;
      animation: none !important;
    }
  }
`;

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [animationState, setAnimationState] = useState(0);

  useEffect(() => {
    const lemonAppearTimer = setTimeout(
      () => setAnimationState(1),
      400
    ); /* 더 빠른 시작 */
    const completeTimer = setTimeout(
      () => onComplete(),
      1800
    ); /* 조금 더 긴 지속 시간 */

    return () => {
      clearTimeout(lemonAppearTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <GlobalReducedMotion>
      <StyledContainer $animationState={animationState}>
        <StyledLogoWrapper $animationState={animationState}>
          <StyledLogoImage
            src={lemonLogo}
            alt="VitaCheck Logo"
            $animationState={animationState}
          />
          <StyledVitaCheckText $animationState={animationState}>
            VitaCheck
          </StyledVitaCheckText>
        </StyledLogoWrapper>
      </StyledContainer>
    </GlobalReducedMotion>
  );
};

export default OnboardingScreen;
