import CustomizedAccordions from './Accordian';

const ListCard = ({ customercards, setcustomercards, setRefreshAccount, AutopayHandler }) => {
  return (
    <>
      <CustomizedAccordions
        AutopayHandler={AutopayHandler}
        customercards={customercards}
        setRefreshAccount={setRefreshAccount}
        setcustomercards={setcustomercards}
      />
    </>
  );
};

export default ListCard;
