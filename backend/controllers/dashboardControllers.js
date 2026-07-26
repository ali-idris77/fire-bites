/** @type {import("mongoose").Model<any>} */
const Order = require('../models/order')
/** @type {import("mongoose").Model<any>} */
const Dish = require('../models/dish')
/** @type {import("mongoose").Model<any>} */
const Customer = require('../models/customer')
/** @type {import("mongoose").Model<any>} */
const Reservation = require('../models/reserve')
/** @type {typeof import("dayjs")} */
const dayjs = require('dayjs')

const startOfToday = dayjs().startOf("day").toDate()
const startOfTomorrow = dayjs().add(1, "day").startOf("day").toDate()
const startOfWeek = dayjs().startOf("week").toDate()
const endOfWeek = dayjs().endOf('week').toDate()
const startOfMonth = dayjs().startOf('month').toDate()
const startOfNextMonth = dayjs().add(1, 'month').startOf('month').toDate()
const sevenDaysAgo = dayjs().subtract(7, 'day').toDate()
const twelveWeeksAgo = dayjs().subtract(12, 'week').toDate()
const twlvMonthsAgo = dayjs().subtract(12, 'month').toDate()

module.exports.overview_values = async (req, res)=>{
    try{
        const [today_rev, today_ord, pend_ord, ord_stats, pop_dish, resev] = await Promise.all([
   Order.aggregate([
        {
            $match:{
            status: "completed",
            createdAt:{
                $gte:startOfToday,
                $lt:startOfTomorrow
            }
        }},{
        $group:{
            _id:null,
            revenue:{
                $sum:"$amount"
            }
        }
        
    }
    ]),
     Order.aggregate([
        {
            $match:{
            createdAt:{
                $gte:startOfWeek,
                $lt:endOfWeek
            }
        }},{
        $group:{
            _id:null,
            totalOrder:{
                $sum:1
            }
        }
        
    }
    ]),
     Order.aggregate([
        {
            $match:{
            status: "pending"
        }},{
        $group:{
            _id:null,
            revenue:{
                $sum:1
            }
        }
        
    }
    ]),
     Order.aggregate([
        {
            $group:{
            _id:"$status",
            total:{
                $sum:1
            }
        }
    }
    ]),
     Order.aggregate([
      {
        $match:{
            status:"completed"
        }
    },
        {
            $group:{
            _id:"$dish",
            unitSold:{
                $sum:"$quantity"
            },
            revenue:{
                $sum:"$amount"
            },
            totalOrder:{
                $sum:1
            }
        }
    },
        {
            $sort:{
            unitSold: -1
        }
      },
      {
        $limit:3
      },
      {
        $lookup:{
            from: "dishes",
            localField: "_id",
            foreignField: "_id",
            as: "dish"
        }
      },{
        $unwind: "$dish"
      },
      {
        $project: {
            _id:0,
            unitSold:1,
            revenue: 1,
            totalOrder: 1,

            "dish._id": 1,
            "dish.name": 1,
        }
    }  
    ]),
     Reservation.find().sort({createdAt:-1}).limit(10)
    ])
    res.status(200).json({today_rev, today_ord, pend_ord, ord_stats, pop_dish, resev})
    }catch(err){
        console.log(err)
        res.status(500).json(err.message)
    }
}
module.exports.analytics_values = async (req, res)=>{
    try{
    const [today_rev,ttl_rev, week_rev, month_rev,  ord_stats, ord_ttl, ord_chrt, ttl_cust, new_cust, ret_cust, tot_resev,best_dish,less_dish, resev_stat] = await Promise.all([
     Order.aggregate([
        {
            $match:{
            status: "completed",
            createdAt:{
                $gte:startOfToday,
                $lt:startOfTomorrow
            }
        }},
        {
        $group:{
            _id:null,
            revenue:{
                $sum:"$amount"
            }
        }
    }
    ]),
    Order.aggregate([
        {
            $match:{
            status: "completed",
        }},{
        $group:{
            _id:null,
            revenue:{
                $sum:"$amount"
            }
        }
        
    }
    ]),
     Order.aggregate([
        {
            $match:{
            status: "completed",
            createdAt:{
                $gte:startOfWeek,
                $lt:endOfWeek
            }
        }},{
        $group:{
            _id:null,
            revenue:{
                $sum:"$amount"
            }
        }
        
    }
    ]),
     Order.aggregate([
        {
            $match:{
            status: "completed",
            createdAt:{
                $gte:startOfMonth,
                $lt:startOfNextMonth
            }
        }},{
        $group:{
            _id:null,
            revenue:{
                $sum:"$amount"
            }
        }
        
    }
    ]),
     Order.aggregate([
        {
            $group:{
            _id:"$status",
            total:{
                $sum:1
            }
        }
    }
    ]),
     Order.aggregate([
        {
            $group:{
            _id:null,
            total:{
                $sum:1
            }
        }
    }
    ]),
     Order.aggregate([
        {
                $match:{
                    status: "completed",
                    createdAt:{
                        $gte:sevenDaysAgo
                    }
                }
            },
            {
                $group:{
                    _id:{
                        day: {$dayOfMonth: "$createdAt"},
                        },
                    sum:{$sum: 1}
                }
            },
            {
                $sort:{
                    "_id.day":1
                }
            }
    ]),
     Customer.aggregate([
        {
            $group:{
            _id:null,
            total:{
                $sum:1
            }
        }
    }
    ]),
     Customer.aggregate([
     {
        $match:{
            createdAt:{
                $gte:startOfMonth,
                $lt:startOfNextMonth
            }
        }
     },
     {
            $group:{
            _id:null,
            total:{
                $sum:1
            }
        }   
    }
    ]),
     Order.aggregate([
        {
            $match:{
            status:'completed'
        }
    },
    {
        $group:{
            _id:"$customerEmail",
            totalOrder:{
                $sum:1
            }
        }
    },
    {
        $match:{
            totalOrder: {
                $gte: 2
            }
        }
    }
    ]),
     Reservation.aggregate([
        {
            $group:{
                _id: null,
                totalResev:{
                    $sum:1
                }
            }
        }
    ]),
    Order.aggregate([
      {
        $match:{
            status:"completed"
        }
    },
        {
            $group:{
            _id:"$dish",
            unitSold:{
                $sum:"$quantity"
            },
            revenue:{
                $sum:"$amount"
            },
            totalOrder:{
                $sum:1
            }
        }
    },
        {
            $sort:{
            unitSold: -1
        }
      },
      {
        $limit:3
      },
      {
        $lookup:{
            from: "dishes",
            localField: "_id",
            foreignField: "_id",
            as: "dish"
        }
      },{
        $unwind: "$dish"
      },
      {
        $project: {
            _id:0,
            unitSold:1,
            revenue: 1,
            totalOrder: 1,

            "dish._id": 1,
            "dish.name": 1,
        }
    }  
    ]),
    Order.aggregate([
      {
        $match:{
            status:"completed"
        }
    },
        {
            $group:{
            _id:"$dish",
            unitSold:{
                $sum:"$quantity"
            },
            revenue:{
                $sum:"$amount"
            },
            totalOrder:{
                $sum:1
            }
        }
    },
        {
            $sort:{
            unitSold: 1
        }
      },
      {
        $limit:3
      },
      {
        $lookup:{
            from: "dishes",
            localField: "_id",
            foreignField: "_id",
            as: "dish"
        }
      },{
        $unwind: "$dish"
      },
      {
        $project: {
            _id:0,
            unitSold:1,
            revenue: 1,
            totalOrder: 1,

            "dish._id": 1,
            "dish.name": 1,
        }
    }  
    ]),
     Reservation.aggregate([
        {
            $group:{
                _id:"$status",
                sum:{
                    $sum:1
                }
            }
        }
    ])
    ])
    res.status(200).json({today_rev,ttl_rev, week_rev, month_rev, ord_ttl, ord_chrt, ord_stats, ttl_cust, new_cust, ret_cust, tot_resev,best_dish,less_dish, resev_stat})
    }catch(err){
        console.log(err)
        res.status(500).json(err.message)
    }
}
module.exports.rev_ovt = async (req, res)=>{
    const {period = 'daily'} = req.query;
    let groupId;
    let dateMatch;
    let sortn;
    let lbl
    switch(period){
        case 'monthly':
        groupId = {
            year: { $year: "$createdAt"},
            month: { $month: "$createdAt"}
        }
        dateMatch = twlvMonthsAgo
        sortn = { "_id.year":1, "_id.month":1 }
        lbl =  {
                $concat: [
                    {$toString:"_id.year"},
                    " ",
                    {$toString:"_id.month"}
                ]
            }
        break;
        case 'weekly':
            groupId = {
                year: { $year: "$createdAt"},
                week: {$week: "$createdAt"}
            }
            dateMatch = twelveWeeksAgo
            sortn = { "_id.year":1, "_id.week":1 }
            lbl =  {
                $concat: [
                    {$toString:"_id.year"},
                    " ",
                    {$toString:"_id.week"}
                ]
            }
        break;
        default:
            groupId = {
                year: { $year: "$createdAt"},
                month: { $month: "$createdAt"},
                day: {$dayOfMonth: "$createdAt"}
            }
            dateMatch = sevenDaysAgo
            sortn = { "_id.year":1, "_id.month":1, "_id.day":1 }
            lbl =  {
                $concat: [
                    {$toString:"_id.year"},
                    " ",
                    {$toString:"_id.month"},
                    " ",
                    {$toString:"_id.day"}
                ]
            }
        
    }
    try{
        const rev_ovrtm = await Order.aggregate([
            {
                $match:{
                    status: "completed",
                    createdAt: {
                        $gte: dateMatch
                    }
                }
            },
            {
                $group:{
                    _id:groupId,
                    revenue:{ $sum:"$amount"}
                }
            },
            {
                $sort:sortn
            },
            {
                $project: {
                    _id: 0,
                    label: lbl,
                    revenue: 1
                }
            }
        ])
        res.status(200).json(rev_ovrtm)
    }catch(err){
        console.log(err)
        res.status(500).json(err.message)
    }
}
module.exports.busy_hrs = async (req, res)=>{
    try{
        const busy_hr = await Reservation.aggregate([
            {
                $match:{
                    status: "confirmed"
                }
            },
            {
                $group:{
                    _id:{
                        day: {$dayOfMonth: "$reservationDate"},
                        hour: {$hour: "$reservationDate"}
                    },
                    reservations:{$sum: 1}
                }
            },
            {
                $sort:{
                    "_id.day":1,
                    "_id.hour":1
                }
            },
            {
                $project: {
                    _id: 0,
                    label: {
                        $concat: [
                            {$toString:"_id.day"},
                            " ",
                            {$toString:"_id.hour"},
                            ":00"
                        ]
                    },
                    reservations: 1
                }
            }
        ])
        res.status(200).json(busy_hr)
    }catch(err){
        console.log(err)
        res.status(500).json(err.message)
    }
}