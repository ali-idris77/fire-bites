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
        Firey Bites is a warm, modern dining experience built around bold flavors, attentive service, and meals made with heart. Our team brings together passionate chefs, thoughtful hosts, and creative minds who believe every plate should feel memorable. From hearty breakfasts to comforting dinners, we create food that feels both elevated and familiar.
      </motion.p>
      <motion.button className='cta' variants={item}>Place An Order</motion.button>
    </motion.section>

    <motion.section className="abt-s loct"
    variants={container}
    initial="hidden"
    whileInView="show"
    viewport={{once:true, amount:0.3}}
    >
      <motion.h2 variants={item}>Where <span className="firey">To</span> Find Us</motion.h2>
      <motion.p variants={item}>
        You can enjoy our signature dishes at our cozy dining space, where comfort meets style. We welcome guests for lunch, dinner, and special occasions, and our team is always ready to make your visit feel personal and relaxing.
      </motion.p>
      <motion.div className="abt-details" variants={item}>
        <p><strong>Location:</strong> 12, Luxury Avenue, Lagos</p>
        <p><strong>Opening Hours:</strong> Monday to Sunday, 8:00 AM - 10:00 PM</p>
        <p><strong>Reservations:</strong> Available for brunches, dates, and private gatherings</p>
      </motion.div>
    </motion.section>

    <motion.section className="abt-s"
    variants={container}
    initial="hidden"
    whileInView="show"
    viewport={{once:true, amount:0.3}}
    >
      <motion.h2 variants={item}>Why <span className="firey">Choose</span> Us</motion.h2>
      <motion.p variants={item}>
        We are committed to giving every guest something more than a meal. It is the care behind each dish, the consistency of our service, and the joy of sharing a table that keeps people coming back.
      </motion.p>
      <motion.ul className="abt-list" variants={item}>
        <li>Fresh ingredients prepared with creativity and care.</li>
        <li>Fast, friendly service that puts you first.</li>
        <li>A welcoming atmosphere made for relaxing and reconnecting.</li>
      </motion.ul>
    </motion.section>
    </>
  )
}
