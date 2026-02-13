import "./index.css";
import Canvas from "./Canvas";
import data from "./data";
import LocomotiveScroll from "locomotive-scroll";
import { useEffect, useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

// Register GSAP plugin
gsap.registerPlugin(useGSAP);

function App() {
  const [showCanvas, setShowCanvas] = useState(false);
  const headingref = useRef(null);
  const growingSpan = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    // Initialize Locomotive Scroll v4
    if (typeof window !== 'undefined' && scrollRef.current) {
      try {
        const scroll = new LocomotiveScroll({
          el: scrollRef.current,
          smooth: true,
          smoothMobile: false,
          resetNativeScroll: true,
          tablet: {
            smooth: false
          },
          smartphone: {
            smooth: false
          }
        });

        console.log("✅ Locomotive Scroll v4 initialized successfully");

        // Small delay to ensure everything is loaded
        setTimeout(() => {
          scroll.update();
        }, 100);

        // Update on window resize
        const handleResize = () => {
          scroll.update();
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
          window.removeEventListener('resize', handleResize);
          if (scroll) {
            scroll.destroy();
            console.log("🧹 Locomotive Scroll destroyed");
          }
        };
      } catch (error) {
        console.error("❌ Error initializing Locomotive Scroll:", error);
      }
    }
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      setShowCanvas((prevShowCanvas) => {
        if (!prevShowCanvas) {
          gsap.set(growingSpan.current, {
            top: e.clientY,
            left: e.clientX,
          });

          gsap.to("body", {
            color: "#000",
            backgroundColor: "#fd2c2a",
            duration: 1.2,
            ease: "power2.inOut",
          });

          gsap.to(growingSpan.current, {
            scale: 1000,
            duration: 2,
            ease: "power2.inOut",
            onComplete: () => {
              gsap.set(growingSpan.current, {
                scale: 0,
                clearProps: "all",
              });
            },
          });
        } else {
          gsap.to("body", {
            color: "#fff",
            backgroundColor: "#000",
            duration: 1.2,
            ease: "power2.inOut",
          });
        }

        return !prevShowCanvas;
      });
    };

    const headingElement = headingref.current;
    if (headingElement) {
      headingElement.addEventListener("click", handleClick);
    }

    return () => {
      if (headingElement) {
        headingElement.removeEventListener("click", handleClick);
      }
    };
  }, []);

  return (
    <>
      <span
        ref={growingSpan}
        className="growing rounded-full block fixed top-[-20px] left-[-20px] w-5 h-5"
      ></span>
      
      <div ref={scrollRef} data-scroll-container>
        <div data-scroll-section className="w-full relative min-h-screen font-['Helvetica_Now_Display']">
          {showCanvas &&
            data[0].map((canvasdets, index) => (
              <Canvas key={`canvas-0-${index}`} details={canvasdets} />
            ))}
          <div className="w-full relative z-[1] h-screen">
            <nav className="w-full p-8 flex justify-between z-50">
              <div className="brand text-2xl font-md">thirtysixstudios</div>
              <div className="links flex gap-10">
                {[
                  "What we do",
                  "Who we are",
                  "How we give back",
                  "Talk to us",
                ].map((link, index) => (
                  <a
                    key={index}
                    href={`#${link.toLowerCase()}`}
                    className="text-md hover:text-gray-300"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </nav>
            <div className="textcontainer w-full px-[20%]">
              <div className="text w-[50%]">
                <h3 className="text-4xl leading-[1.2]">
                  At Thirtysixstudio, we build immersive digital experiences for
                  brands with a purpose.
                </h3>
                <p className="text-lg w-[80%] mt-10 font-normal">
                  We are a team of designers, developers, and strategists who are
                  passionate about creating digital experiences that are both
                  beautiful and functional.
                </p>
                <p className="text-md mt-10">scroll</p>
              </div>
            </div>
            <div className="w-full absolute bottom-0 left-0">
              <h1
                ref={headingref}
                className="text-[17rem] font-normal tracking-tight leading-none pl-5 cursor-pointer"
              >
                Thirtysixstudios
              </h1>
            </div>
          </div>
        </div>
        
        <div data-scroll-section className="w-full relative h-screen mt-32 px-10">
          {showCanvas &&
            data[1].map((canvasdets, index) => (
              <Canvas key={`canvas-1-${index}`} details={canvasdets} />
            ))}
          <h1 
            className="text-8xl tracking-tighter" 
            data-scroll 
            data-scroll-speed="1"
          >
            about the brand
          </h1>
          <p 
            className="text-4xl leading-[1.8] w-[80%] mt-10 font-light" 
            data-scroll 
            data-scroll-speed="2"
          >
            we are a team of designers, developers, and strategists who are
            passionate about creating digital experiences that are both beautiful
            and functional, we are a team of designers, developers, and
            strategists who are passionate about creating digital experiences that
            are both beautiful and functional.
          </p>

          <img
            className="w-[80%] mt-10"
            src="https://directus.funkhaus.io/assets/b3b5697d-95a0-4af5-ba59-b1d423411b1c?withoutEnlargement=true&fit=outside&width=1400&height=1400"
            alt=""
            data-scroll
            data-scroll-speed="3"
          />
        </div>
      </div>
    </>
  );
}

export default App;
