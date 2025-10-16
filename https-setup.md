# HTTPS Setup for Frontend
# 1. Install mkcert for local SSL certificates
# Download from: https://github.com/FiloSottile/mkcert/releases

# 2. Generate localhost certificate
# Run these commands in terminal:
# mkcert -install
# mkcert localhost 127.0.0.1 ::1

# 3. This will create:
# - localhost+2.pem (certificate)
# - localhost+2-key.pem (private key)

# 4. Move certificates to project folder
# mkdir certs
# mv localhost+2.pem certs/
# mv localhost+2-key.pem certs/