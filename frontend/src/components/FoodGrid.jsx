import {motion} from 'framer-motion'
import {useNavigate} from 'react-router-dom'
import useCartContext from '../hooks/useCartContext'
import Icon from './Icon'
import { useState } from 'react'
import useAuthContext from '../hooks/useAuthContext'
import useOrderContext from '../hooks/useOrderContext'
import Swal from 'sweetalert2'
import useAuthSwal from '../hooks/useAuthSwal'
import CardSkeleton from './loader/CardSkeleton'

export default function FoodGrid({foods, loading, item}) {
  const [adding, setAdding] = useState(null)
  const [orderingId, setOrderingId] = useState(null)
    const {dispatch} = useCartContext()
    const {dispatch: o_dispatch} = useOrderContext()
    const {user} = useAuthContext()
    const navigate = useNavigate()
    

    const addCart = async (f)=>{
      if(!user){
        Swal.fire({
          icon:'info',
          title:'Sign Up Needed',
          text:'You need to be signed in to add anything to bag',
          showCancelButton:true
        }).then(result => {
          if(result.isConfirmed){
            navigate('/login')
          }
        })
      }
      setAdding(f._id)
    try{
      const valu = await Swal.fire({
        title:'How Many Servings',
        html:`
          <div class='qty-div'>
          <button id='inc' >+</button>
          <input type='number' id='qtin' value=1/>
          <button class='dec'>-</button>
          </div>
        `,
        showCancelButton:true,
        confirmButtonText:'Add to bag',
        didOpen: ()=>{
          const qty = document.getElementById('qtin')
          const inc = document.getElementById('inc')
          const dec = document.getElementById('dec')

          inc.addEventListener('click', ()=>{
            qty.value = Number(qty.value) + 1;
          })
          dec.addEventListener('click', ()=>{
            if(Number(qty.value) > 1){
            qty.value = Number(qty.value) - 1
            }
          })
        },
        preConfirm : ()=> {
          return Number(document.getElementById('qtin').value)
        }
      })
      if(!valu.isConfirmed){
        Swal.fire({
          title:'Problem',
          text:'yh issue'
        })
        setAdding(false)
         return
        }
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/create`,{
        method:'POST',
        headers:{'Content-Type':'application/json',
          'authorization':`Bearer ${user.token}`
        },
        body:JSON.stringify({dishId:f._id, quantity: valu.value || 1})
      })
      const data = await res.json()
      if(res.ok){
        const itm = data.items.filter(i => i.dish._id === f._id)
        (itm[0])
        dispatch({type:'ADD_CART', payload:itm[0]})
        setAdding(null)
        Swal.fire({
          title:'Added To Bag',
          icon:'success'
        })
      }else{
        setAdding(null)
      }
    }catch(err){
        setAdding(null)
      }
    }

    const order = async(f)=>{
      if(!f) return
      setOrderingId(f._id)
      try{
        let customerEmail
        let customerPhone
        if(!user){
          const authData = await useAuthSwal()
          if(!authData?.value){
            setOrderingId(null)
            return
          }
          customerEmail = authData.value.email
          customerPhone = authData.value.phone
        }else{
          customerEmail = user.email
          customerPhone = user.user
        }

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/checkout`,{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({
            customerEmail,
            customerPhone,
            amount: Number(f?.discountPrice || f.price),
            items:[{dishId:f._id, quantity:1}]
          })
        })

        const data = await res.json()
        if(res.ok && data.authorization_url){
          window.location.assign(data.authorization_url)
        }else{
          Swal.fire({
            icon:'error',
            title:'Checkout failed',
            text:data.message || 'Unable to start checkout right now.'
          })
        }
      }catch(err){
        console.log(err)
        Swal.fire({
          icon:'error',
          title:'Checkout failed',
          text:'Please try again in a moment.'
        })
      }finally{
        setOrderingId(null)
      }
    }

  return (<>
    {
    loading ?
    Array.from({length:6}).map((_, i)=>{
      return (
        <CardSkeleton key={i}/>
      )
    })
    : foods ? foods.map(f => {
                  return (
                    <motion.div variants={item} className="dish-card" key={f._id}>
                <div className="thumb"><img src={`${import.meta.env.VITE_API_URL}/api/uploads/dishes/${f.image.url}`} alt={`dish thumbnail - ${f.name}`}/> <div className='tags'>
                  {f.tags && f.tags.map((t, index) =>{
                    if(t === 'discount'){
                      return (
                        <span key={index} className='discount'> {`${f.discountPercentage}% off`} </span>
                      )
                    }
                    return (
                      <span className={t} key={index}>{t}</span>
                    )
                  })}
                  </div> </div>
                <div className="detail">
                  <p className="name">{f.name}</p>
                  <p className="category">{f.category}</p>
                  {f.discountPercentage ?(
                    <div>
                      <p className="price">₦{f.discountPrice}</p>
                      <p className="oldprice">₦{f.price}</p>
                    </div>
                  ) :
                  (<p className="price">₦{f.price}</p>) }
                  <div className="action"><button 
                  disabled={adding=== f._id}
                  onClick={()=>{
                    addCart(f)
                  }}> <Icon name='bag' className='bag-btn' /> { adding === f._id ? 'Adding' :'Add'} to bag</button><button disabled={orderingId===f._id} onClick={()=>{
                    order(f)
                  }}>{orderingId===f._id ? 'Ordering...' : 'order'}</button></div>
                </div>
              </motion.div>
                  )
                }) :
                <h3 className='empty-state'>No dishes available</h3>}
                </>
  )
}
