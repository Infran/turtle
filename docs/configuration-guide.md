# Configuration Guide

This guide covers the necessary configuration to run the application with a custom domain (`turtle.infran.dev.br`) and enable Google Login.

## 1. Cloudflare Configuration

To make your local computer accessible via `turtle.infran.dev.br`:

1.  **DNS Management**:
    *   Go to your Cloudflare Dashboard > DNS.
    *   Add a **A Record**:
        *   **Name**: `turtle`
        *   **IPv4 Address**: Your Public IP (search "what is my ip" on Google).
        *   **Proxy Status**: **Proxied** (Orange Cloud).
    *   *Alternatively*, if you have a dynamic IP, you might need a DDNS updater or manually update this when your IP changes.

2.  **SSL/TLS**:
    *   Go to SSL/TLS > Overview.
    *   Set encryption mode to **Flexible**.
        *   *Reason*: Your local Nginx is listening on port 80 (HTTP). Cloudflare will handle HTTPS to the user, but talk to your server via HTTP.
    *   **Important**: If you later configure SSL locally, switch this to **Full**.

## 2. Router Configuration (Port Forwarding)

Your router needs to know where to send traffic that comes to your Public IP.

1.  Access your router's admin page (usually `192.168.0.1` or `192.168.1.1`).
2.  Find **Port Forwarding** or **Virtual Server**.
3.  Add a new rule:
    *   **External Port**: 80
    *   **Internal Port**: 80
    *   **Internal IP**: Your computer's local IP (e.g., `192.168.x.x`).
    *   **Protocol**: TCP.

## 3. Google Cloud Console

To allow Google Login from your domain:

1.  Go to [Google Cloud Console](https://console.cloud.google.com/).
2.  Select your project.
3.  Go to **APIs & Services > Credentials**.
4.  Edit your **OAuth 2.0 Client ID**.
5.  **Authorized JavaScript origins**:
    *   Add: `https://turtle.infran.dev.br`
    *   Add: `http://localhost:5173` (for local dev).
6.  **Authorized redirect URIs** (if used):
    *   Add: `https://turtle.infran.dev.br`

## 4. Application Configuration

### Nginx (`nginx.conf`)
Ensure `server_name` includes your domain:
```nginx
server {
    listen 80;
    server_name turtle.infran.dev.br localhost;
    ...
}
```

### Environment Variables (`.env`)
Ensure your `VITE_GOOGLE_CLIENT_ID` matches the one in Google Cloud Console.

## Troubleshooting

*   **"Origin Mismatch" Error**: Check "Authorized JavaScript origins" in Google Console. It must exactly match the URL in your browser (https vs http).
*   **Site not loading**: Check Port Forwarding on your router and ensure Docker/Nginx is running.
*   **Cloudflare 522 Error**: Connection timed out. Your router is not forwarding port 80 correctly, or your ISP blocks port 80.
