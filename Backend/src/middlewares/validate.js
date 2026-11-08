import { AppError } from '../utils/http.js';

export function requiredBody(fields) {
  return (req, _res, next) => {
    const missing = fields.filter((field) => req.body?.[field] === undefined || req.body?.[field] === null || req.body[field] === '');
    if (missing.length) return next(new AppError(400, 'Field wajib belum diisi', { fields: missing }));
    next();
  };
}

export function validateBody(validator) {
  return (req, _res, next) => {
    try { validator(req.body ?? {}); next(); } catch (error) { next(error); }
  };
}

export function requireString(fields, { max = 255, optional = [] } = {}) {
  return validateBody((body) => {
    const missing = fields.filter((field) => !optional.includes(field) && (typeof body[field] !== 'string' || !body[field].trim()));
    if (missing.length) throw new AppError(400, 'Field wajib harus berupa string dan tidak boleh kosong', { fields: missing });
    const tooLong = fields.filter((field) => typeof body[field] === 'string' && body[field].length > max);
    if (tooLong.length) throw new AppError(400, `Panjang field melebihi ${max} karakter`, { fields: tooLong });
  });
}
