import { useEffect, useState } from "react"
import {Link, useNavigate, useParams} from "react-router-dom"
import BackBtn from "../../components/BackBtn"
import Swal from "sweetalert2"
import useAdminAuthContext from "../../hooks/useAdminAuthContext"
import useDishContext from "../../hooks/useDishContext"
import useToast from "../../hooks/useToast"
const categ = ['grills', 'desserts', 'snacks', 'continental', 'pasta','casserole', 'pastry', 'breakfasts', 'combo', 'full-combo', '3-course-meal', 'specials', 'drinks', 'sandwiches', 'sides', 'carbs', 'soups', 'proteins','healthy']
const tagOpt = ['arrival', 'promo', 'event', 'featured', 'special']
export default function FoodEdit(){
    const {id} = useParams()
    const {admin} = useAdminAuthContext()
    const {dispatch} = useDishContext()
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
    const {toast, succtoast, errtoast} = useToast()
    useEffect(()=>{
        const fetchProfile = async ()=>{
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/dish/${id}`)
            const data = await res.json()
            if(res.ok){
            SetName(data.name)
            SetDiscPerc(data.discountPercentage)
            SetDiscPrice(data.discountPrice)
            SetPrice(data.price)
            SetCategory(data.category)
            setTag(data.tags)
            if(data?.tags?.includes('discount')){
                SetDisc(true)
            }
            }
        }
        fetchProfile()
    }, [])

    const handleSubmit = async ()=>{  
        SetLoading(true) 
        const body = {
            name, price, category, discPerc, discPrice,
            tag
        }
        const formdata = new FormData
        formdata.append('name', name)
        formdata.append('category', category)
        formdata.append('discountPrice', discPrice)
        formdata.append('discountPercentage', discPerc)
        formdata.append('tag',JSON.stringify(tag))
        formdata.append('price', price)
        for(const items of formdata.entries()){
        }
        try{
         const res = await fetch(`${import.meta.env.VITE_API_URL}/api/dish/update/${id}`, {
            method:'PATCH',
            body:formdata,
            headers:{'authorization':`Bearer ${admin.token}`}
        })
        const data = await res.json()
        if(!res.ok){
            setError(data.error)
            SetLoading(false)
        }else{
            dispatch({type:'UPDATE_DISH', payload:data})
            setError(null)
            SetLoading(false)
            succtoast('Dish Edited Successfully')
        }}catch(err){
            SetLoading(false)
            errtoast('Something went wrong. Try again later.')
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
        <div className="fdiv" style={{alignItems:'center'}}>
        <BackBtn/>
        <h2>Add To Your Dishes</h2>
        <form className="editForm" onSubmit={(e)=>{
            e.preventDefault()
            handleSubmit()
        }}
        >
            <div className="form-action">
                <label htmlFor="">Dish Name</label>
                <input type="text" placeholder="What's the dish called" value={name} onChange={(e)=>{
                    SetName(e.target.value)
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
                    <label htmlFor="">Select Required Tags</label>
                    {tagOpt.map((t, index) => {
                        return(
                            <div key={index} className="tag-div">
                                <input type="checkbox" name="" id={`${t}-${index}`} value={t} 
                                checked={tag.includes(t)}
                                onChange={(e)=>{
                                    handleTagChange(t)
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
                        SetDisc(e.target.checked)
                        if(!disc){
                            setTag([...tag, 'discount'])
                        }else{
                            setTag(tag.filter(t => t !== 'discount'))
                        }
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