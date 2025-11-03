interface LoadingSkeletonCardProps {
  isMobile: boolean;
}

const LoadingSkeletonCard = ({ isMobile }: LoadingSkeletonCardProps) => (
  <div
    className={`${
      isMobile ? "h-[135px] w-[150px]" : "h-[165px] w-[235px]"
    } relative animate-pulse overflow-hidden rounded-[14px] bg-gray-200`}
  >
    <div className="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
  </div>
);

export default LoadingSkeletonCard;
