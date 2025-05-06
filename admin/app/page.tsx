'use client'

import styles from "./page.module.css";
import { Button, Form } from "react-bootstrap";
import {useRouter} from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { userStore, } from "@/Store";
import { URL } from "@/constants";

export default function Home() {
  const router = useRouter()
  const { login, user } = userStore()


  useEffect(()=>{
    user && user.token ?
    router.replace('/dashboard')
    : null
  })
  const [formData, setFormData] = useState({
    email:'',
    password: ''
  })
  

  const handleLogin = async(e: React.FormEvent)=>{
    e.preventDefault()
    console.log(formData)
    const {data} = await axios.post(`${URL}/auth/login`, formData)
    console.log(data)
    if(data.token && data.user._id){
      login({
        ...data.user,
        token: data.token
      })

      console.log(userStore.getState());
      router.replace('/dashboard')
    }
  }

  const handleInputChange=(e: React.ChangeEvent<HTMLInputElement>)=>{
    const {name, value} = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Form onSubmit={handleLogin}>
          <Form.Group>
            <Form.Label>email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              required
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              required
              onChange={handleInputChange}
            />
          </Form.Group>
          <Button type="submit" className="my-2">LOGIN</Button>
        </Form>
      </main>
      <footer>

      </footer>
    </div>
  );
}
