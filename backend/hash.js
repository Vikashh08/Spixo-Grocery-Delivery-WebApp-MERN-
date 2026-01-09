import bcrypt from "bcryptjs";

const password = "your_admin pass";

const run = async () => {
  const hash = await bcrypt.hash(password, 10);
  console.log(hash);
};

run();
