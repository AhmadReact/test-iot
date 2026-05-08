const Longloading = () => {
  return (
    <div className="fixed bg-[#80808066] z-[100000] w-full h-full">
      <div className="relative left-[28%] top-[40%] flex items-center gap-x-5">
        <div className="lds-spinner">
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>
        <h2 className="text-white">Please wait. Loading your cart</h2>
      </div>
    </div>
  );
};

export default Longloading;
