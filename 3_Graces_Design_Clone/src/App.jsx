import { Suspense, useEffect, useRef } from "react";
import { Home } from "./components/Home";
import Header from "./components/Header";
import About from "./components/About";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Suspense
        fallback={
          <div className="loading">
            {" "}
            <h2>Loading.....</h2>
          </div>
        }
      >
        <Header />
        <Home />
        <About />
        <Footer />
      </Suspense>
    </>
  );
}

export default App;
