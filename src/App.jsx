import Cookies from "js-cookie";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import AppRoutes from "@/Routes/AppRoutes";

const App = () => {
  const userID = Cookies.get("userID");
  const isAuthenticated = Boolean(userID);

  if (!isAuthenticated) {
    Cookies.remove("userID");
  }

  const cId = import.meta.env.VITE_GOOGLE_CID;

  return (
    <GoogleOAuthProvider clientId={cId}>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <AppRoutes isAuthenticated={isAuthenticated} />
        </main>
        <Toaster />
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;