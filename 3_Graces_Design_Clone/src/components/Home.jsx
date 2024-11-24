import { Canvas, useFrame } from "@react-three/fiber";
import HomeExperience from "./Experience/HomeExperience";

export const Home = () => {
  return (
    <section className="main">
      <Canvas shadows camera={{ position: [0, 0, 3], fov: 30 }}>
        <color attach="background" args={["#050505"]} />
        <HomeExperience />
      </Canvas>
      <div className="home">
        <h2>THE</h2>
        <h1>THREE GRACES</h1>
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ducimus nemo
          non molestias quaerat nihil, facilis eius, vitae tempore consequatur
          deserunt cumque? Similique voluptatem, illum saepe illo distinctio
          labore, dolorum velit quisquam deserunt temporibus voluptas aliquam
          voluptates earum nostrum cupiditate praesentium esse alias tempora
          nisi sint officia, nemo voluptatibus rem officiis? Lorem ipsum dolor
          sit amet consectetur adipisicing elit. Adipisci deserunt, iste dolor
          quia obcaecati optio corrupti officia? Vel, blanditiis accusantium?
          Facere, dolor. Magnam assumenda odit ipsum. Suscipit quas non at!
        </p>
      </div>
    </section>
  );
};
