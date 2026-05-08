import { useSelector } from 'react-redux';

const CustomLoading = ({ children }) => {
  const { loader } = useSelector((state) => {
    return state;
  });

  return (
    <>
      {loader && (
        <div className="fixed  h-screen w-screen flex justify-center items-center z-9999 bg-[#d1dad5dc]">
          <div className="loader" data-content={loader} />
        </div>
      )}

      {children}
    </>
  );
};

export default CustomLoading;
