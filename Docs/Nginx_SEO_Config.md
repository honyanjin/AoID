# Nginx 게시글 동적 메타데이터(SEO) 프록시 설정 가이드

구글 서치콘솔 색인 및 소셜 미디어(카카오톡, 페이스북, 트위터) 썸네일/OG 태그 공유를 위해 EC2 프로덕션 서버의 Nginx 설정 파일(`/etc/nginx/sites-available/aoid`)에 아래 프록시 규칙을 적용합니다.

---

## 1. Nginx 설정 위치

- **파일 경로**: `/etc/nginx/sites-available/aoid`
- **수정 명령어**: `sudo nano /etc/nginx/sites-available/aoid`

---

## 2. Nginx 설정 구문 적용 (Server 블록 내부)

서치봇(Googlebot, bingbot, Naverbot, Kakao, Facebook 등)이 게시글 URL(`https://aoid.kr/board/1` 등)로 접근할 때 백엔드 SEO 엔드포인트(`/seo/...`)로 요청을 프록시하도록 설정합니다.

```nginx
server {
    server_name aoid.kr www.aoid.kr;

    # ... 기존 SSL 및 공통 설정 ...

    # -------------------------------------------------------------
    # 게시글 동적 메타데이터(SEO) 처리 (크롤러봇 및 게시글 직접 접근)
    # -------------------------------------------------------------
    
    # 1. 크롤러 봇 감지 맵 (HTTP Context 내에 선언 가능)
    # map $http_user_agent $is_bot {
    #     default 0;
    #     ~*(googlebot|bingbot|yeti|daum|naverbot|facebookexternalhit|twitterbot|kakaotalk-scrap|linkedinbot) 1;
    # }

    # 2. 게시글 상세 경로 요청 프록시 (board 및 동적 섹션 게시글)
    location ~* ^/(board|[a-zA-Z0-9_-]+)/([0-9]+)$ {
        # 크롤러봇이거나 직접 렌더링 요청 시 백엔드 SEO 엔드포인트로 프록시
        proxy_pass http://localhost:5000/seo/$1/$2;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # API 요청 프록시
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # 정적 파일 및 React SPA 기본 프록시
    location / {
        root /var/www/aoid/frontend/build; # 프론트엔드 빌드 경로
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 3. Nginx 설정 테스트 및 반영

수정 완료 후 터미널에서 다음 명령어를 실행합니다:

```bash
# 1. Nginx 설정 문법 검증
sudo nginx -t

# 2. Nginx 재로드 (서비스 중단 없음)
sudo systemctl reload nginx
```

---

## 4. 동작 검증 명령어

로컬 또는 외부 터미널에서 구글봇 User-Agent로 게시글 URL을 요청하여 동적 메타 태그가 반환되는지 확인합니다:

```bash
curl -A "Googlebot" -s https://aoid.kr/board/1 | grep -E "(title|description|og:title|canonical)"
```
