# 🔥 GitHub 오늘의 트렌딩

최근 하루 동안 GitHub에서 가장 화제가 된 레포지토리를 보여주는 정적 페이지입니다.
백엔드 없이 브라우저에서 [GitHub Search API](https://docs.github.com/en/rest/search)를 직접 호출합니다.

## 동작 방식

- GitHub에는 공식 "트렌딩 API"가 없으므로, **기간 내 생성된 레포를 스타 순으로** 정렬해 화제도를 근사합니다.
- 기간(1/3/7일)과 언어로 필터링할 수 있습니다.
- 미인증 호출이라 GitHub Search API 한도(분당 10회)가 적용됩니다.

## 로컬에서 보기

```bash
python3 -m http.server 8000
# http://localhost:8000 접속
```

## GitHub Pages 발행

이 레포는 `main` 브랜치에 푸시되면 `.github/workflows/pages.yml`이 자동으로 Pages에 배포합니다.

최초 1회 설정이 필요합니다:

1. 레포 **Settings → Pages** 이동
2. **Build and deployment → Source**를 `GitHub Actions`로 설정

이후 `main`에 푸시될 때마다 자동 배포되며, 배포 URL은 Actions 실행 로그와 Pages 설정 화면에서 확인할 수 있습니다.

## 파일 구성

| 파일 | 설명 |
| --- | --- |
| `index.html` | 페이지 구조 |
| `styles.css` | 다크 테마 스타일 |
| `app.js` | GitHub API 호출 및 렌더링 |
| `.github/workflows/pages.yml` | Pages 자동 배포 워크플로우 |
