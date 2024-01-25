import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getUserId } from "../../authentication";
import Alert from "../../components/alert/Alert";

import "./Transfer.css";

function Transfer() {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [senderAccountId, setSenderAccountId] = useState('1');
    const [receiverAccountId, setReceiverAccountId] = useState('');
    const [currency, setCurrency] = useState('EURO');
    const [fundsTransfered, setFundsTransfered] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [addressBook, setAddressBook] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:8080/api/v1/accounts`, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "X-User-Id": getUserId()
            },
        })
            .then(res => res.json())
            .then(
                (result) => {
                    setAccounts(result.accounts);
                    setSenderAccountId(result.accounts[0].id)
                    setAddressBook([
                        { name: 'Melvin Webster', accountId: 1 },
                        { name: 'Sara Ravestein', accountId: 2 },
                        { name: 'Cem Fuijk', accountId: 3 },
                        { name: 'Sophie de Blaak', accountId: 4 }
                    ].filter(addressBookItem => addressBookItem.accountId !== result.accounts[0].id))
                },
                (error) => {
                    console.log(error);
                }
            )
    }, [fundsTransfered]);

    const getActiveAccount = () => {
        if (accounts && accounts[0]) {
            return accounts[0].name + ' - €' + accounts[0].balance;
        }
        return '';
    }

    const submitForm = (e) => {
        // Make sure page does not refresh.
        e.preventDefault();

        const form = { amount, description, senderAccountId, receiverAccountId, currency };
        fetch("http://localhost:8080/api/v1/transactions", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "X-User-Id": getUserId()
            },
            body: JSON.stringify(form),
        })
            .then(
                (result) => {
                    setFundsTransfered(true);
                    console.log(result);
                },
                (error) => {
                    setFundsTransfered(false);
                    console.log(error);
                }
            )
    };

    const resetState = () => {
        setFundsTransfered(false);
        setReceiverAccountId('');
        setSenderAccountId(getActiveAccount().id);
        setDescription('');
        setAmount('');
        setCurrency('EURO');
    }

    const translateCurrency = (currency) => {
        switch (currency) {
            case 'EURO':
                return '€';

            case 'USD':
                return '$';

            case 'GBP':
                return '£';

            default:
                return '';
        }
    }
    
    if (fundsTransfered) {
        return (
            <>
                <h1>Gelukt!</h1>
                <Alert message={<>&#128077; Het is gelukt om {translateCurrency(currency)} {amount} over te maken!</>}></Alert>
                <NavLink to="/transfer" onClick={resetState}>Nog een overboeking</NavLink>
            </>
        );
    }
    return (
        <>
            <h1>Overboeken</h1>
            <div className="container">
                <form onSubmit={submitForm}>

                    {/* From (sender) account */}
                    <div className="form-row">
                        <label>
                            Van rekening
                            <select
                                name="account"
                                value={senderAccountId}
                                onChange={(e) => setSenderAccountId(e.target.value)}>
                                <option value={getActiveAccount().id}>{getActiveAccount()}</option>
                            </select>
                        </label>
                    </div>

                    {/* To (receiver) account */}
                    <div className="form-row">
                        <label>
                            Naar rekening
                            <select
                                required
                                name="toaccount"
                                value={receiverAccountId}
                                onChange={(e) => setReceiverAccountId(e.target.value)}>

                                <option disabled value="">Kies een ontvanger</option>
                                <optgroup label="Adresboek">
                                    {addressBook.map(addressBookItem => (
                                        <option key={addressBookItem.accountId}
                                            value={addressBookItem.accountId}>
                                            {addressBookItem.name}
                                        </option>
                                    ))}
                                </optgroup>
                            </select>
                        </label>
                    </div>

                    {/* Amount */}
                    <div className="form-row">
                        <div style={{ position: "relative" }}>
                            <label htmlFor="amount" className="amount-input-label">
                                Bedrag
                                <div>
                                    <select
                                        className="transfer__currency"
                                        required
                                        name="currency"
                                        value={currency}
                                        onChange={(e) => setCurrency(e.target.value)}>

                                        <option value="EURO">&euro;</option>
                                        <option value="USD">&#36;</option>
                                        <option value="GBP">&#163;</option>
                                    </select>
                                    <input
                                        style={{ display: 'inline-block' }}
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        type="number"
                                        min="0.00"
                                        step=".01"
                                        max="1000000"
                                        name="amount"
                                        id="amount"
                                        className="amount-input"
                                        placeholder=""
                                        required />
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="form-row">
                        <label>Omschrijving
                            <textarea
                                required
                                name="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}>
                            </textarea>
                        </label>
                    </div>

                    {/* Submit form */}
                    <div className="form-row">
                        <button type="submit">Overboeken</button>
                    </div>
                </form>
            </div>
        </>);
}

export default Transfer;