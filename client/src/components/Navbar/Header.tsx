"use client"
import {Menu, ShoppingBag, ShoppingBasket as Cart, UserCircle2, X } from "lucide-react";
import Link from "next/link";
import SignedInMenu from "../SignedInMenu";
import {useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import ShoppingBasketButton from "./ShoppingBasket";
import { ShoppingBasket, getBasket } from "@/db/basket";
import { fetchBasket, fetchSession } from "./ServerComponets";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";

const linkStyle = {
    textDecoration: 'none',
    color: '#ffffff',
    marginLeft: '20px',
    fontSize: '30px',
    fontWeight: 'bold', // Use 'bold' instead of 'larger' for font-weight
  };


const menuLinks = [
    { path: "/", label: "Home" },
    { path: "/catalog", label: "Catalog" },
    { path: "/basket", label: "Basket" }
  ];
 
export default function Header()
{
  const container = useRef<HTMLDivElement>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
  
    const tl = useRef<gsap.core.Timeline>();

   function toggleMenu() {
      setIsMenuOpen(!isMenuOpen);
    };
  
    useGSAP(
      () => {
        gsap.set(".menu-link-item-holder", { y: 75 });
        tl.current = gsap
          .timeline({ paused: true })
          .to(".menu-overlay", {
            duration: 1.25,
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            ease: "power4.inOut",
          })
          .to(".menu-link-item-holder", {
            y: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power4.out",
            delay: -0.75,
          });
      },
      { scope: container }
    );
  
    useEffect(() => {
      if (isMenuOpen) {
        tl.current?.play();
      } else {
        tl.current?.reverse();
      }
    }, [isMenuOpen]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
      }, []);
    
      function handleScroll() {
        const bodyScroll = window.scrollY;
        const header = document.querySelector(".header") as HTMLElement;
    
        if (bodyScroll > 300) header.classList.add("nav-scroll");
        else header.classList.remove("nav-scroll");
      }
    return(
      <div className="" ref={container}>
      <nav className="header nav-scroll px-4">
            <div className="menu-open ml-[30px] cursor-pointer" onClick={toggleMenu}>    
                { isMenuOpen ? <X />:<Menu />}
            </div>
                <div className="flex flex-1 items-center justify-center">
                  <a href="/" className="text-xl md:text-2xl font-bold text-white ml-10">
                    LIV3 FOREVER
                  </a>
                </div>
           <div>
              <ul className="right-links">
                  <li className="nav-item mr-4">
                    <Link href="/basket">
                      <ShoppingBasketButton />
                    </Link>
                  </li>
                  
                  <li className="nav-item mr-4 ">
                      <SignedInMenu />
                  </li> 
              </ul>
           </div>
            

        <div className="menu-overlay" ref={container}>
        <div className="menu-close-icon" onClick={toggleMenu}>
            Close
        </div>
        <div className="menu-copy">
          <div className="menu-links">
            {menuLinks.map((link, index) => (
              <div key={index} className="menu-link-item">
                <div className="menu-link-item-holder" onClick={toggleMenu}>
                  <Link className="menu-link" href={link.path}>
                    {link.label}
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="menu-info">
            <div className="menu-info-col">
              <a href="#">X &#8599;</a>
              <a href="https://www.instagram.com/liv3.online/">Instagram &#8599;</a>
            </div>
            <div className="menu-info-col">
              <a href="mailto:sales@liv3.online">sales@liv3.online</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
    </div>
    )
}