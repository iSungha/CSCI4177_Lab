function Button({ children, variant = "primary", className = "" }) {
  return (
    <button className={`btn btn-${variant} ${className}`.trim()}>
      {children}
    </button>
  );
}

export default Button;