- HttpServletRequest is like an envelope that arrives at your Spring Boot server everytime a user interact with the app (like clicking the button or submitting a form)
- The HttpServletRequest object holds everything the server needs to know about the incoming call:
+ HTTP Method: Is it a GET, POST, PUT, or DELETE?
+ Request URI/URL: What endpoint is being called
+ Headers: Metadata like Content-Type, Authorization tokens, or User-Agent (what browser the user is using).
+ Parameters: Data passed in the URL (e.g., ?page=0&size=20).
+ Body: The actual JSON payload sent in a POST or PUT request.
+ Session Info: Data about the user's current session or cookies.
+ Security Context: Information about the authenticated user (if they are logged in).

- The role of JWT and Refresh Token
1) JWT
+ The JWT is your Short-Term Pass (usually valid for 15–30 minutes).
+ Its Role: It’s a "stateless" proof of identity. Every time your React frontend makes an API call (e.g., fetching a university rank), it attaches this token in the Authorization header.
+ The Benefit: The Backend doesn't have to check the database for every single click. It just looks at the JWT, verifies the signature, and says, "Yep, this is valid for User X. Proceed."
+ The Risk: If a hacker steals a JWT, they can use it until it expires. You can't easily "un-send" a JWT once it's issued.
2) Refresh Token
+ The Refresh Token is your Long-Term ID (usually valid for 7–30 days).
+ Its Role: It has only one job: To get a new JWT. It is never used to access actual data API endpoints.
+ The Benefit: It stays in the database (unlike the JWT). This means you can revoke it.
+ The Workflow: When the JWT expires (React gets a 401 error), your frontend automatically sends the Refresh Token to the /refresh endpoint.
3) How they work together (The Cycle)
+ This is why your code has that refreshToken method:
+ Login: You give a password ⇒ Server gives you both a JWT and a Refresh Token.
+ Access: React uses the JWT for everything. The user is happy and fast.
+ Expiry: The JWT dies after 15 minutes.
+ The "Silent" Refresh: React sends the Refresh Token to the backend.
+ The Check: The backend checks the DB and the Metadata (IP/Browser).
+ The Swap: If everything is cool, the backend kills the old Refresh Token and gives React a brand new pair.