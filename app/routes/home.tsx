import type { Route } from "./+types/home";
import Navbar from "../../components/Navbar";
import {useOutletContext} from "react-router";
import {ArrowRight, Upload} from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const authContext = useOutletContext<AuthContext | null>();

  return (
      <div className="home">
        <Navbar {...(authContext ?? {})}/>
        <section className="hero">
          <div className="announce">
            <div className="dot">
              <div className="pulse"/>
            </div>
            <p>AI room design visualizer</p>
          </div>

          <h1>Transform rooms before you build</h1>
          <p className="subtitle">
            Upload a room photo and preview polished interior concepts in seconds.
          </p>

          <div className="actions">
            <a href="#upload" className="cta">
              Get Started
              <ArrowRight className="icon"/>
            </a>
            <button className="demo" type="button">
              View Demo
            </button>
          </div>

          <div className="upload-shell" id="upload">
            <div className="grid-overlay"/>
            <div className="upload-card">
              <div className="upload-head">
                <div className="upload-icon">
                  <Upload className="icon"/>
                </div>
                <h3>Upload your room</h3>
                <p>Sign in, then add a photo to start designing.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
  )
}
