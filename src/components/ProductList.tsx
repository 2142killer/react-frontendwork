import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Table, Button, Alert } from "antd";
import axios from "axios";

// Định nghĩa interface cho sản phẩm
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

// Hàm gọi API để lấy danh sách sản phẩm
const fetchProducts = async (): Promise<Product[]> => {
  const { data } = await axios.get("http://localhost:3001/products");
  return data;
};

const ProductList: React.FC = () => {
  // Sử dụng useQuery để lấy dữ liệu
  const {
    data: products,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products"], // Khóa duy nhất cho truy vấn
    queryFn: fetchProducts, // Hàm lấy dữ liệu
  });
  const convertNumberToWords = (number: number): string => {
  const ChuSo = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
  const DonVi = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ"];

  if (number === 0) return "Không đồng";

  function docSo3ChuSo(num: number): string {
    const tram = Math.floor(num / 100);
    const chuc = Math.floor((num % 100) / 10);
    const donvi = num % 10;
    let str = "";

    if (tram !== 0) {
      str += ChuSo[tram] + " trăm";
      if (chuc === 0 && donvi !== 0) str += " linh";
    }

    if (chuc !== 0 && chuc !== 1) {
      str += " " + ChuSo[chuc] + " mươi";
      if (donvi === 1) str += " mốt";
      else if (donvi === 5) str += " lăm";
      else if (donvi !== 0) str += " " + ChuSo[donvi];
    } else if (chuc === 1) {
      str += " mười";
      if (donvi === 1) str += " một";
      else if (donvi === 5) str += " lăm";
      else if (donvi !== 0) str += " " + ChuSo[donvi];
    } else if (chuc === 0 && donvi !== 0) {
      str += " " + ChuSo[donvi];
    }

    return str.trim();
  }

  const parts: string[] = [];
  let unitIndex = 0;

  while (number > 0) {
    const part = number % 1000;
    if (part !== 0) {
      const partStr = docSo3ChuSo(part);
      parts.unshift(partStr + " " + DonVi[unitIndex]);
    }
    number = Math.floor(number / 1000);
    unitIndex++;
  }

  const result = parts.join(" ").replace(/\s+/g, " ").trim();
  return result.charAt(0).toUpperCase() + result.slice(1) + " đồng";
};


  // Cấu hình cột cho bảng AntD
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      // sorter: (a: Product, b: Product) => a.id - b.id, // Sắp xếp theo ID
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      // sorter: (a: Product, b: Product) => a.name.localeCompare(b.name), // Sắp xếp theo tên
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      sorter: (a: Product, b: Product) => a.price - b.price, // Sắp xếp theo giá
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title:"Hình ảnh",
      dataIndex: "image",
      key:"image",
       render: (image: string) => {
      return <img src={image} alt="product" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
       }
    },
    {
      title: "Giá bằng chữ",
      key: "priceText",
      render: (_: any, record: Product) => convertNumberToWords(record.price)
    }

  ];

  // Xử lý lỗi
  if (error) {
    return (
      <Alert
        message="Lỗi"
        description="Không thể tải dữ liệu. Vui lòng thử lại!"
        type="error"
        showIcon
      />
    );
  }

  return (
    <div>
      <h2>Danh sách sản phẩm</h2>
      <Button
        type="primary"
        onClick={() => refetch()}
        style={{ marginBottom: 16 }}
        disabled={isLoading}
      >
        Làm mới dữ liệu
      </Button>
      <Table
        dataSource={products}
        columns={columns}
        rowKey="id"
        loading={isLoading} // Hiển thị spinner khi đang tải
        pagination={{ pageSize: 5 }} // Phân trang, mỗi trang 5 bản ghi
      />
    </div>
  );
};

export default ProductList;