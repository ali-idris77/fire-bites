import '../styles/about.css'
import { delay, easeOut, motion } from 'framer-motion'

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


export default function About() {
  return (
    <>
    <section className="abt-hero">
      <div className="abtdiv">
        <span>
          <motion.h1 initial={{
            opacity:0, x:100
          }}
          animate={{opacity:1, x:0}}
          transition={{duration:1.2}}
          >Wag'wan With <span className="firey">Firey</span> Bites</motion.h1>
          <motion.h1 initial={{
            opacity:0, x:-100
          }}
          animate={{opacity:1, x:0}}
          transition={{duration:1.2, delay:0.2}}
          >The Taste of Greatness</motion.h1>
        </span>
        <motion.p initial={{
          opacity:0, y:30
        }}
        animate={{opacity:1, y:0}}
        transition={{duration:1.2, delay:0.4}}
        >How we came about this exclusive citadel of ours, owing to our legacy and promise to always serve nothing but the best.</motion.p>
      </div>
    </section>
    <motion.section className="abt-s abt"
    variants={container}
    initial="hidden"
    whileInView="show"
    viewport={{once:true, amount:0.3}}
    >
      <motion.h2 variants={item}>Who <span className="firey">Are</span> We</motion.h2>
      <motion.p variants={item}>
        We at firey bites are a team of well skilled culinery experts brought together by one goal -- serve the best dish to the people --. We take meals quite seriously and always try to ensure that we serve only highly quality meals to our customers. Be it breakfast , lunch or eve dinner every meal is like a king's feast at firey bites. Established in 2026 firey bites aims to dominate the culinary world with cutting edge techniques and passion filled meals. Our chefs have been trained n the most appropriate ways possible from france to japan, all over the world, and as such they have only one thing in mind which is to produce the best meal. So what are you waiting for , dine with us today. 
      </motion.p>
      <motion.button className='cta' variants={item}>Place An Order</motion.button>
    </motion.section>
    <motion.section className="abt-s loct"
    variants={container}
    initial="hidden"
    whileInView="show"
    viewport={{once:true, amount:0.3}}
    >
      <motion.h2 variants={item}>Come <span className="firey">Over </span> To <span className="firey"> Our</span> Yard</motion.h2>
    </motion.section>
    <motion.section className="abt-s socials"
    variants={container}
    initial="hidden"
    whileInView="show"
    viewport={{once:true, amount:0.3}}
    >
      <motion.h2 variants={item}>Find Us <span className="firey">Online</span></motion.h2>
    </motion.section>
    </>
  )
}
