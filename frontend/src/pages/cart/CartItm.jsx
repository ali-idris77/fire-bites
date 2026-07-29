import {useState} from 'react'
import useCartContext from '../../hooks/useCartContext'
import useOrderContext from '../../hooks/useOrderContext'
import useAuthContext from '../../hooks/useAuthContext'
import useReserveContext from '../../hooks/useReserveContext'
import Skeleton from '../../components/Skeleton'
import Swal from 'sweetalert2'
import useAuthSwal from '../../hooks/useAuthSwal'

export default function Cart() {
    const {items, dispatch, cartLoading} = useCartContext()
    const {order, dispatch: o_disp, orderLoading } = useOrderContext()
    const {reserves, dispatch: r_dispatch ,reserveLoading} = useReserveContext()
    const [checkingOut, setCheckingOut] = useState(false)
    const {user} = useAuthContext()
    

    let totl = 0
    if (items && items.length > 0) {
        totl = items.reduce((sum, item) => {
            const price = item.dish.discountPrice != null && item.dish.discountPrice !== 0
                ? item.dish.discountPrice
                : item.dish.price
            return sum + price * item.quantity
        }, 0)
    }
    console.log('total', totl)
    const updCart = async (itm ,typ='rem')=>{
        let qty;
        if(typ === 'add'){
            qty = itm.quantity + 1
        }else{
            qty = itm.quantity - 1
        }
        try{
            console.log(qty, itm.dish._id)
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/update`,{
            method:'POST',
            headers:{'Content-Type':'application/json',
                "Authorization":`Bearer ${user.token}`
            },
            body:JSON.stringify({
                dishId:itm.dish._id,
                quantity: qty
            })
        })
        const data = await res.json()
        const upd = data.items.filter(i => i.dish._id === itm.dish._id)

        if(res.ok){
            dispatch({type:"UPD_CART", payload:upd[0]})
        }
    }catch(err){
            console.log(err)
        }
    }
   const removeCartItem = async (itm)=>{
   console.log('removing../...')
    try{
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/delete`,{
            method:'POST',
            headers:{'Content-Type':'application/json',
                "Authorization":`Bearer ${user.token}`
            },
            body:JSON.stringify({
                dishId:itm.dish._id
            }) 
        })
        if(res.ok){
            console.log('removed ', itm)
            dispatch({type:'DEL_CART', payload:itm})
        }
    }catch(err){
        console.log(err)
    }
   }

   const handleCheckout = async ()=>{
    if(!items.length) return
    setCheckingOut(true)
    try{
        let customerEmail
        let customerPhone

        if(!user){
            const authData = await useAuthSwal()
            if(!authData?.value){
                setCheckingOut(false)
                return
            }
            customerEmail = authData.value.email
            customerPhone = authData.value.phone
        }else{
            customerEmail = user.email
            customerPhone = user.user
        }

        const payload = {
            customerEmail,
            customerPhone,
            amount: Number(totl),
            items: items.map(item => ({dishId:item.dish._id, quantity:item.quantity}))
        }

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/checkout`,{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(payload)
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
        setCheckingOut(false)
    }
   }
  return (
    <>
    <section className='caart'>
    <h2 className='hddr'>Your Food Bag</h2>
    <div className="cart-div">
    { cartLoading ? 
         Array.from({length:6}).map((_, i)=>{
                return (
                  <div className="skelcrd">
                    <div className="thumb">
                      <Skeleton width="100%" height="100%" radius="0" />
                    </div>
                    <div className="dets">
                      <Skeleton height="1.5rem" width="70%"/>
                      <Skeleton height="1.5rem" width="45%"/>
                      <Skeleton height="1.5rem" width="30%"/>
                    </div>
                  </div>
                )
              })
    :  (items.length > 0 ? items.map(c =>{ return(
            <div className="crtdv" key={c.dish._id}>
                <div className="crtthumb">
                    <img src={`${import.meta.env.VITE_API_URL}/api/uploads/dishes/${c.dish.image.url}`} alt="" />
                </div>
                <div className="cdtl">
                    <p className="name">
                        {c.dish.name}
                    </p>
                    <p className="price">
                        {c.dish.discountPercentage ? c.dish.discountPrice : c.dish.price}
                    </p>
                    <p className="qty">
                        {c.quantity}
                    </p>
                </div>
                <div className="action">
                    <div className="inc">
                        <button onClick={()=>{
                            updCart(c)}}>-</button>
                        <button onClick={()=>{
                            updCart(c, 'add')}}>+</button></div>
                    <button
                    onClick={()=>{
                        removeCartItem(c)
                    }}>remove</button>
                </div>
              </div>
              )
            }) : <h3 className='empty-state'>no cart items</h3>)
        } 
        {items.length > 0 && <div className="checkout">
                <p>total: {totl}</p>
                <button disabled={checkingOut} onClick={handleCheckout}>{checkingOut ? 'Redirecting...' : 'Checkout'}</button>
         </div>}
    </div></section>
    </>
  )
}
