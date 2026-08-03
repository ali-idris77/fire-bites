import { useState } from "react"
import useDishContext from "../../hooks/useDishContext"
import {Link, useNavigate} from 'react-router-dom'
import useAdminAuthContext from "../../hooks/useAdminAuthContext"
import Swal from "sweetalert2"
import useToast from "../../hooks/useToast"
import Skeleton from "../../components/Skeleton"

export default function DishGrid() {
  const categry = ['grills', 'desserts', 'snacks', 'continental', 'pasta', 'noodles','casserole', 'pastry', 'breakfasts', 'combo', 'full-combo', '3-course-meal', 'fast-foods', 'specials', 'drinks', 'sandwiches', 'sides', 'carbs', 'rice-dishes', 'soups', 'proteins','healthy']
  const [page, setPage] = useState(1)
  const {toast, succtoast, errtoast} = useToast()
  const [search, setSearch] = useState('')
  const [categ, setCateg] = useState('')
  const [tag, setTag] = useState([])
  const [updl, setUpdl] = useState(false)
  const {admin} =useAdminAuthContext()
  const perPage = 12
  const {dishes, dispatch, dishLoading} = useDishContext()
  const sortedDishes = (dishes || []).slice().sort((a, b) => {
    const aActive = a.isActive !== false ? 1 : 0
    const bActive = b.isActive !== false ? 1 : 0
    if (aActive !== bActive) return bActive - aActive
    return new Date(b.createdAt) - new Date(a.createdAt)
  })
  const navigate = useNavigate()
  const filteredDishes = sortedDishes.filter(d => {
    const query = {
      search: search.trim().toLowerCase(),
      categ,
      tag
     }
    if(query.search && !d.name.toLowerCase().includes(query.search)) return false
    if(query.categ && d.category !== query.categ) return false
    if(query.tag.length && !query.tag.every( t => d.tags.includes(t))) return false
    return true
  })


  const currentDishes = filteredDishes.slice((page - 1)*perPage, page*perPage)

  const pageCount = Math.max(1, filteredDishes.length/perPage)
  const goPage = (newPage)=>{
    setPage(Math.min(Math.max(1, newPage), pageCount))
  }
  const delFood = async(u)=>{
  Swal.fire({
    title:'Delete confirmation',
    text:'Are you sure you want delete this dish?',
    showCancelButton:true,
    confirmButtonText:'Yes'
  }).then(async (result)=>{
    if(!result.isConfirmed) return
      setUpdl(true)
    try{
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/dish/${u._id}`,{
        method:'DELETE',
        headers:{'authorization':`Bearer ${admin.token}`}
      })
      const data = await res.json()
      if(res.ok){
        dispatch({type:'DELETE_DISH', payload:data})
        setUpdl(false)
        succtoast("Dish deleted successfully")
      }
    }catch(err){
      setUpdl(false)
      errtoast("Couldn't delete dish. try again later")
    }
  })
  }
  return (
    <>
      <h2>Dishes</h2>
      <section className='filter-sect'>
      <div className="filter-div">
      <div className="search">
        <input className='search-inp' type="text" value={search}
        placeholder='search dishes'
        onChange={(e)=>{
          setSearch(e.target.value)
        }}/>
      </div>
      <div className="filt" onChange={(e)=>{
        if(e.target.value === "") setTag([])
        else setTag([e.target.value])
      }}>
        <select name="" id="">
          <option value="">All</option>
          <option value="new">New</option>
          <option value="special">Special</option>
        </select>
        </div>
        <div className="filt" onChange={(e)=>{
      }}>
        <select name="" id="" onChange={(e)=>{
          setCateg(e.target.value)
        }}>
          <option value="">All</option>
          {categry.map((ct, i) => {
            return (
              <option value={ct} key={i}>{ct}</option>
            )
          })}
        </select>
        </div>
      </div>
    </section>
    <div className="btn">
      <Link to='/dashboard/dishes/create'><button>Create A Dish</button></Link>
    </div>
    <section className="dishes">
      { dishLoading ? Array.from({length:12}).map((_, i)=>{
        return (
          <div className="skelcrd" key={i}>
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
      }) : 
      currentDishes && currentDishes.length > 0 ? currentDishes.map(dish =>{ return(
            <div className="crtdv" key={dish._id}>
                <div className="crtthumb">
                    <img src={`${import.meta.env.VITE_API_URL}/api/uploads/dishes/${dish.image.url}`} alt="" />
                </div>
                <div className="cdtl">
                    <p className="name">
                        {dish.name}
                    </p>
                    <p className="price">
                        {dish.discountPercentage ? dish.discountPrice : dish.price}
                    </p>
                </div>
                <div className="action dsh">
                        <button onClick={()=>{
                          navigate(`/dashboard/dishes/edit/${dish._id}`)
                        }}>edit</button>
                        <button onClick={()=>{
                          delFood(dish)
                        }} >delete</button></div>
              </div>
              )
            }) : <h3 className="empty-state">No dishes yet</h3>}
    </section>
    <div className="pagination dsh">
      <button disabled={page <= 1} onClick={()=>{
        goPage(page - 1)
      }}>prev</button>
      <div className="page">
        {Math.round(page)}
       </div>
       <button disabled={page >= pageCount} onClick={()=>{
          goPage(page + 1)
        }}>next</button>
    </div>
    </>
  )
}
