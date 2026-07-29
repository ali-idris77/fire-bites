
import { useNavigate } from "react-router-dom";

const PaymentFailed = () => {
  const navigate = useNavigate();

  const pageStyles = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "var(--page-bg, #f8f5f2)",
    padding: "24px",
  };

  const cardStyles = {
    maxWidth: "520px",
    width: "100%",
    padding: "32px",
    borderRadius: "18px",
    background: "var(--card-bg, #fff)",
    boxShadow: "0 20px 45px rgba(0, 0, 0, 0.08)",
    textAlign: "center",
  };

  const iconStyles = {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    background: "var(--error-bg, #ffe6e6)",
    display: "grid",
    placeItems: "center",
    margin: "0 auto 24px",
  };

  const titleStyles = {
    margin: "0 0 16px",
    fontSize: "2rem",
    color: "var(--text-title, #222)",
  };

  const textStyles = {
    margin: "0 0 28px",
    color: "var(--text-body, #555)",
    lineHeight: 1.75,
    fontSize: "1rem",
  };

  const buttonBase = {
    minWidth: "140px",
    padding: "12px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "0.95rem",
  };

  const primaryButton = {
    ...buttonBase,
    border: "none",
    background: "var(--button-primary-bg, #d14949)",
    color: "var(--button-primary-text, #fff)",
  };

  const secondaryButton = {
    ...buttonBase,
    border: "1px solid var(--button-border, #ccc)",
    background: "var(--button-secondary-bg, #fff)",
    color: "var(--text-body, #333)",
  };

  return (
    <main style={pageStyles}>
      <section style={cardStyles}>
        <div style={iconStyles}>
          <span
            style={{
              fontSize: "32px",
              color: "var(--error-fg, #d14949)",
              lineHeight: 1,
            }}
          >
            ✕
          </span>
        </div>
        <h1 style={titleStyles}>Payment Failed</h1>
        <p style={textStyles}>
          We were unable to complete your payment. Please verify your card details or try a different payment method.
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <button type="button" onClick={() => navigate(0)} style={primaryButton}>
            Retry Payment
          </button>
          <button type="button" onClick={() => navigate("/")} style={secondaryButton}>
            Back to Home
          </button>
        </div>
      </section>
    </main>
  );
};

export default PaymentFailed;
