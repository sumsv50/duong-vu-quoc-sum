## Problem 5

# Live Scoreboard API Module

## Core Functionality

1. **Secure Score Updates**: Validates and processes score update requests from authenticated users.
2. **Real-time Leaderboard**: Maintains and broadcasts the current top 10 user scores to all connected clients.
3. **Authorization**: Prevents unauthorized score modifications through robust authentication and validation.
4. **Performance Optimization**: Efficiently handles high-volume score updates without degrading system performance.


## Architecture

The Live Scoreboard API Module is composed of four primary microservices working together

### 1. API Gateway

The API Gateway serves as the entry point for all client requests and handles the following responsibilities:

- **Request Routing**: Directs incoming requests to the appropriate service
- **Logging & Monitoring**: Captures metrics for all incoming requests
- **CORS Support**: Handles cross-origin resource sharing for browser clients

### 2. Authentication Service

The Authentication Service manages all aspects of user identity and access control:

- **Token Validation**: Verifies JWT tokens from client requests
- **Permission Management**: Ensures users have appropriate permissions for requested actions
- **User Identity**: Provides user information to other services
- **Token Renewal**: Issues new tokens when existing ones approach expiration
- **Internal Token Generation**: Issues internal tokens for service-to-service communication after verifying client JWT tokens
- **Audit Logging**: Records authentication events for security monitoring

**Tech Stack Recommendation:**
- Node.js with Passport.js
- Redis for token blacklisting
- PostgreSQL for user storage

### 3. Score Processing Service

The Score Processing Service handles all business logic related to score updates:

- **Score Calculation**: Processes action completions to update user scores
- **Action Verification**: Validates that actions are legitimate and not duplicates
- **Leaderboard Management**: Maintains and updates the current leaderboard state
- **Score History**: Tracks historical score data for analysis
- **Event Generation**: Produces events for real-time notifications

**Tech Stack Recommendation:**
- Go for processing efficiency
- Redis for caching current scores and leaderboard
- PostgreSQL for persistent score storage
- Apache Kafka or Redis Pub/Sub for event broadcasting

### 4. WebSocket Service

The WebSocket Service manages real-time communication with connected clients:

- **Connection Management**: Handles client connections and disconnections
- **Authentication**: Verifies client identity for WebSocket connections
- **Event Broadcasting**: Pushes real-time updates to connected clients
- **Message Queuing**: Buffers messages for clients with temporary connection issues

**Tech Stack Recommendation:**
- Node.js with Socket.IO or uWebSockets
- Redis for pub/sub and shared state

## Service Integration Flow

The four services work together as follows:

1. Client sends score update request to the API Gateway
2. API Gateway forwards request to Authentication Service for validation
3. If authenticated, request is passed to Score Processing Service
4. Score Processing Service verifies the action and updates the score
5. If leaderboard changes, Score Processing Service publishes an event
6. WebSocket Service receives the event and broadcasts to connected clients
7. Connected clients receive and display the updated leaderboard

## API Endpoints

### Score Update Endpoint

```
POST /api/v1/scores/update
```

#### Request Headers
- `Authorization`: Bearer token for user authentication

#### Request Body
```json
{
  "actionId": "string",  // Unique identifier for the completed action
  "timestamp": "string", // ISO 8601 timestamp of when the action was completed
  "metadata": {}         // Optional additional data about the action
}
```

#### Response
```json
{
  "success": true,
  "newScore": 125,
  "rank": 5,          // Current user rank after update
  "leaderboardChange": true  // Indicates if the leaderboard top 10 changed
}
```

#### Error Responses
- `401 Unauthorized`: Invalid or missing authentication token
- `400 Bad Request`: Invalid request format or parameters
- `409 Conflict`: Duplicate action submission detected
- `429 Too Many Requests`: Rate limit exceeded

### Leaderboard Retrieval Endpoint

```
GET /api/v1/leaderboard
```

#### Response
```json
{
  "lastUpdated": "2025-03-08T12:30:45Z",
  "leaderboard": [
    {
      "userId": "user123",
      "username": "TopPlayer",
      "score": 1250,
      "rank": 1
    },
    // ... additional users up to 10 total
  ]
}
```

## WebSocket Interface

### Connection

Connect to the WebSocket server at:
```
wss://api.example.com/ws/leaderboard
```

#### Authentication Methods

- Connect first, then send an authentication message:
```json
{
  "type": "authenticate",
  "token": "YOUR_JWT_TOKEN"
}
```
- The connection requires the same authentication token used for REST API calls.
- Must be sent within 5 seconds of connection or the connection will be closed


#### Authentication Flow

1. Client initiates WebSocket connection
2. Client send an authentication message to server
3. Server validates the JWT token (checking signature, expiration, and permissions)
4. If authentication fails, connection is closed with a code 4001
5. If successful, connection is maintained and client receives a confirmation message:
   ```json
   {
     "event": "connection_established",
     "data": {
       "userId": "user123",
       "timestamp": "2025-03-08T12:30:45Z",
       "permissions": ["view_leaderboard", "receive_updates"]
     }
   }
   ```
6. If a client doesn't send an authentication message to the server within 5 seconds of the connection being established, the server must close the client's connection.

#### Token Expiration and Renewal

- WebSocket connections will be terminated when the authentication token expires
- Clients should implement reconnection logic with a new token
- The server sends a warning message 5 minutes before token expiration:
  ```json
  {
    "event": "token_expiring",
    "data": {
      "expiresIn": 300 // seconds until expiration
    }
  }
  ```

### Real-time Leaderboard Updates

The system uses a publish-subscribe pattern to efficiently deliver real-time updates to all connected clients.

#### Message Types

1. **Full Leaderboard Update**
   - Sent when a client first connects or after significant changes
   - Contains the complete top 10 leaderboard:
   ```json
   {
     "event": "leaderboard_update",
     "data": {
       "timestamp": "2025-03-08T12:30:45Z",
       "updateType": "full",
       "leaderboard": [
         {
           "userId": "user123",
           "username": "TopPlayer",
           "score": 1250,
           "rank": 1,
           "avatar": "https://example.com/avatars/user123.jpg",
           "change": 0
         },
         // ... additional users up to 10 total
       ]
     }
   }
   ```

2. **Incremental Update**
   - Used for minor changes to reduce bandwidth
   - Only includes the specific changes to the leaderboard:
   ```json
   {
     "event": "leaderboard_update",
     "data": {
       "timestamp": "2025-03-08T12:30:46Z",
       "updateType": "incremental",
       "changes": [
         {
           "userId": "user456",
           "username": "RisingPlayer",
           "score": 1050,
           "previousRank": 8,
           "newRank": 5,
           "avatar": "https://example.com/avatars/user456.jpg",
           "change": 3
         }
       ]
     }
   }
   ```


#### Update Optimization Strategies

1. **Debouncing**
   - Multiple rapid updates are coalesced into a single update
   - When many score changes happen quickly, the system waits briefly (e.g., 100ms) to collect all changes before sending

2. **Differential Updates**
   - Only transmits the data that has changed rather than the entire leaderboard

3. **Update Frequency Control**
   - During high-load periods, updates may be batched and sent at controlled intervals (e.g., max 5 updates per second)
   - Clients can specify preferred update frequency for bandwidth-limited environments


### WebSocket Service High Availability

The WebSocket service is designed for high availability and fault tolerance:

1. **Multiple Service Instances**
   - The service can run across multiple instances behind a load balancer

2. **Connection Migration**
   - If a service instance fails, clients can reconnect to a different instance
   - The new instance retrieves the client's state from a shared cache (if any)

3. **Health Monitoring**
   - Each service instance reports health metrics to a monitoring system
   - Unhealthy instances are automatically removed from the load balancer

4. **Graceful Degradation**
   - Clients can detect connection issues and temporarily switch to RESTful API calls


## Improvements Recommendation
1. **Fraud Detection System**: Implement anomaly detection for unusual score increases
2. **Enhanced Leaderboard Options**
   - Support for different time periods (daily, weekly, monthly, all-time)
   - Regional or category-based leaderboards
   - Friend-only leaderboards to increase engagement  
3. **Real-time User Notifications**: Notify users when they enter or leave the top leaderboard
4. **WebSocket Connection Management**:
   - Add automatic reconnection with exponential backoff on the client side
   - Use heartbeat mechanisms to detect and clean up stale connections