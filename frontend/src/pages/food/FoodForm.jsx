import { useState } from "react"
import {Link, useNavigate} from "react-router-dom"
import BackBtn from "../../components/BackBtn"
import useAdminAuthContext from "../../hooks/useAdminAuthContext"
import useDishContext from "../../hooks/useDishContext"
import Swal from "sweetalert2"
import useToast from "../../hooks/useToast"
const categ = ['grills', 'desserts', 'snacks', 'continental', 'pasta','casserole', 'pastry', 'breakfasts', 'combo', 'full-combo', '3-course-meal', 'specials', 'drinks', 'sandwiches', 'sides', 'carbs', 'soups', 'proteins','healthy']
const tagOpt = ['arrival', 'promo', 'event', 'special']
export default function FoodForm(){
    const [ name, SetName ] = useState('') 
    const [ price, SetPrice ] = useState('') 
    const [ category, SetCategory ] = useState('') 
    const [ discPerc, SetDiscPerc ] = useState('') 
    const [ discPrice, SetDiscPrice ] = useState('')
    const [tag, setTag] = useState([]) 
    const [file, setFile] = useState('')
    const [ disc, SetDisc ] = useState(false) 
    const [error, setError] = useState(null)
    const [loading, SetLoading] = useState(false)
    const {dispatch} = useDishContext()
    const {succtoast, errtoast} = useToast()
    const {admin} = useAdminAuthContext()
    const handleSubmit = async ()=>{  
        SetLoading(true) 
        const body = {
            name, price, category, discPerc, discPrice,
            tag
        }
        try{
        const formdata = new FormData
        formdata.append('name', name)
        formdata.append('category', category)
        formdata.append('discountPrice', discPrice)
        formdata.append('discountPercentage', discPerc)
        formdata.append('tag',JSON.stringify(tag))
        formdata.append('price', price)
        formdata.append('image', file)
        console.log(body)
        for(const items of formdata.entries()){
            console.log(items)
        }
         const res = await fetch(`${import.meta.env.VITE_API_URL}/api/dish/create`, {
            method:'POST',
            headers:{'authorization':`Bearer ${admin.token}`},
            body:formdata
        })
        const data = await res.json()
        if(!res.ok){
            setError(data.error)
            SetLoading(false)
        }else{
            setError(null)
            SetName('')
            SetDiscPerc('')
            SetDiscPrice('')
            SetPrice('')
            setFile(null)
            SetCategory('')
            setTag([])
            SetLoading(false)
            dispatch({type:'CREATE_DISH', payload:data})
            succtoast("Dish created successfuly")
        }
    }catch(err){
        setError(null)
            SetName('')
            SetDiscPerc('')
            SetDiscPrice('')
            SetPrice('')
            setFile(null)
            SetCategory('')
            setTag([])
            SetLoading(false)
            errtoast("Couldn't create the dish. Try again later")
    }
    }

    const handleTagChange = (value) =>{
        if(tag.includes(value)){
           const upd = tag.filter(t => t !== value)
           setTag(upd)
        }else{
            setTag([...tag, value])
        }
    }
   return(
        <div className="fdiv">
        <BackBtn/>
        <h2>Add To Your Dishes</h2>
        <form onSubmit={(e)=>{
            e.preventDefault()
            handleSubmit()
        }}>
            <div className="form-action">
                <label htmlFor="">Dish Name</label>
                <input type="text" placeholder="What's the dish called" value={name} onChange={(e)=>{
                    SetName(e.target.value)
                    console.log(name)
                }}/>
                </div>
            <div className="form-action">
                <label htmlFor="">Dish Category</label>
                <select name="" id="" value={category} onChange={(e)=>{
                    SetCategory(e.target.value)
                 }}>
                    <option></option>
                    {categ.map((item,index) =>{
                        return (<option key={index} value={item}>
                            {item}
                        </option>)
                    })}
                </select>
                </div>
            <div className="form-action">
                <label htmlFor="">Dish Price</label>
                <input type="number" value={price} onChange={(e)=>{
                    SetPrice(e.target.value)
                 }}/>
                </div>
                <div className="form-action">
                <label htmlFor="">Dish Images</label>
                <input type="file"  onChange={(e)=>{
                     setFile(e.target.files[0])
                }}/>
                </div>
                <div className="form-action">
                    <label htmlFor="">Select Required Tags</label>
                    {tagOpt.map((t, index) => {
                        return(
                            <div key={index} className="tag-div">
                                <input type="checkbox" name="" id={`${t}-${index}`} value={t} 
                                checked={tag.includes(t)}
                                onChange={(e)=>{
                                    handleTagChange(t)
                                    console.log( e.target.value)
                                    setTimeout(console.log(tag), 5000)
                                }}/>
                                <label htmlFor={`${t}-${index}`}>{t}</label>
                            </div>
                        )
                    })}
                </div>
                <div className="form-action endisc">
                <div className="tag-div">
                    <input type="checkbox" name="" id="" 
                    checked={disc}
                    onChange={(e)=>{
                        console.log(e.target.checked)
                        SetDisc(e.target.checked)
                        if(!disc){
                            setTag([...tag, 'discount'])
                        }else{
                            console.log('removin')
                            setTag(tag.filter(t => t !== 'discount'))
                        }
                        console.log(tag)
                    }}
                    /><label htmlFor="">Enable Discount</label>
                </div>
                </div>
            { disc && <>
            <div className="form-action">
                <label htmlFor="">Discount Percentage</label>
                <input type="number" value={discPerc} onChange={(e)=>{
                    SetDiscPerc(e.target.value)
                    
                 }}
                 onBlur={()=>{
                    if(!price || !discPerc) return
                    let dp = price - (price * discPerc/100);
                    let fdp = Math.round(dp)
                    SetDiscPrice(fdp);
                 }}/>
                </div>
            <div className="form-action">
                <label htmlFor="">Discount Price Preview</label>
                <input type="number" value={discPrice} readOnly/>
                </div>
                </>}
                <button>{loading ? 'Submitting' :'Submit'}</button>
                <div className="error"></div>
        </form>
        </div>
    )
}