// import {} from 're'
import { useCallback, useState, useEffect } from "react"
import useAdminAuthContext from "../../hooks/useAdminAuthContext"
import '../../styles/dashboard.css'
import { socket } from "../../sockets/socket"
import Chart from "../../components/Chart"
import Skeleton from "../../components/Skeleton"
import ChartSkeleton from "../../components/loader/ChartSkeleton"

export default function Analytics() {
  const [revData, setRevData] = useState({})
  const [orderData, setOrderData] = useState({})
  const [orderStats, setOrderStats] = useState({})
  const [resvData, setResvData] = useState({})
  const [resvStats, setResvStats] = useState({})
  const [custData, setCustData] = useState({})
  const [revchart, setRevchart] = useState([])
  const [bschart, setBschart] = useState([])
  const [lschart, setLschart] = useState([])
  const [bsyhr, setBsyhr] = useState([])
  const [ord, setOrd] = useState([])
  const [chartData, setChartData] = useState([])
  const [period, setPeriod] = useState('daily')
  const [cntLoad, setCntLoad] = useState(false)
  const [revLoad, setRevLoad] = useState(false)
  const {admin} = useAdminAuthContext()
  const downloadReport = async () => {
    try{
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/dash/download-report`, {
        method: 'GET',
        headers: { 'authorization': `Bearer ${admin.token}` }
      })
      if(!res.ok) throw new Error('Report download failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'analytics-report.pdf'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    }catch(err){
      console.error(err)
    }
  }
  
  //functions for fetching
  const fetchAnalytics = useCallback(async ()=>{
      setCntLoad(true)
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/dash/analytics-data`,{
        headers:{'authorization':`Bearer ${admin.token}`}
      })
      const {today_rev,ttl_rev, week_rev, month_rev, ord_ttl, ord_chrt, ord_stats,
             ttl_cust, new_cust, ret_cust, tot_resev,best_dish,less_dish, resev_stat} = await res.json()
      if(res.ok){
        setRevData({total:ttl_rev,today:today_rev, week:week_rev, month:month_rev})
        setOrderData({total:ord_ttl, group:ord_stats})
        setCustData({total:ttl_cust,new:new_cust,returnin:ret_cust})
        setResvData({total:tot_resev, group:resev_stat})
        setChartData(ord_chrt)
        setBschart(best_dish)
        setLschart(less_dish)
        if(ord_stats.length ){
          const pending = ord_stats.filter(r => r._id === 'pending')
          const ocompleted = ord_stats.filter(r => r._id === 'completed')
          const ocancelled = ord_stats.filter(r => r._id === 'cancelled')
          const ords = {
            pending: pending?.[0]?.total || 0,
            completed: ocompleted?.[0]?.total || 0,
            cancelled: ocancelled?.[0]?.total || 0
          }
          setOrderStats(ords)
        }
        if(resev_stat.length){
          const cancelled = resev_stat.filter(r => r._id === 'cancelled')
          const completed = resev_stat.filter(r => r._id === 'completed')
          const rsvs = {
            completed: completed?.[0]?.sum || 0,
            cancelled: cancelled?.[0]?.sum || 0
          }
          setResvStats(rsvs)
        }
        setCntLoad(false)

      }
    }, [])
  const fetchBusyHours = useCallback(async ()=>{
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/dash/busy-hours`,{
        headers:{'authorization':`Bearer ${admin.token}`}
      })
      const data = await res.json()
      if(res.ok){
        setBsyhr(data)
      }
    },[])
  const fetchRevData = useCallback(async ()=>{
      setRevLoad(true)
      try{
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/dash/revenue-over-time?period=${period}`,{
        headers:{'authorization':`Bearer ${admin.token}`}
      })
      const data = await res.json()
      if(res.ok){
      setRevchart(data)
      }}catch(err){
        console.log(err)
      }finally{
        setRevLoad(false)
      }
    }, [period])
  
  
  useEffect(()=>{    
      fetchAnalytics()
      fetchBusyHours()
      fetchRevData()    
  },[period, fetchAnalytics, fetchBusyHours, fetchBusyHours])
  useEffect(()=>{
    let timeOut
    socket.on("analytics-update", ()=>{
      clearTimeout(timeOut)
      timeOut = setTimeout(()=>{
        fetchAnalytics()
        fetchBusyHours()
        fetchRevData()
      }, 500)
    })
    return ()=>{
      socket.off("analytics-update")
    }
  },[])
  return (
    <div className="wrapper">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h2>Analyitcs</h2>
        <button onClick={downloadReport}>Download Report (PDF)</button>
      </div>
      <div className="ann dash-grid stagger">
      <div className="dash-card a1">
        <h3>Total Revenue</h3>
        <div className="content">
          {cntLoad ? <Skeleton height="2.5rem" width="40px"/> : <h2 className="nums">{revData?.total?.[0]?.revenue ?? 0}</h2>}
        </div>
      </div>
      <div className="dash-card a2">
        <h3>Today's Revenue</h3>
        <div className="content">
          {cntLoad ? <Skeleton height="2.5rem" width="40px"/> : <h2 className="nums">{revData?.today?.[0]?.revenue ?? 0}</h2>}
        </div>
      </div>
      <div className="dash-card a3">
        <h3>This Week's Revenue</h3>
        <div className="content">
          {cntLoad ? <Skeleton height="2.5rem" width="40px"/> : <h2 className="nums">{revData?.week?.[0]?.revenue ?? 0}</h2>}
        </div>
      </div>
      <div className="dash-card a4">
        <h3>This Month's Revenue</h3>
        <div className="content">
          {cntLoad ? <Skeleton height="2.5rem" width="40px"/> : <h2 className="nums">{revData?.month?.[0]?.revenue ?? 0}</h2>}
        </div>
      </div>
      <div className="dash-card a5">
        <h3>Total Orders</h3>
        <div className="content">
          {cntLoad ? <Skeleton height="2.5rem" width="40px"/> : <h2 className="nums">{orderData?.total?.[0]?.total ?? 0}</h2>}
        </div>
      </div>
      <div className="dash-card a6">
        <h3>Pending Orders</h3>
        <div className="content">
          {cntLoad ? <Skeleton height="2.5rem" width="40px"/> : <h2 className="nums">{orderStats?.pending ?? 0}</h2>}
        </div>
      </div>
      <div className="dash-card a7">
        <h3>Completed Orders</h3>
        <div className="content">
          {cntLoad ? <Skeleton height="2.5rem" width="40px"/> : <h2 className="nums">{orderStats?.completed ?? 0}</h2>}
        </div>
      </div>
      <div className="dash-card a8">
        <h3>Cancelled Orders</h3>
        <div className="content">
          {cntLoad ? <Skeleton height="2.5rem" width="40px"/> : <h2 className="nums">{orderStats?.cancelled ?? 0}</h2>}
        </div>
      </div>
      <div className="dash-card a9">
        <h3>Total Customers</h3>
        <div className="content">
          {cntLoad ? <Skeleton height="2.5rem" width="40px"/> : <h2 className="nums">{custData?.total?.[0]?.total ?? 0}</h2>}
        </div>
      </div>
      <div className="dash-card a10">
        <h3>New Customers This Month</h3>
        <div className="content">
          {cntLoad ? <Skeleton height="2.5rem" width="40px"/> : <h2 className="nums">{ custData?.new?.[0]?.total ?? 0}</h2>}
        </div>
      </div>
      <div className="dash-card a11">
        <h3>Returning Customers</h3>
        <div className="content">
          {cntLoad ? <Skeleton height="2.5rem" width="40px"/> : <h2 className="nums">{custData?.returnin?.[0]?.total ?? 0}</h2>}
        </div>
      </div>
      <div className="dash-card a12">
        <h3>Total Reservations</h3>
        <div className="content">
          {revLoad ? <Skeleton height="2.5rem" width="40px"/> : <h2 className="nums">{resvData?.total?.[0]?.totalResev ?? 0}</h2>}
        </div>
      </div>
      <div className="dash-card a13">
        <h3>Compeleted Reservations</h3>
        <div className="content">
          {cntLoad ? <Skeleton height="2.5rem" width="40px"/> : <h2 className="nums">{resvStats?.completed ?? 0}</h2>}
        </div>
      </div>
      <div className="dash-card a14">
        <h3>Cancelled Reservations</h3>
        <div className="content">
          {cntLoad ? <Skeleton height="2.5rem" width="40px"/> : <h2 className="nums">{resvStats?.cancelled ?? 0}</h2>}
        </div>
      </div>
      <div className="dash-card a15">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h3>Revenue Over Time</h3>
        <div className="butto"><span onClick={()=>{
          setPeriod('daily')
        }} className={`prd-spn ${period === 'daily' ? 'active' : ''}`}>Daily</span><span onClick={()=>{
          setPeriod('weekly')
        }} className={`prd-spn ${period === 'weekly' ? 'active' : ''}`}>Weekly</span><span onClick={()=>{
          setPeriod('monthly')
        }} className={`prd-spn ${period === 'monthly' ? 'active' : ''}`}>Monthly</span></div></div>
      <div className="butto tod"><span onClick={()=>{
          setPeriod('daily')
        }} className={`prd-spn ${period === 'daily' ? 'active' : ''}`}><h2>D</h2></span><span onClick={()=>{
          setPeriod('weekly')
        }} className={`prd-spn ${period === 'weekly' ? 'active' : ''}`}><h2>W</h2></span><span onClick={()=>{
          setPeriod('monthly')
        }} className={`prd-spn ${period === 'monthly' ? 'active' : ''}`}><h2>M</h2></span></div>
        <div className="content">
          {cntLoad ? <ChartSkeleton type="line"/> : <Chart type="area" data={revchart} xKey="label" dataKey="revenue" color="#2bb9f1" />}
        </div>
      </div>
      <div className="dash-card a16">
        <h3>Orders By Day</h3>
        <div className="content">
          {cntLoad ? <ChartSkeleton/> : <Chart type="line" data={chartData} xKey="_id.day" dataKey="sum" />}
        </div>
      </div>
      <div className="dash-card a17">
        <h3>Orders By Status</h3>
        <div className="content"> 
          {cntLoad ? <ChartSkeleton type="pie"/> : <Chart type="pie" data={orderData?.group} xKey="_id" dataKey="total" />}
        </div>
      </div>
      <div className="dash-card a18">
        <h3>Best Selling Dishes</h3>
        <div className="content">
          {cntLoad ? <ChartSkeleton/> : <Chart type="bar" data={bschart} xKey="dish.name" dataKey="totalOrder" color="#2bb9f1" />}
        </div>
      </div>
      <div className="dash-card a19">
        <h3>Least Selling Dishes</h3>
        <div className="content">
          {cntLoad ? <ChartSkeleton/> : <Chart type="bar" data={lschart} xKey="dish.name" dataKey="totalOrder" />}
        </div>
      </div>
      <div className="dash-card a20">
        <h3>Busy Hours (Reservations)</h3>
        <div className="content">
          {cntLoad ? <ChartSkeleton type="line"/> : <Chart type="Area" data={bsyhr} xKey="label" dataKey="reservations" color="#4c5558" />}
        </div>
      </div>
    </div>
    </div>
  )
}
