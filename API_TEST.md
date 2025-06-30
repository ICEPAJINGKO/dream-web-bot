# Dream Bot API Test

## Test endpoints using curl

### 1. Check Bot Status
```bash
curl http://localhost:3000/dream-bot/status
```

### 2. Run Bot Once (Test)
```bash
curl -X POST http://localhost:3000/dream-bot/run-once
```

### 3. Start Bot with Multiple Cycles
```bash
curl -X POST http://localhost:3000/dream-bot/start \
  -H "Content-Type: application/json" \
  -d '{"cycles": 3}'
```

### 4. Stop Bot
```bash
curl -X POST http://localhost:3000/dream-bot/stop
```

## Test with PowerShell (Windows)

### 1. Check Status
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/dream-bot/status" -Method Get
```

### 2. Start Bot
```powershell
$body = @{ cycles = 3 } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/dream-bot/start" -Method Post -Body $body -ContentType "application/json"
```

### 3. Stop Bot
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/dream-bot/stop" -Method Post
```
