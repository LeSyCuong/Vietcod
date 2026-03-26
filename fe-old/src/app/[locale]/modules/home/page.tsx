import Hero from "../components/home/Hero";
import Services from "../components/home/Services";
import Navbar from "../components/home/Navbar";
import Footer from "../footer/footer";
import GraphAnimation from "../components/home/GraphAnimation";
import LightBlack from "../components/home/LightBlack";

export default function Page() {
  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <div className="overflow-x-hidden">
        <LightBlack />
      </div>
      <GraphAnimation />
      <Footer />
    </>
  );
}
