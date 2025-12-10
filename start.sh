#!/bin/bash

# Start the FastAPI backend in the background
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 &
FASTAPI_PID=$!

# Wait for FastAPI to start
sleep 2

# Start the Node.js frontend server
NODE_ENV=development npx tsx server/index.ts &
NODE_PID=$!

# Wait for both processes
wait $FASTAPI_PID $NODE_PID
