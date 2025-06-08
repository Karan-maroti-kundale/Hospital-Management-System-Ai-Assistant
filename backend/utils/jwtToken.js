// backend/utils/jwtToken.js
import jwt from 'jsonwebtoken';

// Generate JWT token
export const generateToken = (user) => {
  const token = jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || '15d',
    }
  );
  return token;
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

// Generate password reset token
export const generatePasswordResetToken = () => {
  const resetToken = crypto.randomBytes(20).toString('hex');
  
  const hashedResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  return {
    resetToken,
    hashedResetToken
  };
};

// Verify password reset token
export const verifyPasswordResetToken = (token, hashedToken) => {
  const resetToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
    
  return resetToken === hashedToken;
};