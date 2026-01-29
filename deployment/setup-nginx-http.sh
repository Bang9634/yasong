#!/bin/bash

# Nginx HTTP Port Forwarding Setup (without domain)
# This script sets up Nginx to forward port 80 -> 8080

echo "=================================="
echo "Nginx HTTP Setup (Port 80 -> 8080)"
echo "=================================="

# Install Nginx
echo "Installing Nginx..."
sudo apt update
sudo apt install -y nginx

# Remove default config
sudo rm -f /etc/nginx/sites-enabled/default

# Create Nginx config for IP-based access
sudo tee /etc/nginx/sites-available/yasong-art-gallery > /dev/null <<'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    # Server will respond to any IP/hostname
    server_name _;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Max upload size (공지사항 첨부파일)
    client_max_body_size 100M;
    
    # Proxy to Spring Boot application
    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        
        # Proxy headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support (if needed)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Static files cache (if served through Nginx)
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:8080;
        proxy_cache_valid 200 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Health check endpoint
    location /actuator/health {
        proxy_pass http://localhost:8080;
        access_log off;
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/yasong-art-gallery /etc/nginx/sites-enabled/

# Test Nginx config
echo ""
echo "Testing Nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    # Restart Nginx
    echo ""
    echo "Restarting Nginx..."
    sudo systemctl restart nginx
    sudo systemctl enable nginx
    
    echo ""
    echo "=================================="
    echo "✅ Nginx setup completed!"
    echo "=================================="
    echo ""
    echo "접속 주소:"
    echo "  - HTTP:  http://158.179.169.197"
    echo "  - API:   http://158.179.169.197/api/notices"
    echo ""
    echo "방화벽 확인:"
    echo "  sudo ufw allow 80/tcp"
    echo "  sudo ufw status"
    echo ""
    echo "Nginx 상태 확인:"
    echo "  sudo systemctl status nginx"
    echo "  sudo nginx -t"
    echo ""
    echo "로그 확인:"
    echo "  sudo tail -f /var/log/nginx/access.log"
    echo "  sudo tail -f /var/log/nginx/error.log"
else
    echo ""
    echo "❌ Nginx configuration test failed!"
    echo "Please check the error messages above."
    exit 1
fi
