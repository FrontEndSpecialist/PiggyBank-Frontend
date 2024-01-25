import { useState, useEffect } from "react";
import { getUserId } from "../../authentication";

import './Transactions.css'

function Transactions(props) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8080/api/v1/accounts`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-User-Id": getUserId()
      },
    })
      .then(res => res.json())
      .then(results => {
        const currentAccountId = results.accounts[0].id;
        var fetchUrl = `http://localhost:8080/api/v1/transactions/${currentAccountId}`;

        if (props.limit) {
          fetchUrl = fetchUrl + `?limit=${props.limit}`;
        }

        fetch(fetchUrl)
          .then(res => res.json())
          .then(
            (result) => {
              setIsLoaded(true);
              setTransactions(result.transactions);
            },
            (error) => {
              setIsLoaded(true);
              setError(error);
            }
          )
      });
  }, [props])

  const convertDate = (date) => {
    const formattedDate = new Date(date);
    return formattedDate.toLocaleDateString('nl-NL', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
    });
  }

  if (error) {
    return <div>Fout: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Laden...</div>;
  } else if (isLoaded && transactions.length === 0) {
    return <div>Geen transacties gevonden</div>;
  } else {
    return (
      <div>
        {transactions.map(transaction => (
          <div className="transaction" key={transaction.id}>
            <div className="transaction__date">{convertDate(transaction.dateTime)}</div>
            <div className="transaction__description">{transaction.description}</div>
            <div className="transaction__amount">
              <span className={transaction.amount >= 0 ? 'transaction__amount amount-debit' : ' transaction__amount amount-credit'}>
                &euro; {transaction.amount}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  }


}

export default Transactions;