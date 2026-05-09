const FIELDS_TO_SKIP = ['images', 'logo', 'password', 'passwordHash', 'secretCode'];

const MAX_STRING_LENGTH = 5000;
const MAX_ARRAY_ITEMS = 100;
const MAX_DEPTH = 10;

const escapeHtml = (str) => {
  if (typeof str !== 'string') return str;
  const htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };
  return str.replace(/[&<>"`=]/g, (char) => htmlEntities[char]);
};

const sanitizeObject = (obj, depth = 0) => {
  if (depth > MAX_DEPTH) {
    return {};
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (FIELDS_TO_SKIP.includes(key)) {
      sanitized[key] = value;
      continue;
    }

    if (typeof value === 'string') {
      if (value.length > MAX_STRING_LENGTH) {
        sanitized[key] = escapeHtml(value.slice(0, MAX_STRING_LENGTH));
      } else {
        sanitized[key] = escapeHtml(value.trim());
      }
    } else if (Array.isArray(value)) {
      const trimmed = value.slice(0, MAX_ARRAY_ITEMS);
      sanitized[key] = trimmed.map(item =>
        typeof item === 'string' ? escapeHtml(item.trim()) : item
      );
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value, depth + 1);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

const sanitizeBody = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  next();
};

module.exports = { sanitizeBody, escapeHtml };
