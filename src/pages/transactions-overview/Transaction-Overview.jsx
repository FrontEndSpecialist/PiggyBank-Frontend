import Transactions from "../../components/transactions/Transactions";

function TransactionOverview () {

    return (
    <>
        <h1>Transactie overzicht</h1>   
        <div className="container">
            <Transactions />
        </div>    
    </>
    );
}

export default TransactionOverview;