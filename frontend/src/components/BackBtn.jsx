import { Link, useNavigate } from "react-router-dom";


export default function BackBtn() {
    const navigate = useNavigate()
  return (
    <Link><button className="bckbtn" onClick={()=>{
        navigate(-1)
    }}>↼ back</button></Link>
  )
}
