import useIcons from "../hooks/useIcons"

export default function Icon({name , size=20, className}) {
    const icons = useIcons()
    const Component = icons[name]
    if(!Component){
        return null
    }
  return (
    <Component name={name} size={size} className={className} />
  )
}
