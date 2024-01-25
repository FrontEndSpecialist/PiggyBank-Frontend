import { useEffect, useState } from 'react';
import { NavLink } from "react-router-dom";

import { getUserId } from '../../authentication';
import Alert from "../../components/alert/Alert";

import './Settings.css';

function Settings() {
    const [accountName, setAccountName] = useState('');
    const [accountUpdated, setAccountUpdated] = useState(false);
    const [accounts, setAccounts] = useState([]);

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

                    // No support for multiple accounts, so always return the first in the list.
                    setAccountName(result.accounts[0].name)
                },
                (error) => {
                    console.log(error);
                }
            )
    }, []);

    const submitForm = (e) => {
        // Make sure page does not refresh.
        e.preventDefault();

        const body = { accountName, accountId: accounts[0].id };
        fetch("http://localhost:8080/api/v1/accounts", {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body),
        })
            .then(
                () => {
                    setAccountUpdated(true);
                },
                (error) => {
                    setAccountUpdated(false);
                    console.log(error);
                }
            )
    };

    if (accountUpdated) {
        return (
            <>
                <h1>Hoppa!</h1>
                <Alert message={<>&#128077; Het is gelukt om je account bij te werken.</>}></Alert>
                <NavLink to="/settings" onClick={() => setAccountUpdated(false)}>Terug</NavLink>
            </>
        );
    }

    return (
        <div className='settings'>
            <h1>Account instellingen</h1>
            <div className='container'>
                <h3>Rekening naam aanpassen</h3>
                <form onSubmit={submitForm}>

                    {/* Account name input */}
                    <div className="form-row">
                        <div>
                            <label htmlFor="accountName" className="account-name-label">
                                Account naam
                                <div>
                                    <input
                                        value={accountName}
                                        onChange={(e) => setAccountName(e.target.value)}
                                        type="text"
                                        name="accountName"
                                        id="accountName"
                                        className="accountName-input"
                                        placeholder=""
                                        required />
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Submit form */}
                    <div className="form-row">
                        <button type="submit">Opslaan</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Settings;