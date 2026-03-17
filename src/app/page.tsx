'use client';
import Card from "@/components/card";
import Icon from "@/components/icon";
import Modal from "@/components/modal";
import { useActions } from "@/store/hooks";
import Search from "@/components/search";

export default function Home() {
  const { toggleCard } = useActions();
  return (
    <main>
      <Icon/>
      <Search/>
      <button onClick={() => toggleCard()}>Open Card Modal</button>
      {/* <Modal isOpened onClose={()=>{}}/> */}
      <div style={{height:"200vw"}}/>
      <Card />
    </main>
  );
}
