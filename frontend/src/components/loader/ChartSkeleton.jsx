import React from 'react'
import Skeleton from '../Skeleton'

export default function ChartSkeleton({type='short'}) {
    const renderSkel = ()=>{
        switch(type){
        case 'pie':
            return(
                <>
                <Skeleton height='15rem' width='15rem' radius='50%'/>
                </>
            )
        case 'line':
            return(
                <>
                <Skeleton height='2rem' width='50%'/>
                <Skeleton height='2rem' width='90%'/>
                <Skeleton height='2rem' width='82%'/>
                <Skeleton height='2rem' width='99%'/>
                </>
            )
        default:
            return(
                <>
                <Skeleton height='50%' width='4rem'/>
                <Skeleton height='70%' width='4rem'/>
                <Skeleton height='40%' width='4rem'/>
                <Skeleton height='72%' width='4rem'/>
                <Skeleton height='80%' width='4rem'/>
                </>
            )
    }
    }
  return (
    <div className='chartSkel'>
        <div className={`axis ${type}`}>
            {renderSkel()}
        </div>
    </div>
  )
}
