import Image from "next/image";
import { Button } from "@mui/material";
import Link from 'next/link';

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Link href="/storage" passHref>
        <Button variant="contained" color="primary">
          Ver armazenamentos
        </Button>
      </Link>
    </div>
  );
}