import { Suspense } from "react";
import Loader from "@/Utils/Loader";

const LazyLoad = (Component) => (
  <Suspense
    fallback={
      <div className="w-full h-screen flex items-center justify-center">
        <Loader />
      </div>
    }
  >
    <Component />
  </Suspense>
);

export default LazyLoad;
