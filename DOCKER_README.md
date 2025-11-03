# Docker Setup - MaisPrati Hub

## Como testar se está funcionando

### 1. Build e teste local

```bash
# 1. Fazer build da imagem
docker build -t maisprati-hub .

# 2. Executar container localmente
docker run -d -p 8080:80 --name maisprati-hub-test maisprati-hub

# 3. Testar no navegador
# Acesse: http://localhost:8080

# 4. Fazer health check
curl http://localhost:8080/health

# 5. Ver logs do container
docker logs maisprati-hub-test

# 6. Parar e remover container de teste
docker stop maisprati-hub-test
docker rm maisprati-hub-test
```

### 2. Usando Docker Compose (Recomendado)

```bash
# Build e executar
docker-compose up --build

# Executar em background
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

## Como subir para o Docker Hub

### 1. Preparação

```bash
# 1. Fazer login no Docker Hub
docker login

# 2. Criar tag com seu username
docker tag maisprati-hub seunome/maisprati-hub:latest
docker tag maisprati-hub seunome/maisprati-hub:v1.0.0
```

### 2. Push para Docker Hub

```bash
# Push da versão latest
docker push seunome/maisprati-hub:latest

# Push de versão específica
docker push seunome/maisprati-hub:v1.0.0

# Push de todas as tags
docker push seunome/maisprati-hub --all-tags
```

### 3. Usando o script automatizado

```bash
# Tornar executável (Linux/Mac)
chmod +x docker-deploy.sh

# Executar com versão específica
./docker-deploy.sh v1.0.0

# Ou usar latest
./docker-deploy.sh
```

## Deploy em produção

### 1. Executar do Docker Hub

```bash
# Executar diretamente do Docker Hub
docker run -d \
  -p 80:80 \
  --name maisprati-hub \
  --restart unless-stopped \
  seunome/maisprati-hub:latest
```

### 2. Com variáveis de ambiente

```bash
docker run -d \
  -p 80:80 \
  --name maisprati-hub \
  --restart unless-stopped \
  -e NODE_ENV=production \
  seunome/maisprati-hub:latest
```

### 3. Com Docker Compose em produção

```yaml
# docker-compose.prod.yml
version: "3.8"
services:
  app:
    image: seunome/maisprati-hub:latest
    ports:
      - "80:80"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
```

```bash
# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

## 🔍 Monitoramento e Troubleshooting

### Comandos úteis

```bash
# Ver containers rodando
docker ps

# Ver logs em tempo real
docker logs -f maisprati-hub

# Acessar container
docker exec -it maisprati-hub sh

# Ver uso de recursos
docker stats maisprati-hub

# Inspecionar imagem
docker inspect maisprati-hub

# Ver tamanho da imagem
docker images maisprati-hub
```

### Health Check

A aplicação possui um endpoint de health check em `/health` que retorna:

- Status 200 com "healthy" quando funcionando
- Pode ser usado para monitoramento e load balancers

## Estrutura dos arquivos Docker

```
├── Dockerfile              # Imagem de produção otimizada
├── Dockerfile.dev         # Imagem para desenvolvimento
├── docker-compose.yml     # Configuração para desenvolvimento/teste
├── nginx.conf             # Configuração do Nginx
├── .dockerignore          # Arquivos ignorados no build
└── docker-deploy.sh       # Script de deploy automatizado
```

## Otimizações implementadas

1. **Multi-stage build**: Reduz tamanho da imagem final
2. **Nginx otimizado**: Cache, compressão, segurança
3. **Alpine Linux**: Imagens menores e mais seguras
4. **Cache de dependências**: Build mais rápido
5. **Health checks**: Monitoramento de saúde
6. **Segurança**: Headers de segurança configurados

## Troubleshooting comum

### Erro de build

```bash
# Limpar cache do Docker
docker builder prune

# Build sem cache
docker build --no-cache -t maisprati-hub .
```

### Erro de porta em uso

```bash
# Ver processo usando a porta
lsof -i :8080  # Linux/Mac
netstat -ano | findstr :8080  # Windows

# Parar todos os containers
docker stop $(docker ps -q)
```

### Problemas de permissão

```bash
# Linux: adicionar usuário ao grupo docker
sudo usermod -aG docker $USER
```
