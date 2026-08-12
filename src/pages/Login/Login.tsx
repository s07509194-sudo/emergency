import "./Login.css";
import logo from "../../assets/images/madinah-logo.png";
import background from "../../assets/images/login-bg.jpg";

export default function Login() {
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
       padding: "0 180px 0 500px"
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
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="كلمة المرور"
          style={inputStyle}
        />

        <button style={buttonStyle}>
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
        >
        </h2>

        <h1
          style={{
            marginTop: 25,
            fontSize: "52px",
            fontWeight: "bold",
          }}
        >
               
        </h1>
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