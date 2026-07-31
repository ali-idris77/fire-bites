import { useState , useEffect } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../components/Icon'
import useDishContext from '../../hooks/useDishContext'
import FoodGrid from '../../components/FoodGrid'

export default function Menu() {
  const categry = ['grills', 'desserts', 'snacks', 'continental', 'pasta', 'noodles','casserole', 'pastry', 'breakfasts', 'combo', 'full-combo', '3-course-meal', 'fast-foods', 'specials', 'drinks', 'sandwiches', 'sides', 'carbs', 'rice-dishes', 'soups', 'proteins','healthy']
  const {dishes, dishLoading} = useDishContext()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [categ, setCateg] = useState('')
  const [tag, setTag] = useState([])
  const [chosen, setChosen] = useState(null)
  const perPage = 12

  const sortedDishes = (dishes || []).slice().sort((a, b) => {
    const aActive = a.isActive !== false ? 1 : 0
    const bActive = b.isActive !== false ? 1 : 0
    if (aActive !== bActive) return bActive - aActive
    return new Date(b.createdAt) - new Date(a.createdAt)
  })

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
 
  const addCart = (item)=>{
    let cart = JSON.parse(localStorage.getItem('cart'))
    if(cart){
      cart = [...cart, item]
    }else{
      cart = [item]
    }
    const cartJson = JSON.stringify(cart)
    localStorage.setItem('cart', cartJson)
    alert('cart added')
  }  

  return (
    <>
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
        (e.target.value)
        if(e.target.value === "") setTag([])
        else setTag([e.target.value])
      }}>
        <select name="" id="">
          <option value="">All</option>
          <option value="new">New</option>
          <option value="special">Special</option>
        </select>
        </div>
      </div>
    </section>
    <section className="menu-hro">
      <div className="mnu-hdiv">
      <h1><span className='firey' >Check Out</span> Our Menu</h1>
      <h1>Lets <span className="firey" >Check Out</span> Your Cravings</h1>
      <Link to='/contact'><button>Wanna book a reservation instead?</button></Link>
      </div>
      <div className="mnu-img">
        <img src="/img/curry.webp" alt="" />
        </div>
    </section>
    <div className="ctg">
      {categry.map((c, i)=>{
        return(<div className={`ctgrd ${chosen === i ? 'active' : ''}`} key={i} data-categ={c} onClick={
          (e)=>{
            setChosen(i)
            setCateg(e.target.dataset.categ)
            }
        }>
          {c}
        </div>)
      })}
    </div>
    <section className="foods">
      <h2 className="headin">Our <span className="firey">Menu</span></h2>
     <div className="fd-div">
      <FoodGrid foods={currentDishes} loading={dishLoading} item={''}/>
     </div>
    </section>
    <div className='pagination'>
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
