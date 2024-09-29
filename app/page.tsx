"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  return (
    <>
    <header className="flex justify-center items-center space-x-2 mt-6">
    <Image src="/cards.png" alt="cards.png" className="w-20" width={80} height={80} />
    <h1 className="text-6xl text-amber-50 font-semibold">Hot Seat</h1>
  </header>
    <div className="grid grid-cols-1 w-5/6 sm:w-2/3 md:w-1/3 m-auto space-y-5 mt-10 text-center">
    <p className="text-2xl text-amber-50 font-semibold">Join a game...</p>
    <div className="space-x-4 flex justify-center w-full items-center">
      <input
             className="w-2/3 focus:ring-blue-500 focus:border-blue-500 rounded-xl p-2 pl-4 text-white bg-gray-500 block outline-none"
             placeholder="Enter Game Code..."
             id="gameIdInput" />
      <button className="inline-block w-fit m-auto pl-4 pr-4 pt-2 pb-2 rounded-xl text-white drop-shadow-xl bg-green-600">
        Join
      </button>
    </div>
    <p className="text-2xl text-amber-50 font-semibold">Or Create Your Own!</p>
    <button
        className="w-fit m-auto pl-4 pr-4 pt-2 pb-2 rounded-xl text-white drop-shadow-xl bg-cyan-600"
    >
      Create
    </button>
  </div>
    </>
    
  );
}
