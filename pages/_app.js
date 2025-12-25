import "../styles/globals.css";

import { storyblokInit, apiPlugin } from "@storyblok/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Script from "next/script";

// Components
import Person from "../components/specificComponents/Person/Person";
import Teacher from "../components/specificComponents/Teacher/Teacher";
import Experience from "../components/specificComponents/Experience/Experience";
import Hero from "../components/genericComponents/Hero/Hero";
import Page from "../components/layoutComponents/Page/Page";
import Headermenu from "../components/genericComponents/Headermenu/Headermenu";
import Menulink from "../components/genericComponents/Menulink/Menulink";
import Paragraph from "../components/genericComponents/Paragraph/Paragraph";
import Intro from "../components/genericComponents/Intro/Intro";
import LeftRightBlock from "../components/genericComponents/LeftRightBlock/LeftRightBlock";
import Course from "../components/specificComponents/Course/Course";
import List from "../components/genericComponents/List/List";
import Element from "../components/genericComponents/Element/Element";
import OneCol from "../components/layoutComponents/OneCol/OneCol";
import TwoCol from "../components/layoutComponents/TwoCol/TwoCol";
import ThreeCol from "../components/layoutComponents/ThreeCol/ThreeCol";
import ImageCarousel from "../components/genericComponents/ImageCarousel/ImageCarousel";
import Product from "../components/specificComponents/Product/Product";
import Location from "../components/specificComponents/Location/Location";
import Artist from "../components/specificComponents/Artist/Artist";
import Song from "../components/specificComponents/Song/Song";
import Contact from "../components/specificComponents/contact/contact";
import Prices from "../components/specificComponents/Prices/Prices";

// Storyblok components mapping
const components = {
  person: Teacher,
  experience: Experience,
  hero: Hero,
  page: Page,
  headermenu: Headermenu,
  menulink: Menulink,
  paragraph: Paragraph,
  intro: Intro,
  leftrightblock: LeftRightBlock,
  course: Course,
  list: List,
  element: Element,
  onecol: OneCol,
  twocol: TwoCol,
  threecol: ThreeCol,
  imagecarousel: ImageCarousel,
  product: Product,
  location: Location,
  artist: Artist,
  song: Song,
  contact: Contact,
  prices: Prices,
};

storyblokInit({
  accessToken: process.env.STORYBLOK_API_KEY,
  use: [apiPlugin],
  components,
});

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      // Google Analytics pageview (optioneel)
      // ga.pageview(url)
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      {/* Header (optioneel, staat nu correct) */}
      <header style={{ padding: "1rem", background: "#f5f5f5" }}>
        <img src="/logo.png" alt="Logo" style={{ height: "50px" }} />
      </header>

      {/* Tawk.to live chat */}
      <Script
        id="tawk-to"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
              var s1=document.createElement("script"),
                  s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/XXXX/XXXX';
              s1.charset='UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
            })();
          `,
        }}
      />

      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

