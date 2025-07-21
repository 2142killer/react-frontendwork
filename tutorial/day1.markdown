# Day 1: Hướng dẫn cài đặt Ant Design, React Query và Tìm hiểu cơ bản về React

## Mục tiêu
- Hiểu khái niệm cơ bản về JSX, Component và Props.
- Biết cách sử dụng JSX để viết HTML trong JavaScript.
- Tạo và sử dụng Functional Components.
- Hiểu và sử dụng Props để truyền dữ liệu giữa các Components.
- Tạo ứng dụng React đơn giản với Ant Design và React Query.

## Yêu cầu
- Dự án React đã được tạo bằng Vite và TypeScript (xem hướng dẫn tạo dự án trong `README.md`).
- `pnpm` đã được cài đặt.

## 1. Cài đặt Ant Design và React Query

### Cài đặt Ant Design
Ant Design (`antd`) là một thư viện UI phổ biến cho React. Để cài đặt:
```bash
pnpm add antd
```

Thêm CSS của Ant Design vào file `src/index.css`:
```css
@import 'antd/dist/reset.css';
```

### Cài đặt React Query
React Query là thư viện quản lý trạng thái dữ liệu và gọi API. Cài đặt:
```bash
pnpm add @tanstack/react-query
```

Cấu hình React Query trong `src/main.tsx`:
```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
```

## 2. Tìm hiểu cơ bản về React

### Phần 1: Tổng quan JSX

#### Khái niệm JSX
JSX (JavaScript XML) là cú pháp mở rộng cho JavaScript, cho phép viết HTML trong mã JavaScript. JSX được biên dịch thành các lệnh gọi hàm React để tạo giao diện.

Ví dụ:
```jsx
const element = <h1>Hello, World!</h1>;
```

#### Biểu thức trong JSX
Bạn có thể nhúng các biểu thức JavaScript trong JSX bằng cách sử dụng dấu `{}`:
```jsx
const name = "User";
const element = <h1>Hello, {name}!</h1>;
```

#### JSX với nhiều dòng
JSX cho phép viết nhiều dòng HTML, nhưng phải được bao bọc trong một phần tử cha:
```jsx
const element = (
  <div>
    <h1>Hello, World!</h1>
    <p>Welcome to React!</p>
  </div>
);
```

#### Wrapper trong JSX
JSX yêu cầu tất cả các phần tử phải được bao bọc trong một phần tử cha (wrapper). Nếu không muốn thêm phần tử phụ, bạn có thể sử dụng Fragment (`<></>`):
```jsx
const element = (
  <>
    <h1>Hello, World!</h1>
    <p>Welcome to React!</p>
  </>
);
```

### Phần 2: Component nâng cao - Props

#### Khái niệm Component
Component là các khối xây dựng độc lập trong React, có thể tái sử dụng. Có hai loại chính:
- **Functional Components**: Hàm JavaScript trả về JSX.
- **Class Components** (ít dùng hơn): Class kế thừa từ `React.Component`.

Ví dụ Functional Component:
```tsx
function Welcome() {
  return <h1>Hello, World!</h1>;
}
```

#### Tạo mới Component
Tạo một file `src/components/Greeting.tsx`:
```tsx
function Greeting() {
  return <h1>Welcome to my app!</h1>;
}

export default Greeting;
```

Sử dụng trong `src/App.tsx`:
```tsx
import Greeting from './components/Greeting';

function App() {
  return (
    <div>
      <Greeting />
    </div>
  );
}

export default App;
```

#### Nested Component
Các component có thể được lồng vào nhau:
```tsx
import Greeting from './components/Greeting';

function App() {
  return (
    <div>
      <Greeting />
      <p>This is nested content.</p>
    </div>
  );
}

export default App;
```

#### Props và Props Children
Props (properties) là cách truyền dữ liệu từ component cha sang component con.

Ví dụ component với props:
```tsx
// src/components/Greeting.tsx
type GreetingProps = {
  name: string;
};

function Greeting({ name }: GreetingProps) {
  return <h1>Hello, {name}!</h1>;
}

export default Greeting;
```

Sử dụng trong `src/App.tsx`:
```tsx
import Greeting from './components/Greeting';

function App() {
  return (
    <div>
      <Greeting name="Alice" />
      <Greeting name="Bob" />
    </div>
  );
}

export default App;
```

**Props Children**: Dùng để truyền nội dung con vào component:
```tsx
// src/components/Card.tsx
type CardProps = {
  children: React.ReactNode;
};

function Card({ children }: CardProps) {
  return <div style={{ border: '1px solid #ccc', padding: '16px' }}>{children}</div>;
}

export default Card;
```

Sử dụng trong `src/App.tsx`:
```tsx
import Card from './components/Card';
import Greeting from './components/Greeting';

function App() {
  return (
    <div>
      <Card>
        <Greeting name="Alice" />
        <p>This is inside a card!</p>
      </Card>
    </div>
  );
}

export default App;
```

## 3. Tạo ứng dụng React đơn giản
Tạo một ứng dụng đơn giản sử dụng Ant Design và React Query.

### Ví dụ: Ứng dụng hiển thị danh sách người dùng
Tạo file `src/components/UserList.tsx`:
```tsx
import { useQuery } from '@tanstack/react-query';
import { List, Spin } from 'antd';

type User = {
  id: number;
  name: string;
};

async function fetchUsers(): Promise<User[]> {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  return response.json();
}

function UserList() {
  const { data, isLoading, error } = useQuery({ queryKey: ['users'], queryFn: fetchUsers });

  if (isLoading) return <Spin />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <List
      bordered
      dataSource={data}
      renderItem={(user: User) => (
        <List.Item>
          {user.name}
        </List.Item>
      )}
    />
  );
}

export default UserList;
```

Cập nhật `src/App.tsx`:
```tsx
import { Button } from 'antd';
import UserList from './components/UserList';

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>My React App</h1>
      <Button type="primary">Click me</Button>
      <UserList />
    </div>
  );
}

export default App;
```

### Chạy ứng dụng
```bash
pnpm dev
```

Truy cập `http://localhost:5173` để xem danh sách người dùng được tải từ API và hiển thị với Ant Design.

## Tài nguyên bổ sung
- [Tài liệu Ant Design](https://ant.design/)
- [Tài liệu React Query](https://tanstack.com/query/)
- [Tài liệu React](https://react.dev/)
- [Tài liệu TypeScript](https://www.typescriptlang.org/)

Chúc bạn học React hiệu quả!