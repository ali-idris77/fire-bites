import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis , YAxis  } from "recharts"


export default function Chart({type='area', data=[], dataKey, xKey, color='#eb2f00', height=300}) {
    const CLR = ['#eb2f00', '#2385d6', '#3ce482','#1215d4','#f0e009','#717174']
   const renderCharts = ()=>{
    switch(type){
        case 'bar':
            return(
                <BarChart data={data} >
                    <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                    <XAxis angle={-10} interval={0} textAnchor="center" tick={{fontSize: 11}} dataKey={xKey}/>
                    <YAxis tick={{fontSize: 11}}/>
                    <Legend/>
                    <Tooltip/>
                    <Bar fill={color} dataKey={dataKey} radius={[5, 5, 0, 0]}/>
                </BarChart>
            )
        case 'line':
            return(
                <LineChart data={data} >
                    <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                    <XAxis interval={0} tick={{fontSize: 11}} dataKey={xKey}/>
                    <YAxis tick={{fontSize: 11}}/>
                    <Legend/>
                    <Tooltip/>
                    <Line dataKey={dataKey} stroke={color} dot={false} strokeWidth={3} activeDot={{r:7}} type="monotone" />
                </LineChart>
            )
        case 'pie':
            return(
                <PieChart >
                    <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                    <Legend/>
                    <Tooltip/>
                    <Pie data={data} dataKey={dataKey} nameKey={xKey} outerRadius={100} paddingAngle={4}>
                        { data.length > 0 &&  
                        data?.map((_, index)=>(
                            <Cell key={index}
                            fill={CLR[index % CLR.length]}/>
                        ))
                        }
                    </Pie>
                </PieChart>
            )
        case 'donut':
            return(
                <PieChart >
                    <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                    <Legend/>
                    <Tooltip/>
                    <Pie data={data} dataKey={dataKey} nameKey={xKey} innerRadius={50} outerRadius={100} paddingAngle={4}>
                        { data.length > 0 &&  
                        data?.map((_, index)=>(
                            <Cell key={index}
                            fill={CLR[index % CLR.length]}/>
                        ))
                        }
                    </Pie>
                </PieChart>
            )
        default:
            return(
                <AreaChart data={data} >
                    <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                    <XAxis interval={0} tick={{fontSize: 11}} dataKey={xKey}/>
                    <YAxis tick={{fontSize: 11}}/>
                    <Legend/>
                    <Tooltip/>
                    <Area fill={color} fillOpacity={0.6} stroke={color} strokeWidth={3} dataKey={dataKey} />
                </AreaChart>
            )
            
    }
   }
  return (
    <ResponsiveContainer width='100%' height={height}>
        {renderCharts()}
    </ResponsiveContainer>
  )
}
