import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_DONATION } from '../utils/mutations';
import { GET_NEW_DONATION } from '../utils/queries';
import { useLocation } from 'react-router-dom';
//run addDonation(price)
//get price from Donate model by id

function Success() {
    const [addDonation] = useMutation(ADD_DONATION);

    const location = useLocation();
    const donationId = new URLSearchParams(location.search).get('donation_id');
    console.log(donationId);


    const { loading, error, data } = useQuery(GET_NEW_DONATION, {
        variables: { id: donationId },
    });

  

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

const donation = data.donation;
const donateDate = new Date(parseInt(donation.donationDate));

    return (
        <>
            <div>
                <h1>Success!</h1>
                <h2>Thank you for your donation!</h2>
                {donation && (
                    <div>
                        <p>Donation ID: {donation._id}</p>
                        <p>Amount: {donation.price}</p>
                        <p>Name: {donation.name}</p>
                        <p>donation date: {donateDate.toLocaleString()}</p>
                    
                    </div>
                )}
            </div>
        </>
    )
};

export default Success;