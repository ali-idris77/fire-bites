export default function ({width='100%', height='1rem', radius='5px'}) {
  return (
    <div className="skeleton" style={{width:width, height:height, borderRadius:radius}}>
        <span></span>
    </div>
  )
}
