export function errorHandler(err, req, res, next) {
  // Zod validation error formatting
  // Support both err.issues (zod >= 3) and err.errors
  if (err && (err.issues || err.errors)) {
    const issues = err.issues || err.errors;
    const messages = issues.map((i) => {
      const path = Array.isArray(i.path) ? i.path.join('.') : i.path;
      // Friendly Vietnamese messages for common cases
      if (i.code === 'too_small' && path === 'password') {
        return 'Mật khẩu phải có ít nhất 6 ký tự';
      }
      if (i.code === 'invalid_string' && i.validation === 'email') {
        return 'Email không hợp lệ';
      }
      if (i.code === 'too_small' && typeof i.minimum === 'number') {
        return `${path} phải có ít nhất ${i.minimum} ký tự`;
      }
      return i.message || `Lỗi trường ${path}`;
    });
    return res.status(400).json({ error: messages[0], errors: messages });
  }

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  if (status >= 500) {
    console.error(err);
  }
  res.status(status).json({ error: message });
}


