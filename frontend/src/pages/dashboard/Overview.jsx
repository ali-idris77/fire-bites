import {useState, useEffect} from 'react'
import useAdminAuthContext from "../../hooks/useAdminAuthContext"
import { socket } from '../../sockets/socket'
import '../../styles/dashboard.css'
import Chart from '../../components/Chart'

export default function Overview() {
  const [ovrData, setOvrData] = useState({})
  const [pop, setPop] = useState([])
  const [ordChart, setOrdChart] = useState([])
  const [resevs, setResevs] = useState([])
  const [ld, SetLd] = useState(false)
  const {admin} = useAdminAuthContext()

  useEffect(()=>{
    const fetchOvrvw = async ()=>{
      SetLd(true)
      try{
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/dash/overview-data`,{
        headers:{'authorization':`Bearer ${admin.token}`}
      })
      const {today_rev, today_ord, pend_ord, ord_stats, pop_dish, resev} = await res.json()
      if(res.ok){
        setOvrData({today:today_rev, order:today_ord,pend:pend_ord})
        setPop(pop_dish)
        setOrdChart(ord_stats)
        setResevs(resev)
        SetLd(false)
      }
    }catch(err){
       console.log(err)
      SetLd(false)
    }
    }
    fetchOvrvw()
     socket.on("analytics-update", ()=>{
          let timeOut
      clearTimeout(timeOut)
      timeOut = setTimeout(()=>{
        fetchOvrvw()
      }, 500)
        })
      return ()=>{
        socket.off("analytics-update")
      }
  }, [])
  
  return (
    <div className="wrapper">
      <h2>Welcome, {admin.user}</h2>
      <div className="dash-grid">
      <div className="dash-card d1">
        <h3>Today's Sales</h3>
        <div className="content">
        {ld ? (<h3>loadin..</h3>): <h2 className="nums">{ovrData?.today?.[0]?.revenue ?? 0}</h2>}
        </div>
      </div>
      <div className="dash-card d2">
        <h3>Today's Orders</h3>
        <div className="content">
        {ld ? (<h3>loadin...</h3>): <h2 className="nums">{ovrData?.order?.[0]?.totalOrder ?? 0}</h2>}
        </div>
      </div>
      <div className="dash-card d3">
        <h3>Pending Orders</h3>
        <div className="content">
        {ld ? (<h3>loadin...</h3>): <h2 className="nums">{ovrData?.pend?.[0]?.revenue ?? 0}</h2>}
        </div>
      </div>
      <div className="dash-card d4">
        <h3>Orders By Status</h3>
        <div className="content">
          {ld ? (<h3>loadin...</h3>) : <Chart type='donut' data={ordChart} xKey="_id" dataKey="total" />}
        </div>
      </div>
      <div className="dash-card d5">
        <h3>Popular Dishes</h3>
        <div className="content">
          {ld ? (<h3>loadin...</h3>) : <Chart type='bar' data={pop} color="#4c5558" xKey="dish.name" dataKey="totalOrder" />}
        </div>
      </div>
      <div className="dash-card d6">
        <h3>Reservations</h3>
        <div className="content">
          <table>
            <thead><tr>
              <th>Name Of Customer</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Guest</th>
              <th>Date</th>
              <th>Time</th>
            </tr></thead>
            {resevs?.length > 0 && (
              <tbody>
                {resevs?.length > 0 && resevs.map( r =>{
                  return(
                    <tr key={r._id}>
                      <td>{r.customerName}</td>
                      <td>{r.phone}</td>
                      <td>{r.email}</td>
                      <td>{r.guests}</td>
                      <td>{new Date(r.reservationDate).toDateString()}</td>
                      <td>{new Date(r.reservationDate).toTimeString().split('GMT')[0]}</td>
                    </tr>
                  )
                })}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
    </div>
  )
}
