import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (token) localStorage.setItem("token", token);
    navigate("/albums");
  }, [navigate]);
//   return <p className="text-center mt-5">Signing you in…</p>;
};

export default OAuthSuccess;