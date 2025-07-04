// Set JWT token in cookie and send response
// Modified by Saira Shakeel

const cookieToken = (user, res) => {
  const token = user.getJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // Token only accessible by the backend
    secure: true,   // Send only over HTTPS
    sameSite: 'none' // Allow cross-origin requests
  };

  // Remove password before sending user object
  user.password = undefined;

  res.status(200)
    .cookie("token", token, options)
    .json({
      success: true,
      token,
      user,
    });
};

module.exports = cookieToken;
