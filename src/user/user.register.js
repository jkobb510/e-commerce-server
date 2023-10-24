// Assuming you have the necessary imports and setup for your framework

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Invalid username or password' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User();
  user.username = username;
  user.password = hashedPassword;
  await user.save();
  res.status(201).json({ message: 'User registered successfully' });
});
