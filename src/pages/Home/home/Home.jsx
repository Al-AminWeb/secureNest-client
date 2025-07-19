import Banner from "../../banner/Banner.jsx";
import Benefits from "../Benefits/Benefits.jsx";
import NewsLetter from "../NewsLetter/NewsLetter.jsx";
import Footer from "../../shared/Footer/Footer.jsx";
import Blogs from "../blogs/Blogs.jsx";




const Home = () => {
    return (
        <div>
            <Banner/>
            <Benefits/>
            <Blogs/>
            <NewsLetter/>
            <Footer/>
        </div>
    )
}

export default Home
