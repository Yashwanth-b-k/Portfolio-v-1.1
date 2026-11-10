import { Link } from "react-router-dom";
import { Flyers, Torch } from "@/mc/Ambient";

export default function NotFound() {
  return (
    <main className="layer layer-deep flex min-h-screen flex-col items-center justify-center px-6 text-center" data-mat="deep">
      <div className="layer-shade" />
      <div className="layer-fx">
        <Flyers kind="bat" count={4} />
        <Torch style={{ left: "50%", top: "22%" }} />
      </div>
      <div className="layer-body flex flex-col items-center">
        <p className="title-3d">404</p>
        <h1 className="h-title mt-6">You dug too far.</h1>
        <p className="lede mt-3">There's nothing in this cave but bats.</p>
        <Link to="/" className="mc-btn mc-btn-green mt-8">
          Back to the surface
        </Link>
      </div>
    </main>
  );
}
