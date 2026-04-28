import React from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import App from "./App";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

// Strip trailing slash once globally — fixes //api/ double-slash 404s on Vercel
axios.defaults.baseURL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
import Lenis from "lenis";
import { gsap } from "gsap";

// create lenis
const lenis = new Lenis({
  duration: 1.2,
  smooth: true
});

// sync lenis with gsap
lenis.on("scroll", gsap.updateRoot);

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

ReactDOM.createRoot(document.getElementById("root")).render(
  <App />
);