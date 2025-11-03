#!/bin/bash

# Script para build e deploy da aplicação Docker
# Uso: ./docker-deploy.sh [tag_version]

set -e

# Configurações
IMAGE_NAME="maisprati-hub"
DOCKER_USERNAME="seunome"  # Substitua pelo seu username do Docker Hub
TAG=${1:-"latest"}
FULL_IMAGE_NAME="$DOCKER_USERNAME/$IMAGE_NAME:$TAG"

echo "Iniciando build da imagem Docker..."

# Build da imagem
echo "Building image: $FULL_IMAGE_NAME"
docker build -t $FULL_IMAGE_NAME .

echo "Build concluído com sucesso!"

# Testar a imagem localmente
echo "Testando a imagem localmente..."
echo "Acesse http://localhost:8080 para testar"
echo "Pressione Ctrl+C para parar o container de teste"

# Executar container de teste
docker run --rm -p 8080:80 --name ${IMAGE_NAME}-test $FULL_IMAGE_NAME &
CONTAINER_PID=$!

# Aguardar alguns segundos para o container inicializar
sleep 3

# Fazer um health check básico
if curl -f http://localhost:8080/health > /dev/null 2>&1; then
    echo "Health check passou!"
else
    echo "Health check falhou!"
fi

# Parar o container de teste
kill $CONTAINER_PID 2>/dev/null || true

echo "Para fazer push para o Docker Hub:"
echo "   docker push $FULL_IMAGE_NAME"
echo ""
echo "Para executar em produção:"
echo "   docker run -d -p 80:80 --name $IMAGE_NAME $FULL_IMAGE_NAME"