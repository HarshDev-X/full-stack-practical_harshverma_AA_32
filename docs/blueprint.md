# **App Name**: UserVault API

## Core Features:

- Server Health Check: Expose a root endpoint (GET /) to confirm the server is running.
- User Listing API: Allow retrieval of all existing user records via a GET request to /users. Data is stored in an in-memory array for MVP.
- New User Registration: Enable creation of new users via POST /users, including validation for missing fields and duplicate emails.
- User Detail Retrieval: Provide an endpoint (GET /users/:id) to fetch a specific user's details.
- User Account Deletion: Implement a DELETE /users/:id endpoint for removing user records, with appropriate error handling if the user is not found.
- API Request Logging Middleware: A custom middleware to log the timestamp, HTTP method, and URL of every incoming request to the API.
- Basic User Login: A POST /login route that authenticates users against hardcoded credentials and returns a 'Login Success' or 'Invalid Credentials' message.

## Style Guidelines:

- Primary color: A balanced medium blue (#336BCC), signifying professionalism and reliability.
- Background color: A very light, desaturated blue-grey (#EFF3F7), promoting clarity and reducing eye strain for API documentation or admin panels.
- Accent color: A deep indigo (#5926A6), providing a distinct contrast for call-to-action elements or important highlights in a developer-focused interface.
- Body and headline font: 'Inter', a clean, modern sans-serif, ideal for technical content and high readability.
- Code font: 'Source Code Pro', a monospaced sans-serif, recommended for displaying API request/response examples and code snippets clearly.
- Utilize simple, line-art icons that are intuitive for common API actions (e.g., 'plus' for add, 'trash' for delete, 'magnifying glass' for search).
- Implement a clean, structured layout with ample whitespace, facilitating easy navigation and comprehension of API endpoints and their functionalities, potentially with a side navigation for endpoint categories.
- Subtle and functional animations, such as smooth transitions for content changes or fades for success/error notifications, to enhance user experience without distraction.