import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_DONATION } from '../utils/mutations';
import { GET_NEW_DONATION } from '../utils/queries';
import { useLocation } from 'react-router-dom';
import Auth from '../utils/auth';



function Success() {
    const [addDonation] = useMutation(ADD_DONATION);
    const [isDonationSuccess, setIsDonationSuccess] = useState(false);
    const location = useLocation();
    const donationId = new URLSearchParams(location.search).get('donation_id');
    const isLoggedIn = Auth.loggedIn();


    const { loading, error, data } = useQuery(GET_NEW_DONATION, {
        variables: { id: donationId },
    });

    useEffect(() => {
        if (data && isLoggedIn) {
            const donation = data.donation;
            const donateDate = new Date(parseInt(donation.donationDate));
            let formattedPrice = donation.price.toString();
            if (!formattedPrice.includes('.')) {
                formattedPrice = formattedPrice + '.00';
            };
            // console.log('this ran once first')
            addDonation(
                {
                    variables:
                    {
                        price: parseFloat(formattedPrice)
                    }
                }).then(() => {
                    setIsDonationSuccess(true);
                    // console.log('Donation worked' + isDonationSuccess)
                    // console.log('this ran once here')
                });
        }
    }, [data, isLoggedIn, addDonation]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    if (!data || !data.donation) return <p>No donation data found</p>;

    const donation = data?.donation;
    const donateDate = new Date(parseInt(donation.donationDate));


    let formattedPrice = donation.price.toString();
    if (!formattedPrice.includes('.')) {
        formattedPrice = formattedPrice + '.00';
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem', padding: '1rem' }}>
                <div>
                    <h1>Success!</h1>
                    <h2>Thank you for your donation!</h2>
                    <p>
                        Your donation goes to the lovely cause of helping feed a starving developer who is looking for work.<br />
                        Please find your donation details below; if you are so inclined, please print this page for your records. <br />
                        {isLoggedIn ? 'You may also refer to your donation history in your MyLibrary.' : ''}
                    </p>
                    <br />
                    <br />
                    {donation && (
                        <div>
                            <p>Donation ID: {donation._id}</p><br />
                            <p>Donation amount: ${formattedPrice}</p><br />
                            <p>Donation date: {donateDate.toLocaleString()}</p><br />
                            {/* {isDonationSuccess && <p>Donation was successful!</p>} */}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
};

export default Success;