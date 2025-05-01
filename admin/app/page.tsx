'use client'

import styles from "./page.module.css";
import { Button } from "react-bootstrap";
import {useRouter} from "next/navigation";

export default function Home() {
  const router = useRouter()
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Button onClick={()=> router.push('/categories')}>
          Manage Categories
        </Button>
        <Button onClick={()=> router.push('/products')}>
          Manage Products
        </Button>
      </main>
      <footer>

      </footer>
    </div>
  );
}
