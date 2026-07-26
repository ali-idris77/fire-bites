import {useState, useEffect} from 'react'
import useCartContext from '../hooks/useCartContext'
import useOrderContext from '../hooks/useOrderContext'
import useAuthContext from '../hooks/useAuthContext'
import useReserveContext from '../hooks/useReserveContext'

export default function Cart() {
    const {items, dispatch, cartLoading} = useCartContext()
    const {order} = useOrderContext()
    const {reserves} = useReserveContext()
    const [total, setTotal] = useState('')
    const {user} = useAuthContext()
    

    let totl
    if(items && items.length > 0){
        totl = items.reduce((sum, item) => {
        const price = items.discountPrice != null || items.discountPrice != 0 ? item.dish.discountPrice : item.dish.price
       return (price * item.quantity) + sum, 0})
    }

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
            console.log(itm)
            dispatch({type:'DEL_CART', payload:itm})
        }
    }catch(err){
        console.log(err)
    }
   }
   console.log(reserves)
   console.log('isarray', Array.isArray(items))
  return (
    <>
    <h1>Your Food Bag</h1>
    { cartLoading ? 
        <div className="load">
            loading...
        </div>
    : <section className="cart-div">
        {
        items.length > 0 && Array.isArray(items) ? items.map(c =>{ return(
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
            }) : <p>no cart item</p>
            
        } 
        {items.length > 0 && <div className="checkout">
                <p>total:0</p>
            </div>}
    </section>}
     
    <section className="reserve">
        <h1>Your Reservations</h1>
        <div className="rsvdiv">
        {reserves && reserves.map(r =>{
            return (
                <div className="rsvcard" key={r._id}>
                    <div className="rdtl">
                      <h3>Reservation</h3>
                    <p>guests : <span>{r.guests}</span></p>
                    <p className="phn">Phone : <span>{r.phone}</span></p>
                    <p >Status : <span className={`sts ${r.status}`}>{r.status}</span></p>
                      </div>
                      <div className="tmdt">
                    <p>Date : <span>{new Date(r.reservationDate).toDateString()}</span></p>
                    <p>Time : <span>{new Date(r.reservationDate).toTimeString().split('GMT')[0]}</span></p>
                    </div>
                </div>
            )
        })}
        </div>
    </section>
    </>
  )
}
