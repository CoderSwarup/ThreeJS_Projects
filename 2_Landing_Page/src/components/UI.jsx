import React, { useState } from "react";
import Menu from "./Menu";
import { CurrentView } from "../context/ContextProvider";
import { useAtom } from "jotai";

export default function UI() {
  const [currentView, setCurrentView] = useAtom(CurrentView);
  const [isDisabled, setDisable] = useState(false);

  return (
    <>
      <section className="h-screen w-screen flex items-center justify-center text-center p-8 lg:p-20 select-none">
        <div>
          <h1 className="mt-40 text-3xl text-white font-bold font-serif sm:text-5xl ">
            Pirate Shifudo 🏴‍☠️
          </h1>
          <p className="text-white">Best sea food in the world 🎣</p>
        </div>
      </section>
      <section className="h-screen w-screen -mt-[100px] md:mt-0 flex items-center p-8 lg:p-20 select-none max-w-screen-xl mx-auto text-white">
        <div className="-mt-40">
          <h2 className="text-xl font-bold font-serif md:text-2xl">Le Chef</h2>
          <h3 className="text-2xl font-bold font-serif md:text-5xl">
            Broswick Chichaigne
          </h3>
          <p className="mt-2 text-xs sm:text-[15px]">
            Travelled the world seas and learned from the best 🌊. <br />
            We are proud to have him in our team and to serve you his best
            dishes. 🍽️
            <br />
            <br />
            If you stay late, you might even get to see him play the piano. 🎹
          </p>
        </div>
      </section>
      <section className="mt-[80px] md:mt-0 text-white h-screen w-screen flex flex-col items-center p-8 lg:p-20 select-none max-w-screen-xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-center md:text-5xl">
            Our Menu
          </h1>
          <p className="text-center  text-[12px]  font-light mt-2 md:text-lg">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dicta non
            doloribus minus nesciunt molestiae ratione voluptatum quisquam
            labore similique, voluptas ea cum tenetur expedita rerum repellat.
            Delectus sequi quod assumenda!
          </p>
        </div>
        <Menu />
      </section>
      {/* <section className="text-white h-screen w-screen   select-none">
        <button
          className={`text-lg font-bold text-white bg-orange-400 py-2 px-4 absolute left-[50%] -translate-x-[50%] bottom-5 hover:bg-orange-500 rounded-full ${
            currentView === "Intro" ? "opacity-0" : ""
          } ease-in`}
          disabled={isDisabled}
          onClick={() => {
            if (currentView === "Tent") {
              setCurrentView("Home");
              setDisable(true);
              setTimeout(() => {
                setDisable(false);
              }, 3000);
            } else {
              setCurrentView("Tent");
              setDisable(true);
              setTimeout(() => {
                setDisable(false);
              }, 3000);
            }
          }}
        >
          {currentView === "Tent" ? "Back To Home" : "ENTER"}
        </button>
      </section> */}
    </>
  );
}
