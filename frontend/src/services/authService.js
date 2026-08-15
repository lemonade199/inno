export const authService = {
  login: (email, password) => {
    return Promise.resolve({
      user: {
        id: 1,
        name: 'Administrator',
        email: email,
        role: 'Admin',
      },
      token: 'mock-jwt-token-12345',
    });
  },
  register: (data) => {
    return Promise.resolve({ success: true, message: 'Registrasi berhasil' });
  },
  logout: () => {
    return Promise.resolve({ success: true });
  },
};
