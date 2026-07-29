import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import '../styles/home.css'
import '../styles/responsive.css'
import {delay, easeOut, motion} from 'framer-motion'
import useDishContext from '../hooks/useDishContext'
import { Suspense } from 'react'
import FoodGrid from '../components/FoodGrid'
import CardSkeleton from '../components/loader/CardSkeleton'

const container = {
  hidden : {opacity: 0},
show: {
  opacity:1,
  transition: {
    staggerChildren: 0.2,
    delay:0.3
  },
},
}

const item = {
  hidden: {
  opacity: 0, y:30},
show:{
  opacity:1, y:0,
transition:{duration:1.2, easeOut}},
}

export default function Home() {
  const {dishes, disLoading} = useDishContext()
  const feature = dishes.filter(d => d.tags.includes("featured"))
  const featured = feature.slice(0, 6)


  return (
    <>
    <section className="hero">
        <div className="hero-div">
            <div className="hero-text">
             <span>
                <motion.h1 initial={{opacity:0, x:-100}}
                animate={{opacity:1.2, x:0}}
                transition={{duration:1, ease:"easeOut"}}>Take a <span className='firey'>Firey</span> Bite </motion.h1>
                <motion.h1 initial={{opacity:0, x:-100}}
                animate={{opacity:1, x:0}}
                transition={{duration:1.2, ease:"easeOut", delay:0.2}}> With Us.</motion.h1>
             </span>
            <motion.p initial={{opacity:0, x:-100}}
            animate={{opacity:1, x:0}}
            transition={{duration:1.2, ease:"easeOut", delay:0.4}}>
                Come have a firey bite with fire bites, there's nothing like set of unique delicacies. 
             </motion.p>
             <Link to="/menu">
             <motion.button initial={{opacity:0, x:-100}}
             animate={{opacity:1, x:0}}
             transition={{duration:1.2, ease:"easeOut", delay:0.6}}>Make An Order</motion.button>
             </Link>
            </div>    
            <div className="hero-img">
                <motion.img initial={{opacity:0, x:100}}
                animate={{opacity:1, x:0}}
                transition={{duration:1.8, ease:"easeOut"}} src="/plate.png" alt="" />
            </div>
        </div>    
    </section>
    <motion.section className="abt"
    variants={container}
    initial="hidden"
    whileInView="show"
    viewport={{once:true, amount:0.3}}
    >
        <motion.h2 className="headin"
        variants={item}
        >From<span className='firey'> Spicy Calamary</span> to <span className='firey'>Sweet Candy</span></motion.h2>
        <motion.div className="abt-text"
        variants={item}
        >
    Firey bites is a food citadel where different mouth watering manifestations are discovered and explored. Take a peek at our top gun mnd blowing relics. All starting as an online food creators we wish to spread our firey blessings to the world one bite at a time. 
        </motion.div>
    </motion.section>
    <motion.section className="featured"
    variants={container}
    initial="hidden"
    whileInView="show"
    viewport={{once:true, amount:0.3}}
    >
        <motion.h2 className="headin"
        variants={item}
        >Our <span className="firey">Featured</span>  Dishes.</motion.h2>
        <div className="ftrd-div">
          <FoodGrid foods={featured} loading={disLoading} item={item}/>
          </div>
    </motion.section>
    </>
  )
}
