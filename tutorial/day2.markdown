# Day 2: Hướng dẫn về State, Conditional Rendering và Rendering List trong React

## Mục tiêu
- Hiểu khái niệm State và vai trò của nó trong React.
- Sử dụng hook `useState()` để quản lý state trong Functional Components.
- Biết cách quản lý nhiều state trong một component React.
- Hiểu và áp dụng các phương pháp Conditional Rendering với các toán tử phổ biến.
- Hiểu cơ chế và áp dụng các cách render danh sách.
- Tạo một trang hiển thị danh sách sản phẩm sử dụng React Query, Ant Design và JSON Server.

## Yêu cầu
- Dự án React đã được tạo với Vite, TypeScript, Ant Design, và React Query (xem `day1.md`).
- JSON Server để mock API (cài đặt hướng dẫn bên dưới).
- `pnpm` đã được cài đặt.

## 1. Cài đặt JSON Server
JSON Server là công cụ tạo API giả lập nhanh chóng. Cài đặt:
```bash
pnpm add -g json-server
```

Tạo file `db.json` trong thư mục dự án:
```json
{
  "products": [
    { "id": 1, "name": "Laptop", "price": 1000 },
    { "id": 2, "name": "Phone", "price": 500 },
    { "id": 3, "name": "Tablet", "price": 300 }
  ]
}
```

Chạy JSON Server:
```bash
json-server --watch db.json --port 3001
```

API sẽ chạy tại `http://localhost:3001/products`.

## 2. Tổng quan về State trong React

### Khái niệm State
State là dữ liệu động trong component, cho phép giao diện cập nhật khi dữ liệu thay đổi. State được quản lý bên trong component và khi thay đổi, React sẽ re-render để hiển thị giao diện mới.

### Hook `useState()`
Hook `useState` được sử dụng trong Functional Components để quản lý state.

Ví dụ:
```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

- `useState(0)`: Khởi tạo state `count` với giá trị ban đầu là `0`.
- `setCount`: Hàm cập nhật state, kích hoạt re-render.

### Quản lý nhiều State
Một component có thể có nhiều state bằng cách gọi `useState` nhiều lần:
```tsx
import { useState } from 'react';

function Form() {
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter name"
      />
      <input
        type="number"
        value={age}
        onChange={(e) => setAge(Number(e.target.value))}
        placeholder="Enter age"
      />
      <p>Name: {name}, Age: {age}</p>
    </div>
  );
}
```

### Lưu ý khi sử dụng State
- **Không sửa đổi state trực tiếp**: Luôn sử dụng hàm setter (`setState`) để cập nhật.
- **State là bất biến**: Khi cập nhật object hoặc array, tạo bản sao mới:
  ```tsx
  const [items, setItems] = useState([]);
  setItems([...items, newItem]); // Tạo mảng mới
  ```
- **Hiệu suất**: Tránh cập nhật state không cần thiết để giảm re-render.
- **State là bất đồng bộ**: `setState` không cập nhật ngay lập tức. Sử dụng callback nếu cần giá trị mới:
  ```tsx
  setCount((prevCount) => prevCount + 1);
  ```

## 3. Conditional Rendering và Rendering List

### Tổng quan về Conditional Rendering
Conditional Rendering là cách hiển thị giao diện dựa trên điều kiện.

#### Toán tử ba ngôi
Sử dụng toán tử ba ngôi (`?:`) để render có điều kiện:
```tsx
function Welcome({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <div>
      {isLoggedIn ? <h1>Welcome back!</h1> : <h1>Please sign in</h1>}
    </div>
  );
}
```

#### Toán tử Logical AND (`&&`)
Hiển thị nội dung nếu điều kiện là `true`:
```tsx
function Notification({ hasNewMessage }: { hasNewMessage: boolean }) {
  return (
    <div>
      {hasNewMessage && <p>You have a new message!</p>}
    </div>
  );
}
```

#### Toán tử Logical OR (`||`) và Nullish (`??`)
- `||`: Trả về giá trị bên phải nếu bên trái là falsy.
- `??`: Trả về giá trị bên phải nếu bên trái là `null` hoặc `undefined`.

Ví dụ:
```tsx
function UserProfile({ userName }: { userName?: string }) {
  const displayName = userName ?? 'Guest';
  return <p>Name: {displayName}</p>;
}
```

### Rendering List
Để render danh sách, sử dụng `map` để lặp qua mảng và tạo các phần tử JSX. Mỗi phần tử cần một `key` duy nhất.

Ví dụ:
```tsx
function ProductList({ products }: { products: { id: number; name: string }[] }) {
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

Lưu ý:
- `key` giúp React theo dõi các phần tử, cải thiện hiệu suất.
- Tránh sử dụng index làm `key` nếu danh sách có thể thay đổi thứ tự.

## 4. Ứng dụng hiển thị danh sách sản phẩm
Tạo một trang hiển thị danh sách sản phẩm sử dụng Ant Design, React Query, và JSON Server.

### Tạo component `ProductList`
Tạo file `src/components/ProductList.tsx`:
```tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, Button, Spin } from 'antd';

type Product = {
  id: number;
  name: string;
  price: number;
};

async function fetchProducts(): Promise<Product[]> {
  const response = await fetch('http://localhost:3001/products');
  return response.json();
}

function ProductList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useQuery({ 
    queryKey: ['products', page], 
    queryFn: fetchProducts 
  });

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price}`,
    },
  ];

  return (
    <div>
      {isLoading && <Spin />}
      {error && <p>Error: {error.message}</p>}
      {!isLoading && !error && (
        <>
          <Table
            dataSource={data}
            columns={columns}
            rowKey="id"
            pagination={false}
          />
          <Button
            onClick={() => setPage((prev) => prev + 1)}
            style={{ marginTop: '16px' }}
          >
            Load More
          </Button>
        </>
      )}
    </div>
  );
}

export default ProductList;
```

### Cập nhật `App.tsx`
Cập nhật file `src/App.tsx`:
```tsx
import { Button } from 'antd';
import ProductList from './components/ProductList';

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Product Management</h1>
      <Button type="primary" style={{ marginBottom: '16px' }}>
        Add Product
      </Button>
      <ProductList />
    </div>
  );
}

export default App;
```

### Chạy ứng dụng
1. Đảm bảo JSON Server đang chạy:
   ```bash
   json-server --watch db.json --port 3001
   ```
2. Chạy ứng dụng React:
   ```bash
   pnpm dev
   ```
3. Truy cập `http://localhost:5173` để xem danh sách sản phẩm.

### Giải thích
- **State**: Sử dụng `useState` để quản lý `page` cho việc phân trang (mặc dù JSON Server không hỗ trợ phân trang trong ví dụ này, nhưng state vẫn được dùng để minh họa).
- **React Query**: Tải dữ liệu sản phẩm từ API với `useQuery`.
- **Ant Design**: Sử dụng `Table` để hiển thị danh sách và `Button` để thêm tương tác.
- **Conditional Rendering**: Hiển thị `Spin` khi đang tải, thông báo lỗi nếu có, hoặc bảng dữ liệu khi thành công.
- **Rendering List**: Sử dụng `Table` của Ant Design để render danh sách sản phẩm với `rowKey` để tối ưu.

## Tài nguyên bổ sung
- [Tài liệu React](https://react.dev/)
- [Tài liệu Ant Design](https://ant.design/)
- [Tài liệu React Query](https://tanstack.com/query/)
- [Tài liệu JSON Server](https://github.com/typicode/json-server)

Chúc bạn tiếp tục hành trình học React!