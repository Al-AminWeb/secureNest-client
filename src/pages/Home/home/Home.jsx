import Banner from "../../banner/Banner.jsx";
import Benefits from "../Benefits/Benefits.jsx";
import NewsLetter from "../NewsLetter/NewsLetter.jsx";
import Footer from "../../shared/Footer/Footer.jsx";
import Blogs from "../blogs/Blogs.jsx";
import UserReview from "../user review/UserReview.jsx";
import PopularPolicies from "../PopularPolicies/PopularPolicies.jsx";
import HowItWorks from "../HowItWorks/HowItWorks.jsx";
import TrustedPartners from "../TrustedPartners/TrustedPartners.jsx";




const Home = () => {
    return (
        <div>
            <Banner/>
            <Benefits/>
            <HowItWorks/>
            <PopularPolicies/>
            <TrustedPartners/>
            <Blogs/>
            <UserReview/>
            <NewsLetter/>
            <Footer/>
        </div>
    )
}

export default Home
