import {BiLogoTwitter, BiLogoInstagram, 
    BiShoppingBag, BiUserCircle, BiBell, BiLogOutCircle, BiSolidDashboard, BiFoodMenu, BiTask, BiChart, BiUser,
    BiGroup,
    BiSolidUserBadge,
    BiUserCheck,
    BiShield,
    BiFile,
    BiMenu,
    BiSlider,
    BiSliderAlt,
    BiBox,
    BiLogoFacebook
} from 'react-icons/bi'
import {HiUserGroup, HiUser, HiUsers} from 'react-icons/hi'

const useIcons = () => {
    const icons = {
        twitter:BiLogoTwitter,
        instagram:BiLogoInstagram,
        bag:BiShoppingBag,
        user:BiUserCircle,
        notif:BiBell,
        logout:BiLogOutCircle,
        overview:BiSolidDashboard,
        dishes:BiFoodMenu,
        orders:BiTask,
        analytics:BiChart,
        profile:BiUser,
        reserves:HiUserGroup,
        staff:HiUsers,
        guard:BiShield,
        legal:BiFile,
        menu:BiMenu,
        slider:BiSliderAlt,
        box: BiBox,
        ig:BiLogoInstagram,
        x:BiLogoTwitter,
        fb:BiLogoFacebook,
    }
    return icons;
}
 
export default useIcons;