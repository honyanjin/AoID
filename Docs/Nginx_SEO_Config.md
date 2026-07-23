# Nginx 게시글 동적 메타데이터(SEO) 프록시 설정 가이드

구글 서치콘솔 색인 및 소셜 미디어(카카오톡, 페이스북, 트위터) 썸네일/OG 태그 공유를 위해 EC2 프로덕션 서버의 Nginx 설정 파일(`/etc/nginx/sites-available/aoid`)에 아래 봇 분기(Bot Detection) 프록시 규칙을 적용합니다.

---

## 1. Nginx 설정 위치

- **파일 경로**: `/etc/nginx/sites-available/aoid`
- **수정 명령어**: `sudo nano /etc/nginx/sites-available/aoid`

---

## 2. Nginx 설정 구문 적용

### A. 크롤러 봇 감지 (HTTP 블록 또는 Server 블록 상단)

`/etc/nginx/sites-available/aoid` 맨 위에 봇 감지 map을 추가합니다:

```nginx
map $http_user_agent $is_bot {
    default 0;
    ~*(googlebot|bingbot|yeti|daum|naverbot|facebookexternalhit|twitterbot|kakaotalk-scrap|linkedinbot) 1;
}
```

### B. 게시글 경로 봇 분기 처리 (Server 블록 내부)

일반 사용자가 직접 주소를 입력하거나 새로고침할 때는 React SPA(`index.html`)가 실행되도록 하고, **서치봇 및 소셜 스크랩 봇만 백엔드 SEO 엔드포인트로 프록시**합니다:

```nginx
    # -------------------------------------------------------------
    # 게시글 경로 (서치봇만 SEO 엔드포인트 프록시, 일반 사용자는 React SPA 렌더링)
    # -------------------------------------------------------------
    location ~* ^/(board|[a-zA-Z0-9_-]+)/([0-9]+)$ {
        if ($is_bot = 1) {
            rewrite ^/(board|[a-zA-Z0-9_-]+)/([0-9]+)$ /seo/$1/$2 break;
            proxy_pass http://localhost:5000;
        }
        root /var/www/aoid/frontend/build; # 프론트엔드 빌드 경로
        try_files $uri $uri/ /index.html;
    }
```

---

## 3. Nginx 설정 테스트 및 반영

수정 완료 후 터미널에서 다음 명령어를 실행합니다:

```bash
# 1. Nginx 설정 문법 검증
sudo nginx -t

# 2. Nginx 재로드
sudo systemctl reload nginx
```

---

## 4. 검증

1. **일반 브라우저 (Chrome, Edge 등)**에서 `https://aoid.kr/news/186` 직접 입력/새로고침 -> React 화면 100% 정상 출력
2. **SSH 터미널 봇 테스트**:
   ```bash
   curl -A "Googlebot" -s https://aoid.kr/news/186 | grep -E "(title|description|canonical)"
   ```
   -> 백엔드 SEO 동적 메타 태그 100% 정상 응답
