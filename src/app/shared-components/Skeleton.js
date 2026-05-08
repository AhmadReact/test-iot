import Skeleton from '@mui/material/Skeleton';

const SkeletonUI = ({ times, itemsLength }) => {
  const itemsSkeleton = Array(itemsLength)
    .fill(0)
    .map((_, i) => {
      return (
        <>
          <div className="col-span-12 ">
            <Skeleton variant="rectangular" height={38} />
          </div>

          <div className="col-span-12 my-12 border-b" />
        </>
      );
    });

  const constantSkeleton = Array(6)
    .fill(0)
    .map((_, i) => {
      return (
        <>
          <div className="col-span-12 ">
            <Skeleton variant="rectangular" height={i === Array(6).length - 1 ? 40 : 32} />
          </div>

          {i !== Array(6).length - 1 && <div className="col-span-12 my-12 border-b" />}
        </>
      );
    });

  return (
    <>
      {itemsSkeleton}
      {constantSkeleton}
    </>
  );
};

export default SkeletonUI;
