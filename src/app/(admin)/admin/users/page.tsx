"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAdminUsers, deleteUser } from "@/services/api";

type User = {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
};

export default function AdminUsers() {
  const router = useRouter();
  // Ví dụ check quyền trong trang AdminUsers
  useEffect(() => {
    const userStr = localStorage.getItem("adminUser");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.role !== "admin") {
        alert("Bạn không có quyền truy cập trang này!");
        router.push("/admin"); // Đá về Dashboard
      }
    }
  }, []);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const data = await getAdminUsers();
      setUsers(data);
    } catch (error) {
      console.error("Lỗi tải users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (
      confirm(
        "Bạn có chắc chắn muốn xóa tài khoản này? Hành động này không thể hoàn tác!"
      )
    ) {
      try {
        await deleteUser(id);
        fetchData();
        alert("Đã xóa thành công!");
      } catch (error) {
        alert("Lỗi khi xóa tài khoản");
      }
    }
  };

  if (loading)
    return <div className="p-8 text-center">Đang tải dữ liệu...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản Lý Tài Khoản</h1>
        <Link
          href="/admin/users/create"
          className="bg-[#f97316] text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-600 transition flex items-center gap-2"
        >
          <i className="fas fa-user-plus"></i> Thêm Tài Khoản
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 w-16">ID</th>
              <th className="px-6 py-3">Tên đăng nhập</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Vai trò</th>
              <th className="px-6 py-3">Ngày tạo</th>
              <th className="px-6 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="bg-white border-b hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4">{user.id}</td>
                  <td className="px-6 py-4 font-bold text-gray-800">
                    {user.username}
                  </td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    {user.role === "admin" ? (
                      <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-0.5 rounded">
                        Quản trị viên
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-800 text-xs font-bold px-2.5 py-0.5 rounded">
                        Biên tập viên
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(user.created_at).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-3">
                      <Link
                        href={`/admin/users/edit/${user.id}`}
                        className="text-blue-600 hover:text-blue-900"
                        title="Sửa"
                      >
                        <i className="fas fa-edit"></i>
                      </Link>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Xóa"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Chưa có tài khoản nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
