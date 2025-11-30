# SaaS Deployment Guide

This guide details the steps to deploy the Turtle application on a new server. As a SaaS application intended for owner-deployment, these steps ensure replicability across multiple instances.

## 1. Server Prerequisites

Ensure the target server has the following installed:
-   **Git**: To clone the repository.
-   **Docker**: To build and run the application container.
-   **PowerShell** (Optional): If using the `publish.ps1` script on Windows. On Linux, standard Docker commands will be used.

## 2. Installation

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/your-username/turtle.git
    cd turtle
    ```

2.  **Environment Setup**:
    Create a `.env` file in the root directory. You can copy a template if available, or create one with the following required variables:
    ```env
    VITE_GOOGLE_CLIENT_ID=your_google_client_id
    VITE_GOOGLE_API_KEY=your_google_api_key
    ```

## 3. Network & Domain Configuration

### DNS (Cloudflare)
1.  Point your domain (e.g., `app.yourdomain.com`) to the server's public IP using an **A Record**.
2.  Enable **Proxy Status** (Orange Cloud) for SSL/TLS offloading if desired.

### Nginx Configuration
The repository comes with a generic `nginx.conf`. You **must** customize this for each server instance.

1.  Open `nginx.conf`.
2.  Update the `server_name` directive to match your domain:
    ```nginx
    server {
        listen 80;
        server_name app.yourdomain.com; # <--- Update this
        ...
    }
    ```
3.  **Important**: If you have a `nginx.conf.private` from a previous backup, you can simply overwrite `nginx.conf` with it (ensure you don't commit the private file back to git).

## 4. Google Authentication

Each deployment domain needs to be authorized in the Google Cloud Console.

1.  Go to [Google Cloud Console](https://console.cloud.google.com/) > **APIs & Services** > **Credentials**.
2.  Edit your **OAuth 2.0 Client ID**.
3.  Add the new domain to **Authorized JavaScript origins** (e.g., `https://app.yourdomain.com`).
4.  Add the new domain to **Authorized redirect URIs** (e.g., `https://app.yourdomain.com`).

## 5. Build and Deploy

### Using PowerShell (Windows)
Run the included publish script:
```powershell
./publish.ps1
```

### Manual Deployment (Linux/Mac/Generic)
If you are not using PowerShell, run the following Docker commands:

1.  **Build the Image**:
    ```bash
    # Load env vars (simplified approach, or just paste them)
    export VITE_GOOGLE_CLIENT_ID=your_id
    export VITE_GOOGLE_API_KEY=your_key

    docker build -t turtle-app \
      --build-arg VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID \
      --build-arg VITE_GOOGLE_API_KEY=$VITE_GOOGLE_API_KEY \
      .
    ```

2.  **Run the Container**:
    ```bash
    docker stop turtle-container || true
    docker rm turtle-container || true
    docker run -d -p 80:80 --name turtle-container turtle-app
    ```

## Troubleshooting

-   **Login Fails**: Check Google Cloud Console "Authorized origins".
-   **502 Bad Gateway**: Check if the Docker container is running (`docker ps`).
-   **Domain not resolving**: Check Cloudflare DNS settings.
