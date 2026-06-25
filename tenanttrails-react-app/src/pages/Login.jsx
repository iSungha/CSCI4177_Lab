import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { validateLogin } from "../utils/validation";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateLogin(email, password);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});

    const result = await login(email, password);

    setSubmitting(false);

    if (!result.success) {
      setErrors({ form: result.message });
      return;
    }

    navigate("/dashboard", {
      state: { message: `Welcome back, ${result.user.name}!` },
    });
  }

  return (
    <main className="auth-page">
      <section className="auth-card login-card">
        <Link to="/" className="auth-logo">
          TenantTrails
        </Link>

        <p className="auth-subtitle">
          See what past tenants had to say, before you sign.
        </p>

        {errors.form && <p className="form-error-box">{errors.form}</p>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              placeholder="you@dal.ca"
              onChange={(event) => setEmail(event.target.value)}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              placeholder="password123"
              onChange={(event) => setPassword(event.target.value)}
            />
            {errors.password && (
              <span className="error">{errors.password}</span>
            )}
          </div>

          <button type="submit" className="auth-submit" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="switch-auth">
          Don&apos;t have an account? <Link to="/signup">Create one</Link>
        </p>
      </section>
    </main>
  );
}

export default Login;