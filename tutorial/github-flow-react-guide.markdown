# Hướng dẫn GitHub Flow cho dự án React + AntD + React Query + JSON Server (Website bán hàng)

Dưới đây là hướng dẫn sử dụng **GitHub Flow** cho hai người làm việc trên dự án **React + Ant Design (AntD) + React Query + JSON Server** để phát triển một website bán hàng. GitHub Flow là một quy trình quản lý branch đơn giản, phù hợp cho nhóm nhỏ và dự án có vòng đời phát triển nhanh. Hướng dẫn này giả định cả hai người đều đã quen cơ bản với Git và GitHub.

## 1. Tổng quan về GitHub Flow
GitHub Flow là một quy trình quản lý branch nhẹ, tập trung vào:
- **Branch `main`**: Chứa code ổn định, sẵn sàng deploy lên production.
- **Feature branches**: Mỗi tính năng hoặc nhiệm vụ được phát triển trên một branch riêng, tạo từ `main` và hợp nhất trở lại qua **Pull Request (PR)**.
- Quy trình: Tạo branch → Code → Push → Mở PR → Review → Merge → Deploy.

Trong dự án website bán hàng (React + AntD + React Query + JSON Server), hai người sẽ tạo các feature branch cho các tính năng như giao diện danh sách sản phẩm, giỏ hàng, hoặc API giả lập với JSON Server.

## 2. Thiết lập dự án và GitHub Flow

### Bước 1: Khởi tạo repository
1. **Tạo repository trên GitHub**:
   - Một người tạo repository (ví dụ: `ecommerce-website`) và mời người còn lại làm collaborator (thêm qua Settings > Collaborators).
   - Đảm bảo repository có file `.gitignore` phù hợp cho React (bỏ qua `node_modules`, `build`, v.v.).

2. **Clone repository**:
   Cả hai người clone repository về máy:
   ```bash
   git clone https://github.com/username/ecommerce-website.git
   cd ecommerce-website
   ```

3. **Khởi tạo dự án React và JSON Server**:
   - **React (với Vite)**:
     ```bash
     npm create vite@latest frontend -- --template react
     cd frontend
     npm install
     npm install antd @tanstack/react-query axios
     npm run dev
     ```
     - Cài đặt **Ant Design** cho giao diện và **React Query** để quản lý API.
     - Sử dụng `axios` để gọi API từ JSON Server.
   - **JSON Server**:
     ```bash
     npm install -g json-server
     mkdir server
     cd server
     touch db.json
     ```
     Thêm dữ liệu mẫu vào `db.json` (ví dụ: danh sách sản phẩm):
     ```json
     {
       "products": [
         { "id": 1, "name": "Sản phẩm 1", "price": 100 },
         { "id": 2, "name": "Sản phẩm 2", "price": 200 }
       ]
     }
     ```
     Chạy JSON Server:
     ```bash
     json-server --watch db.json --port 3001
     ```

4. **Push mã ban đầu lên `main`**:
   - Thêm file `.gitignore`, commit và push:
     ```bash
     git add .
     git commit -m "Khởi tạo dự án React, AntD, React Query và JSON Server"
     git push origin main
     ```

## 3. Quy trình GitHub Flow

### Bước 2: Phân chia công việc
- **Người 1**: Phát triển giao diện (ví dụ: danh sách sản phẩm, giỏ hàng) bằng React và AntD.
- **Người 2**: Quản lý API giả lập (JSON Server) và tích hợp với frontend bằng React Query.
- Mỗi người tạo một feature branch cho nhiệm vụ của mình.

### Bước 3: Tạo feature branch
- **Người 1** (giao diện danh sách sản phẩm):
  ```bash
  git checkout main
  git pull origin main
  git checkout -b feature/product-list
  ```
  - Code giao diện trong React với AntD (ví dụ: tạo component `ProductList`):
    ```jsx
    import { List, Card } from 'antd';
    import { useQuery } from '@tanstack/react-query';
    import axios from 'axios';

    const ProductList = () => {
      const { data: products } = useQuery({
        queryKey: ['products'],
        queryFn: () => axios.get('http://localhost:3001/products').then(res => res.data),
      });

      return (
        <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={products}
          renderItem={item => (
            <List.Item>
              <Card title={item.name}>{item.price} VNĐ</Card>
            </List.Item>
          )}
        />
      );
    };

    export default ProductList;
    ```
  - Commit thay đổi:
    ```bash
    git add .
    git commit -m "Thêm giao diện danh sách sản phẩm với AntD"
    git push origin feature/product-list
    ```

- **Người 2** (API JSON Server):
  ```bash
  git checkout main
  git pull origin main
  git checkout -b feature/json-server-api
  ```
  - Cập nhật `db.json` với API endpoint (ví dụ: `/products`, `/cart`).
  - Commit thay đổi:
    ```bash
    git add .
    git commit -m "Thêm API sản phẩm và giỏ hàng với JSON Server"
    git push origin feature/json-server-api
    ```

### Bước 4: Mở Pull Request (PR)
1. Truy cập GitHub, vào repository `ecommerce-website`.
2. Chọn branch `feature/product-list` hoặc `feature/json-server-api` và nhấn **Create Pull Request**.
3. Đặt tiêu đề và mô tả rõ ràng (ví dụ: "Thêm danh sách sản phẩm với AntD" hoặc "Cấu hình API JSON Server").
4. Gán người còn lại làm **reviewer** để kiểm tra code.

### Bước 5: Review và merge PR
- Người kia xem PR trên GitHub:
  - Kiểm tra code, chạy thử local nếu cần:
    ```bash
    git checkout feature/product-list
    cd frontend
    npm install
    npm run dev
    ```
  - Góp ý hoặc yêu cầu sửa đổi trong phần comment của PR.
- Nếu OK, nhấn **Merge Pull Request** để hợp nhất branch vào `main`.
- Xóa feature branch sau khi