import Accounts from "../../components/accounts/Accounts";
import Transactions from "../../components/transactions/Transactions";

import './Overview.css';

function Overview() {
    return (
        <>
            <h1>Welkom &#128075;</h1>

            <div className="container">
            <h2>Jouw account</h2>
                <Accounts />
            </div>

            <div className='container'>
                <h2>Laatste 3 transacties</h2>
                <Transactions limit={3} />
            </div>
        </>
    );
}

export default Overview;