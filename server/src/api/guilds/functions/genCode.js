export function genCode() {
  const code = crypto.randomBytes(6).toString('hex');
  return code;
}
