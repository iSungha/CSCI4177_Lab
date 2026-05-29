import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("garrysangha@dal.ca");
  const [password, setPassword] = useState("password123");
  const [errors, setErrors] = useState({});

  function validate() {
    const nextErrors = {};

    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!email.includes("@")) {
      nextErrors.email = "Enter a valid email.";
    }

    if (!password) {
      nextErrors.password = "Password is required.";
    } else if (password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    return nextErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result = login(email, password);

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
              placeholder="alex@dal.ca"
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

          <button type="submit" className="auth-submit">
            Sign In
          </button>
        </form>

        <p className="switch-auth">
          Don&apos;t have an account? <Link to="/signup">Create one</Link>
        </p>

        <div className="demo-box">
          Demo: garrysangha@dal.ca / password123
        </div>
      </section>
    </main>
  );
}

export default Login;