import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

const RootLayout = ({children}) => {
    return ( 
        <>
           <Header/>
            <main>
            <Outlet/>
            </main>
            <Footer/>
        </>
     );
}
 
export default RootLayout;