import { Grid } from "@mui/material";
import notp from '../assets/surprise/notp.jpg';
import pt from '../assets/surprise/pt.png';
import ry from '../assets/surprise/selfport.png';
import sg from '../assets/surprise/s.jpeg';
import '../styles/surprise.css';

function Surprise() {

    return (
        <>
        {/* meet team, ty diarmuid & meg */}
            <Grid container className="top-home-div" p={3}>
                <p style={{fontSize: '1.7rem', fontStyle:'italic', marginBottom:'2rem'}}>MEET THE TEAM</p>
                <p>Meet the team behind <span style={{ fontFamily: 'Coventry Garden', whiteSpace: 'nowrap' }}>{'{'} L i b e r {'}'}</span>! We are based in Los Angeles and looking to code, build, and code some more!<br />
                Please click our respective profile pictures to view our dev portfolios.<br /><br/>
                Our team put in tireless work and countless hours to meet the deadline of this project. We must credit <strong><a style={{color: '#000', textDecoration:'none'}} href="https://gutendex.com">Gutendex</a></strong> and <strong><a style={{color: ' #000', textDecoration:'none'}}  href="https://www.gutenberg.org">Project Gutenburg</a></strong> for all of the book data that this application has. We were fortunate to make our own straight-forward database with the acquired data. Additionally, we would like to leave a special thank-you to our spectacular mentors, Diarmuid and Meg, without whom, we surely would not have gotten this far, nor gotten the know-how to build such a feat within the timeframe of our program. They clearly have a passion for software development, and we were even luckier that they have a passion for helping others learn and grow. Their passion, time, effort, and encouragement only pushed us to make a better project. So, to you two: <em>thank you.</em></p>
            </Grid>

            {/* team */}
            <Grid container spacing={3} sx={{ display: 'flex', justifyContent: 'space-evenly', height: '100%', paddingLeft: '1rem', fontSize: '1.4rem', marginTop: '2rem', borderTop: '20px double #ededde', borderBottom: '10px double #c5af9f' }}>
                {/* p*/}
                <Grid item id="pasha" className="mobile-team scroll-down before-anim" ml={3} pr={3} pb={3} sx={{ flex: '1', minHeight: '75vh', marginBottom: '5rem', marginLeft: '1.5rem', backgroundColor: '#ededde', color: '#666256' }}>
                    <p>Pasha G., a kind-mannered person, is always pushing forward with a good attitude. He is an avid fan of cars, TV, and all things technology. Also a fantasy fan, he's happy to make coding magic happen when he is not working his day-job in the realty industry or busy on the weekends. His profile picture looks nothing like him, but he likes it, so it is what it is.</p>
                    <br />
                    <a href="https://legendary-cranachan-7b1238.netlify.app">
                        <img src={notp} style={{ width: '100%', height: 'auto', borderRadius: '12px' }} />
                    </a>

                </Grid>
                {/* s*/}
                <Grid item className="mobile-team scroll-up before-anim" ml={3} pb={3} pr={3} sx={{ flex: '1', minHeight: '100vh', marginTop: '5rem', display: 'flex', alignItems: 'flex-end', flexDirection: 'column', backgroundColor: '#c5af9f', color: '#f3f3ec' }}>
                    <a href="https://github.com/SalGonzalez151/react-portfolio">
                        <img src={sg} style={{ width: '100%', height: 'auto', borderRadius: '12px' }} />
                    </a>
                    <br />
                    <p>Sal G. is a solution-driven developer. Whether pair programming or hunkering down on his own to solve the biggest coding problems and tasks, Sal thrives when met with challenges. He is an avid video gamer and hopes to be able to code within that realm in the near future.</p>
                </Grid>
                {/* Pt */}
                <Grid item className="mobile-team scroll-down before-anim" ml={3} pr={3} pb={3} sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', flex: '1', minHeight: '75vh', width: 'fit-content', marginBottom: '5rem', backgroundColor: '#ededde', color: '#666256' }}>
                    <p>Peyton T. is a dedicated developer as well as a talented musician. Along with playing <em>Call of Duty</em> and <em>NBA 2K</em>, he genuinely enjoys coding. If there were more hours in a day, he would honestly find a way to code something. Our interactive reader was his creation, and for his first time really integrating such a feature, I'd say it was more than astounding what he was able to produce with our team.</p>
                    <br />
                    <a href="https://peyton-touma-portfolio.netlify.app">
                        <img src={pt} style={{ width: '100%', height: 'auto', borderRadius: '12px' }} />
                    </a>

                </Grid>
                {/* R */}
                <Grid item className="mobile-team scroll-up before-anim" ml={3} pb={3} pr={3} sx={{ flex: '1', minHeight: '100vh', marginTop: '5rem', marginRight: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', backgroundColor: '#c5af9f', color: '#f3f3ec' }}>

                    <a href="https://minty-ry-portfolio.netlify.app/">
                        <img src={ry} style={{ width: '100%', height: 'auto', borderRadius: '12px' }} />
                    </a>

                    <br />
                    <p>I {'('}Ryan E.{')'} made this page as a thank-you to my team. I just wanted to say that in all of my academic career, this is easily the best team I've been able to work with -- for the first time ever, I found a team whom I knew I could rely on to carry their weight. Thank you.</p>
                </Grid>
            </Grid >
        </>
    )
};

export default Surprise;