# WebChatApp

open‑source, lightweight web chat application for real‑time messaging.

## Features

- Responsive, browser‑based UI
- Easy to self‑host and extend
- Minimal dependencies
- 3 different chat rooms

## Quick start

1. Clone the repo:
    `git clone /path/to/repo`
2. Install dependencies:
    `npm install`
3. Setup Database:
 `see SQL create commands below`
4. Run the app:
    `npm start`
5. Open your browser at `http://localhost:8080`

## Future Features

- Real time updating with websockets
- Dynamic user channel creation
- Password protected channels
- Encrypted messaging
- Password protected Admin chat view (with delete buttons)
- AI powerd moderation (trust)

## SQL commands

```sql
CREATE TABLE `messages` (
  `msgID` int NOT NULL AUTO_INCREMENT,
  `mesage` varchar(1501) NOT NULL,
  `username` varchar(16) NOT NULL,
  `timestmp` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`msgID`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```

## License

AGPL-3.0
