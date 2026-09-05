import "./Login.css";
import logo from "../../assets/images/madinah-logo.png";
import background from "../../assets/images/login-bg.jpg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!username || !password) {
      setError("يرجى إدخال اسم المستخدم وكلمة المرور");
      return;
    }

    if (username === "dr.shahein" && password === "dr.shahein123") {
      setError("");
      navigate("/dashboard");
    } else {
      setError("اسم المستخدم أو كلمة المرور غير صحيحة");
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 180px 0 500px",
      }}
    >
      {/* الجهة اليسرى */}

      <div
        style={{
          width: "560px",
          minHeight: "850px",
          background: "#ffffff",
          borderRadius: "20px",
          padding: "55px",
          boxShadow: "0 15px 40px rgba(0,0,0,.3)",
          marginRight: "120px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <img src={logo} width={180} />
        </div>

        <h3
          style={{
            textAlign: "center",
            color: "#006C54",
            marginTop: 50,
            fontSize: "35px",
            fontWeight: "bold",
          }}
        >
          أمانة منطقة المدينة المنورة
        </h3>

        <p
          style={{
            textAlign: "center",
            color: "#555",
            marginBottom: 50,
            fontSize: "30px",
          }}
        >
          إدارة الطوارئ والأزمات
        </p>

        <input
          type="text"
          placeholder="اسم المستخدم"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleLogin();
            }
          }}
          style={inputStyle}
        />

        {error && (
          <div
            style={{
              color: "#d32f2f",
              background: "#ffebee",
              padding: "12px",
              borderRadius: "10px",
              textAlign: "center",
              marginBottom: "20px",
              fontSize: "16px",
            }}
          >
            {error}
          </div>
        )}

        <button
          style={buttonStyle}
          onClick={handleLogin}
        >
          تسجيل الدخول
        </button>
      </div>

      {/* الجهة اليمنى */}

      <div
        style={{
          textAlign: "right",
          color: "white",
          maxWidth: "650px",
        }}
      >
        <img src={logo} width={120} />

        <h2
          style={{
            marginTop: 20,
            fontSize: "28px",
          }}
        />

        <h1
          style={{
            marginTop: 25,
            fontSize: "52px",
            fontWeight: "bold",
          }}
        />
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  height: "60px",
  marginBottom: "20px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  padding: "0 20px",
  fontSize: "18px",
} as const;

const buttonStyle = {
  width: "100%",
  height: "60px",
  background: "#00884A",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  fontSize: "22px",
  fontWeight: "bold",
  cursor: "pointer",
} as const;