export function validateLogin(email, password) {
  const errors = {};

  if (!email.trim()) {
    errors.email = "Email is required.";
  } 
  else if (!email.includes("@")) {
    errors.email = "Enter a valid email.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } 
  else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  return errors;
}