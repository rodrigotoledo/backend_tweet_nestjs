# Endpoints de Like/Dislike de Tweet

## Entidade Like
- Relaciona um usuário (`user`) a um tweet (`tweet`).
- Cada usuário pode dar like em um tweet apenas uma vez.

## Endpoints

### Dar Like em um Tweet
- **POST** `/tweets/:id/like`
- **Requer autenticação JWT** (usuário logado)
- O usuário logado só pode dar like uma vez por tweet.
- Se já tiver dado like, retorna o tweet sem duplicar o like.
- **Retorno:** Tweet atualizado (incluindo likes)

#### Exemplo de requisição
```
POST /tweets/123/like
Authorization: Bearer <token>
```

### Remover Like (Dislike) de um Tweet
- **POST** `/tweets/:id/dislike`
- **Requer autenticação JWT** (usuário logado)
- Remove o like do usuário logado, se existir.
- **Retorno:** Tweet atualizado (incluindo likes)

#### Exemplo de requisição
```
POST /tweets/123/dislike
Authorization: Bearer <token>
```

## Observações
- O backend garante que cada usuário só pode curtir uma vez cada tweet.
- O campo `likes` do tweet retorna a lista de likes (pode ser usado para contar ou exibir quem curtiu).
- O usuário é identificado pelo token JWT enviado no header Authorization.

---

Dúvidas ou sugestões? Abra uma issue ou entre em contato com o mantenedor do projeto.
