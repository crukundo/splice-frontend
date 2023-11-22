import { authRoutes } from "@/routes";
import { Route, Routes } from "react-router-dom";
  
  export default function AuthPages() {
    return <div className="min-h-screen">
      <Routes>
        {Object.values(authRoutes).map(({ path, component: Component }) => {
          return <Route key={path} path={path} element={<Component />} />;
        })}
      </Routes>
    </div>
  }
  