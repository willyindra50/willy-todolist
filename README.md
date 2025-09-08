## 📌 README.md

```markdown
# ✅ TodoList App

A simple **TodoList Application** built with **Next.js 15, TypeScript, Tailwind CSS, and React Query**.  
This app allows users to **create, read, update, delete, and filter todos** with a clean modern UI.

---

## 🚀 Features

- 🔹 Fetch todos from API (infinite scroll / pagination ready)
- 🔹 Add, update, complete, and delete todos
- 🔹 Filter todos by:
  - **Today**
  - **Upcoming**
  - **Completed**
- 🔹 Search todos by title
- 🔹 Sort todos by priority (**HIGH, MEDIUM, LOW**)
- 🔹 Blur / glassmorphism design for UI components
- 🔹 Dark & light mode support

---

## 🛠️ Tech Stack

- [Next.js 15](https://nextjs.org/) – App Router, Server Components
- [TypeScript](https://www.typescriptlang.org/) – Type safety
- [Tailwind CSS](https://tailwindcss.com/) – Styling
- [React Query (TanStack)](https://tanstack.com/query/latest) – Data fetching & caching
- [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/) – UI Components
- [Day.js](https://day.js.org/) – Date formatting
- [React Hot Toast](https://react-hot-toast.com/) – Notifications

---

## 📂 Project Structure
```

src/
├── app/
│ ├── page.tsx # Main Todo App page
│ └── globals.css # Tailwind global styles
├── components/
│ ├── TodoApp.tsx # Todo wrapper with filter/tabs
│ ├── TodoCard.tsx # Individual todo card (edit/delete)
│ ├── AddTaskModal.tsx # Modal to create a new task
│ └── ThemeToggle.tsx # Dark/light mode toggle
├── hooks/
│ └── useTodos.ts # Custom hooks with React Query
└── lib/
└── api.ts # API client for todos

````

---

## ⚙️ Installation

1. Install dependencies

   ```bash
   npm install
   # or
   yarn install
   ```


2. Run development server

   ```bash
   npm run dev
   ```

````
