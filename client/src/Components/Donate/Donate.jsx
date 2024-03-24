import React, { useState } from 'react';
import { Grid, Pagination } from '@mui/material';
import { useQuery } from '@apollo/client';
import './donate.css';

export const Donate = () => {

    const [selectedAmount, setSelectedAmount] = useState('1.00');
    const [customAmount, setCustomAmount] = useState('');

    const handleAmountChange = (event) => {
        // destructure value from event.target, so this way i dont have to write event.target.value all the time
        const { value } = event.target;
        // updates selectedAmount state with value
        setSelectedAmount(value);
        // if custom, clears out this input value and eventually display the custom input element
        if (value === 'custom') {
            setCustomAmount('');
        }
    };

    const handleCustomAmountChange = (event) => {
        let { value } = event.target;
        value = value.replace(/[^0-9.]/g, '');
        const parts = value.split('.');
        if(parts.length > 2) {
            value = parts[0] + '.' + parts[1];
        }
        if(parts.length === 2 && parts[1].length > 2) {
            value = parts[0] + '.' + parts[1].slice(0,2);
        }
        setCustomAmount(value);
    }

    return (
        <Grid item id="donate-div" sx={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '2rem', border: '10px double #ededde' }}>
            <div style={{ margin: '2rem' }}>
                <p>
                    <span style={{ fontFamily: 'Coventry Garden', whiteSpace: 'nowrap' }}>{'{'} L i b e r {'}'}</span> still can't be sold.

                    An important update for readers in the United States.
                    Please don't scroll past this 1-minute read. We ask you to reflect on the number of times you visited <span style={{ fontFamily: 'Coventry Garden', whiteSpace: 'nowrap' }}>{'{'} L i b e r {'}'}</span>  in the past year, the value you got from it, and whether you're able to give $0.01 to the <span style={{ fontFamily: 'Coventry Garden', whiteSpace: 'nowrap' }}>{'{'} L i b e r {'}'}</span>  Foundation. If you can, please join the 2% of readers who give. If everyone reading this right now gave just $0.01, we'd still be very poor. But something is always better than nothing.

                    It's hard to know what to trust online these days. Disinformation and scammers are everywhere. <span style={{ fontFamily: 'Coventry Garden', whiteSpace: 'nowrap' }}>{'{'} L i b e r {'}'}</span>  is different. It's not perfect, but it's not here to make a profit {'('}yet{')'} or to push a particular perspective. It's written by everyone, together. <span style={{ fontFamily: 'Coventry Garden', whiteSpace: 'nowrap' }}>{'{'} L i b e r {'}'}</span>  is something we all share, like a library or a public park. We are passionate about our model because we want everyone to have equal access to quality reads - something that is becoming harder and harder to find online.

                    If <span style={{ fontFamily: 'Coventry Garden', whiteSpace: 'nowrap' }}>{'{'} L i b e r {'}'}</span>  has given you $0.01 worth of knowledge this year, please give back. There are no small contributions: every cent counts, every donation counts. Thank you.
                </p>
            </div>
            <div style={{ margin: '2rem' }}>
                {/* <form onSubmit={handleSubmit}> */}
                <form  >
                    <label htmlFor="amount" style={{ width: '100%' }}>Choose an amount:</label>
                    <br />
                    
                    <select id="amount" name="amount" value={selectedAmount} onChange={handleAmountChange} style={{ width: '150px' }}>
                        <option value="1.00">$1</option>
                        <option value="5.00">$5</option>
                        <option value="10.00">$10</option>
                        <option value="20.00">$20</option>
                        <option value="custom">Custom</option>
                    </select>
                    {selectedAmount === 'custom' && (
                        <input
                            type="number"
                            value={customAmount}
                            onChange={handleCustomAmountChange}
                            placeholder="Enter custom amount"
                            style={{ width: '142px' }}
                            required
                        />
                    )}
                    <br />
                    <button type="submit" style={{ width: '100%' }}>Donate</button>
                </form>
            </div>
        </Grid>
    )
};

export default Donate;