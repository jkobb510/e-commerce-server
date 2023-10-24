import { verify, sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';

// Middleware function to validate JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    req.user = user;

    next();
  });
}

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Invalid username or password' });
  }

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  // Compare the provided password with the stored hashed password
  const isPasswordValid = await compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const token = sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });

  res.json({ token });
});

// Apply the middleware to routes that require authentication
app.get('/protected', authenticateToken, (req, res) => {
  // Access the user information from req.user
  const userId = req.user.userId;

  // Handle the protected route logic here

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      user.name = req.body.name;
      user.email = req.body.email;
      user
        .save()
        .then((updatedUser) => {
          res
            .json({
              message: 'User profile updated successfully',
              user: updatedUser,
            })
            .catch((error) => {
              console.error('Failed to retrieve user data:', error);

              res.status(500).json({ error: 'Failed to retrieve user data' });
            });
        })
        .catch((error) => {
          console.error('Failed to retrieve user data:', error);
          res.status(500).json({ error: 'Failed to retrieve user data' });
        });
      res.json({ message: 'Protected route accessed successfully', user });
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .catch((_error) => {
      res.status(500).json({ error: 'Internal server error' });
    });
});
