module.exports = reservation =>{
    let text 
    switch(reservation.status){
        case 'confirmed':
            text = 'We look forward to serving you.'
        case 'completed':
            text = 'Please come by again.'
        case 'rejected':
            text = 'Sorry for the inconveniences.'
        default:
            text = 'We hope to see you still.'
    }
return `
<div style="display: flex; align-items: center; gap: 2px;">
      <h2  style='font-family: quicksand; color:#EB2F00;'>Firey</h2>
    <h2 style='font-family: quicksand;' >Bites</h2></div>
    <h2>Reservation ${reservation.status ==='no-show'? 'Cancelled': reservation.status}</h2>
<p>Hello ${reservation.customerName}</p>
<p> Your reservation has been ${reservation.status ==='no-show'? "cancelled because you did not show": reservation.status}</p>
<p>Date: ${new Date(reservation.reservationDate).toDateString()}</p>
<p>Time: ${new Date(reservation.reservationDate).toTimeString()}</p>
<p>Guests: ${reservation.guests} guests</p>
<p>${text}</p>
`}