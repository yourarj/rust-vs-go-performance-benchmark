import http from 'k6/http';
import { check, randomSeed } from 'k6';
import { sleep } from 'k6';

// Define the options for the test
export const options = {
    stages: [
        { duration: '1m', target: 10000 }, // Ramp up to 10,000 users over 1 minute
        { duration: '1m', target: 10000 }, // Ramp up to 10,000 users over 1 minute
        { duration: '1m', target: 0 }, // Ramp up to 10,000 users over 1 minute
    ],
    thresholds: {
        http_req_failed: ['rate<0.01'], // Less than 1% of requests should fail
        http_req_duration: ['p(95)<2000'], // 95% of requests should be under 2 seconds
    },
};

// Load user data from the JSON file
// const users = JSON.parse(open('./users.json'));
const users = JSON.parse(open('./users_95.json'));

const url = 'http://127.0.0.1:8080/people'; // The API endpoint

const params = {
    headers: {
        'Content-Type': 'application/json',
    },
};

export default function () {
    // Make the HTTP POST request to the API with the loaded user data
    const res = http.post(url, JSON.stringify(users), params);

    // Check that the response status is 200
    check(res, {
        'status is `200`': (r) => r.status === 200,
        'count is `95`': (r) => r.body === "Received 95 people",
    });

    sleep(1); // Pause for 1 second between iterations
}
