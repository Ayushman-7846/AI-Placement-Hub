import 'dotenv/config';
import app from './src/app.js';
import fs from 'fs';

const PORT = 5005;
const BASE_URL = `http://localhost:${PORT}/api/v1`;
const logs = [];

function logAction(action, payload, response) {
  logs.push({ action, payload, response });
  console.log(`[${action}] - Status: ${response.status}`);
}

async function runTests() {
  // Wait a moment for server to bind
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    // 1. Create User A
    const user1Email = `user1_${Date.now()}@test.com`;
    let res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'User One', email: user1Email, password: 'Password123' })
    });
    let data = await res.json();
    logAction('Register User A', { email: user1Email }, { status: res.status, data });
    if (!res.ok) throw new Error(`User A Registration failed: ${JSON.stringify(data)}`);
    const tokenA = data.data.accessToken;

    // 2. Create User B
    const user2Email = `user2_${Date.now()}@test.com`;
    res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'User Two', email: user2Email, password: 'Password123' })
    });
    data = await res.json();
    logAction('Register User B', { email: user2Email }, { status: res.status, data });
    if (!res.ok) throw new Error(`User B Registration failed: ${JSON.stringify(data)}`);
    const tokenB = data.data.accessToken;

    // 3. Start Interview (User A)
    const startPayload = {
      title: 'Mock Frontend Interview',
      role: 'Frontend Developer',
      difficulty: 'MEDIUM',
      interviewType: 'TECHNICAL',
      questionCount: 2
    };
    res = await fetch(`${BASE_URL}/interviews/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify(startPayload)
    });
    data = await res.json();
    logAction('Start Interview', startPayload, { status: res.status, data });
    const sessionId = data.data.id;
    const question1Id = data.data.questions[0].id;
    const question2Id = data.data.questions[1].id;

    // 4. Get Session Details (User A)
    res = await fetch(`${BASE_URL}/interviews/${sessionId}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    data = await res.json();
    logAction('Get Session Details', { sessionId }, { status: res.status, data });

    // 5. Submit Answer (User A)
    const answerPayload = {
      questionId: question1Id,
      answer: 'React is a JavaScript library for building user interfaces.'
    };
    res = await fetch(`${BASE_URL}/interviews/${sessionId}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify(answerPayload)
    });
    data = await res.json();
    logAction('Submit Answer', answerPayload, { status: res.status, data });

    // 6. Test Duplicate Answer (User A)
    res = await fetch(`${BASE_URL}/interviews/${sessionId}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify(answerPayload)
    });
    data = await res.json();
    logAction('Test Duplicate Answer', answerPayload, { status: res.status, data });

    // 7. Test Ownership Validation (User B accessing User A's session)
    res = await fetch(`${BASE_URL}/interviews/${sessionId}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${tokenB}` }
    });
    data = await res.json();
    logAction('Test Ownership Validation (GET)', { sessionId }, { status: res.status, data });

    // Submit second answer to be able to complete properly
    await fetch(`${BASE_URL}/interviews/${sessionId}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ questionId: question2Id, answer: 'State is managed using hooks.' })
    });

    // 8. Complete Interview (User A)
    res = await fetch(`${BASE_URL}/interviews/${sessionId}/complete`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    data = await res.json();
    logAction('Complete Interview', { sessionId }, { status: res.status, data });

    // 9. Test Session Status Validation (Submit answer to completed session)
    res = await fetch(`${BASE_URL}/interviews/${sessionId}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ questionId: question2Id, answer: 'Another answer.' })
    });
    data = await res.json();
    logAction('Test Session Status Validation', { questionId: question2Id }, { status: res.status, data });

    // 10. Get Interviews List (User A)
    res = await fetch(`${BASE_URL}/interviews`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    data = await res.json();
    logAction('Get Interviews List', null, { status: res.status, data });

  } catch (err) {
    console.error(err);
  } finally {
    fs.writeFileSync('verify-results.json', JSON.stringify(logs, null, 2));
    process.exit(0);
  }
}

runTests();
