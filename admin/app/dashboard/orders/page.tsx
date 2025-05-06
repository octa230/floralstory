'use client'

import { URL } from '@/constants'
import axios from 'axios'
import React, { useEffect } from 'react'
import { userStore } from '@/Store'

const OrdersScreeen = () => {

    const {user} = userStore()

    const getOrders=async()=> {
        console.log(user.token)

        const {data} = await axios.get(`${URL}/orders`, {
            headers:{
                Authorization: `Bearer ${user.token}`
            }
        })
        console.log(data)
    }
    useEffect(()=>{
        getOrders()
    }, [])
  return (
    <div>
      
    </div>
  )
}

export default OrdersScreeen
