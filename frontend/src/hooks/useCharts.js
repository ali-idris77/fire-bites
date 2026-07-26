import {Area, Bar, Line, Pie} from 'recharts'

const useCharts = () => {
    const charts = {
       bar:Bar,
       line:Line,
       area:Area,
       pie:Pie
    }
    return charts;
}
 
export default useCharts;