import {create} from 'zustand'
import { persist } from 'zustand/middleware'


export const userStore = create(
    persist((set)=>({
        user: null,

        login: (userData)=> set({
            user: userData,
            isAuth: false
        }),
        
        logout: ()=> set({
            user: null,
            isAuth: false
        })
    }),
    {
        name: 'user-storage',
        partialize: (state)=>({
            user: state.user
        })
    }
))