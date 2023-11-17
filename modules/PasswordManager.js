import bcrypt from "bcrypt";

class PasswordManager {
  async hashPassword(password) {
    console.log("hashPassword called");
    const hash = await bcrypt.hash(password, 13);
    console.log(hash, "hash");
    return hash;
  }

  async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }
}

export default PasswordManager;
