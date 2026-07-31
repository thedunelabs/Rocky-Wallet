const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateJoinForm({ email = '', twitter = '' }) {
  const errors = {};
  const normalizedEmail = String(email ?? '').trim();
  const normalizedTwitter = String(twitter ?? '').trim();

  if (!normalizedEmail) {
    errors.email = 'Enter your email address.';
  } else if (!EMAIL_PATTERN.test(normalizedEmail)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!normalizedTwitter) {
    errors.twitter = 'Enter your X / Twitter handle.';
  }

  return errors;
}
