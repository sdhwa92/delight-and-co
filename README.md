# Next.js Starter Kit

Next.js · TypeScript · Tailwind CSS v4 · shadcn/ui 기반 미니멀 스타터킷.

## 기술 스택

| 라이브러리   | 버전   | 설명                                  |
| ------------ | ------ | ------------------------------------- |
| Next.js      | 16+    | App Router, TypeScript, Turbopack     |
| Tailwind CSS | v4     | `tailwind.config` 없이 CSS만으로 설정 |
| shadcn/ui    | latest | Radix UI 기반 접근성 높은 컴포넌트    |
| lucide-react | latest | 아이콘 라이브러리                     |
| next-themes  | latest | 라이트/다크/시스템 테마 토글          |

## 시작하기

```bash
yarn dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열면 됩니다.

## 스크립트

```bash
yarn dev          # 개발 서버 실행 (Turbopack)
yarn build        # 프로덕션 빌드
yarn start        # 프로덕션 서버 실행
yarn lint         # ESLint 실행
yarn lint:fix     # ESLint 자동 수정
yarn format       # Prettier 포매팅
yarn format:check # Prettier 검사
```

## 컴포넌트 추가

shadcn/ui 컴포넌트를 추가할 때는 다음 명령어를 사용합니다:

```bash
npx shadcn@latest add <component-name>

# 예시
npx shadcn@latest add dialog
npx shadcn@latest add input
npx shadcn@latest add table
```

## 폴더 구조

```
src/
├── app/
│   ├── layout.tsx        # 루트 레이아웃 (ThemeProvider + 헤더/푸터)
│   ├── page.tsx          # 홈 페이지
│   └── globals.css       # Tailwind v4 + shadcn 디자인 토큰
├── components/
│   ├── ui/               # shadcn 컴포넌트 (button, card, dropdown-menu)
│   ├── theme-provider.tsx
│   ├── theme-toggle.tsx
│   ├── site-header.tsx
│   └── site-footer.tsx
└── lib/
    └── utils.ts          # cn() 유틸리티 함수
```

## 참고 링크

- [Next.js 문서](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [lucide-react](https://lucide.dev)
- [next-themes](https://github.com/pacocoursey/next-themes)
