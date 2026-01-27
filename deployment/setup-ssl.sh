#!/bin/bash
# HTTPS 설정 스크립트 (Nginx + Let's Encrypt)
# 사용법: sudo bash setup-ssl.sh your-domain.com

set -e

echo "======================================"
echo "YaSongMuseum HTTPS Setup"
echo "Nginx + Let's Encrypt SSL Certificate"
echo "======================================"

# Root 권한 체크
if [ "$EUID" -ne 0 ]; then
    echo "❌ This script must be run as root (use sudo)"
    exit 1
fi

# 도메인 입력
if [ -z "$1" ]; then
    read -p "Enter your domain name (e.g., yasongmuseum.com): " DOMAIN
else
    DOMAIN=$1
fi

if [ -z "$DOMAIN" ]; then
    echo "❌ Domain name is required!"
    exit 1
fi

read -p "Add www subdomain? (y/n, default: y): " ADD_WWW
ADD_WWW=${ADD_WWW:-y}

if [ "$ADD_WWW" = "y" ]; then
    DOMAINS="-d $DOMAIN -d www.$DOMAIN"
else
    DOMAINS="-d $DOMAIN"
fi

read -p "Enter your email for Let's Encrypt notifications: " EMAIL

if [ -z "$EMAIL" ]; then
    echo "❌ Email is required for Let's Encrypt!"
    exit 1
fi

echo ""
echo "📋 Configuration Summary:"
echo "   Domain: $DOMAIN"
echo "   WWW: $ADD_WWW"
echo "   Email: $EMAIL"
echo ""
read -p "Continue? (y/n): " CONFIRM

if [ "$CONFIRM" != "y" ]; then
    echo "❌ Setup cancelled"
    exit 1
fi

echo ""
echo "🔧 Step 1: Installing Nginx..."
apt update
apt install -y nginx

echo ""
echo "🔧 Step 2: Installing Certbot..."
apt install -y certbot python3-certbot-nginx

echo ""
echo "🔧 Step 3: Configuring Nginx..."

# Backup existing config if exists
if [ -f /etc/nginx/sites-available/yasongmuseum ]; then
    cp /etc/nginx/sites-available/yasongmuseum \
       /etc/nginx/sites-available/yasongmuseum.backup.$(date +%Y%m%d_%H%M%S)
    echo "✅ Existing config backed up"
fi

# Copy Nginx config
cp /home/yasongmuseum/deployment/nginx/yasongmuseum.conf \
   /etc/nginx/sites-available/yasongmuseum

# Update domain in config
sed -i "s/yasongmuseum.com/$DOMAIN/g" /etc/nginx/sites-available/yasongmuseum

# Enable site
ln -sf /etc/nginx/sites-available/yasongmuseum \
       /etc/nginx/sites-enabled/

# Remove default site
rm -f /etc/nginx/sites-enabled/default

# Test Nginx config
nginx -t

if [ $? -ne 0 ]; then
    echo "❌ Nginx configuration test failed!"
    exit 1
fi

echo ""
echo "🔧 Step 4: Starting Nginx..."
systemctl enable nginx
systemctl restart nginx

echo ""
echo "🔐 Step 5: Obtaining SSL Certificate..."
echo "   This may take a few minutes..."

# Obtain certificate
certbot --nginx $DOMAINS \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    --redirect

if [ $? -ne 0 ]; then
    echo "❌ SSL certificate generation failed!"
    echo "   Please check:"
    echo "   1. DNS is properly configured"
    echo "   2. Domain points to this server's IP"
    echo "   3. Firewall allows ports 80 and 443"
    exit 1
fi

echo ""
echo "🔧 Step 6: Setting up auto-renewal..."

# Test renewal
certbot renew --dry-run

if [ $? -eq 0 ]; then
    echo "✅ Auto-renewal test successful"
    # Certbot automatically sets up cron job
    systemctl enable certbot.timer
    systemctl start certbot.timer
else
    echo "⚠️  Auto-renewal test failed, but certificate is installed"
fi

echo ""
echo "🔧 Step 7: Configuring Firewall..."
if command -v ufw &> /dev/null; then
    ufw allow 'Nginx Full'
    ufw delete allow 'Nginx HTTP' 2>/dev/null || true
    ufw reload
    echo "✅ Firewall configured (UFW)"
elif command -v firewall-cmd &> /dev/null; then
    firewall-cmd --permanent --add-service=http
    firewall-cmd --permanent --add-service=https
    firewall-cmd --reload
    echo "✅ Firewall configured (firewalld)"
else
    echo "⚠️  No firewall detected. Please manually allow ports 80 and 443"
fi

echo ""
echo "🔧 Step 8: Restarting services..."
systemctl restart nginx
systemctl restart yasongmuseum

echo ""
echo "======================================"
echo "✅ HTTPS Setup Complete!"
echo "======================================"
echo ""
echo "📋 Summary:"
echo "   🌐 Domain: https://$DOMAIN"
if [ "$ADD_WWW" = "y" ]; then
    echo "   🌐 WWW: https://www.$DOMAIN"
fi
echo "   📧 Notification email: $EMAIL"
echo "   🔐 SSL Certificate: Let's Encrypt"
echo "   📅 Valid for: 90 days (auto-renews)"
echo ""
echo "🔍 Testing:"
echo "   curl -I https://$DOMAIN"
echo "   openssl s_client -connect $DOMAIN:443 -servername $DOMAIN"
echo ""
echo "📊 SSL Grade Check:"
echo "   https://www.ssllabs.com/ssltest/analyze.html?d=$DOMAIN"
echo ""
echo "📝 Logs:"
echo "   Nginx: tail -f /var/log/nginx/yasongmuseum_*.log"
echo "   Certbot: journalctl -u certbot.timer"
echo ""
echo "🔄 Certificate Renewal:"
echo "   Manual: sudo certbot renew"
echo "   Auto: Runs twice daily via systemd timer"
echo ""
echo "======================================"
