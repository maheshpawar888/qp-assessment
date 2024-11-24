import jwt from 'jsonwebtoken';

const JWT_SECRET = 'qp_assign';
const JWT_EXPIRATION = '1h';

export const generateToken = (user: any) => {
  const payload = { user };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
  return token;
};

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
