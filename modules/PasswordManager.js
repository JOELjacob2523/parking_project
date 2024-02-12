import bcrypt from "bcrypt";

class PasswordManager {
  async hashPassword(password) {
    const hash = await bcrypt.hash(password, 13);
    return hash;
  }

  async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }
}

export default PasswordManager;
