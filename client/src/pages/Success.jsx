import { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_DONATION } from '../utils/mutations';

function Success() {
    const [addDonation] = useMutation(ADD_DONATION);

    return (
        <>
            <div>
                <h1>Success!</h1>
                <h2>Thank you for your donation!</h2>
            </div>
        </>
    )
};

export default Success;