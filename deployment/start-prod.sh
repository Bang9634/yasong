#!/bin/bash

# Yasongmuseum 프로덕션 시작 스크립트
# 1GB 서버 최적화 설정 포함

APP_NAME="yasongmuseum"
JAR_FILE="target/yasongmuseum-0.0.1-SNAPSHOT.jar"

# Load environment variables
if [ -f .env ]; then
    source .env
    echo "Environment variables loaded from .env"
else
    echo "Warning: .env file not found. Using default values."
fi

# JVM Memory Optimization for 1GB server
# Heap: 256MB ~ 512MB, Metaspace: 128MB ~ 256MB
JAVA_OPTS="-Xms256m -Xmx512m"
JAVA_OPTS="$JAVA_OPTS -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=256m"
JAVA_OPTS="$JAVA_OPTS -XX:+UseG1GC"
JAVA_OPTS="$JAVA_OPTS -XX:+HeapDumpOnOutOfMemoryError"
JAVA_OPTS="$JAVA_OPTS -XX:HeapDumpPath=logs/heapdump.hprof"

# Create logs directory
mkdir -p logs

echo "=========================================="
echo "  Starting $APP_NAME (Production Mode)"
echo "=========================================="
echo "JAR: $JAR_FILE"
echo "Profile: prod"
echo "JVM Options: $JAVA_OPTS"
echo "=========================================="

# Start application
java $JAVA_OPTS \
    -Dspring.profiles.active=prod \
    -jar $JAR_FILE \
    > logs/application.log 2>&1 &

PID=$!
echo $PID > $APP_NAME.pid

echo ""
echo "✅ Application started with PID: $PID"
echo "📋 Log file: logs/application.log"
echo "🛑 To stop: kill $PID or ./deployment/stop.sh"
echo ""
echo "Monitor logs:"
echo "  tail -f logs/application.log"
