export const admin = {
  firstName: 'admin',
  lastName: 'admin',
  email: 'admin@example.com',
  password: 'password',
  role: 'ADMIN',
};
export const user = {
  firstName: 'ahmad',
  lastName: 'alasiri',
  email: 'ahmad@example.com',
  password: 'password123',
};

export const user2 = {
  firstName: 'user',
  lastName: '2',
  email: 'user2@example.com',
  password: 'password',
  phoneNumber: '01066032817',
};

export const category = {
  name: { en: 'plumbing', ar: 'السباكة' },
  describe: 'plumbing services',
};

export const task = {
  title: 'cleaning',
  city: 'sallum',
  details: 'Dusting, mopping and vacuuming',
  categoryId: '',
  dueDate: { flexible: true },
  location: { coordinates: [25.156921, 31.552774] },
  budget: 2581,
};

export const offer = {
  taskId: '',
  price: 3000,
  message: 'I can do it',
};

export const review = {
  review: 'The task was done on time',
  rating: 3.6,
};
