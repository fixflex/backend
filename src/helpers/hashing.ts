// hash reset code
import crypto, { BinaryLike } from 'crypto';

export const hashCode = (code: BinaryLike) => crypto.createHash('sha256').update(code).digest('hex');
