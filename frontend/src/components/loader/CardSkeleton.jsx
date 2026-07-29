import Skeleton from '../Skeleton'

export default function CardSkeleton() {
  return (
    <div className="dish-skel">
        <div className="thumb">
            <Skeleton height='200px'/>
        </div>
        <div className="detail">
            <Skeleton height='1.75rem'/>
            <Skeleton width='45%'/>
            <Skeleton height='1.3rem' width='30%'/>
            <Skeleton height='2.5rem' width='70%' radius='25px'/>
        </div>
    </div>
  )
}
