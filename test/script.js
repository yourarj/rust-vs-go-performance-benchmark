import http from 'k6/http';
import check from 'k6';

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
const users = JSON.stringify(JSON.parse(open('./users_95.json')));

// server uri
const server_base = '127.0.0.1';

// server port
const port = '8080';

const url = `http://${server_base}:${port}/people`; // The API endpoint

const params = {
    headers: {
        'Content-Type': 'application/json',
    },
};

export default function () {
    // Make the HTTP POST request to the API with the loaded user data
    const res = http.post(url, users, params);

    // Check that the response status is 200
    check(res, {
        'status is `200`': (r) => r.status === 200,
        'count is `95`': (r) => r.body === "Received 95 people",
        'Requests are `HTTP/1.1`': (r) => r.proto === "HTTP/1.1",
        'Requests are NOT `HTTP/2.0`': (r) => r.proto !== "HTTP/2.0",
    });
}
