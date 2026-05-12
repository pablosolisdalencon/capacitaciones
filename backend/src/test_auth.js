async function testAuth() {
  const baseUrl = 'http://localhost:5000/api/auth';

  try {
    // 1. Register
    const regRes = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Admin Test',
        email: 'admin@test.com',
        password: 'password123',
        role: 'Admin'
      })
    });
    const regData = await regRes.json();
    console.log('Register Response:', regData);

    // 2. Login
    const loginRes = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@test.com',
        password: 'password123'
      })
    });
    const loginData = await loginRes.json();
    console.log('Login Response:', loginData);

    if (loginData.token) {
      console.log('Auth test PASSED');
    } else {
      console.log('Auth test FAILED');
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testAuth();
