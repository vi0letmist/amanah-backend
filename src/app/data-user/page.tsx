"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil } from "lucide-react";

import { useUsersStore } from "@/store/users";

const DataUser = () => {
  const router = useRouter();
  const { userList, getUsers } = useUsersStore();
  const searchParams = useSearchParams();
  const [successMessage, setSuccessMessage] = useState("");

  const toCreate = () => {
    router.push(`/data-user/create`);
  };

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    const success = searchParams.get("success");

    if (success === "create") {
      setSuccessMessage("User successfully created!");
    } else if (success === "update") {
      setSuccessMessage("User successfully updated!");
    }

    const timer = setTimeout(() => {
      setSuccessMessage("");

      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.delete("success");

      const newSearch = current.toString();
      router.replace(
        `${window.location.pathname}${newSearch ? `?${newSearch}` : ""}`
      );
    }, 3000);

    return () => clearTimeout(timer);
  }, [searchParams, router]);
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Data User</h3>
        <Button onClick={toCreate}>Add New</Button>
      </div>

      {successMessage && (
        <div className="bg-green-100 text-green-700 border border-green-300 p-3 rounded my-4 transition-opacity duration-500">
          {successMessage}
        </div>
      )}

      <div className="my-6">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>List User</CardTitle>
          </CardHeader>
          <CardContent>
            <Table className="min-w-full border border-gray-200 rounded-lg">
              <TableHeader>
                <TableRow className="bg-gray-50 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  <TableHead className="py-3 px-4 border-b border-gray-200">
                    No
                  </TableHead>
                  <TableHead className="py-3 px-4 border-b border-gray-200">
                    Name
                  </TableHead>
                  <TableHead className="py-3 px-4 border-b border-gray-200">
                    Email
                  </TableHead>
                  <TableHead className="py-3 px-4 border-b border-gray-200">
                    Username
                  </TableHead>
                  <TableHead className="py-3 px-4 border-b border-gray-200">
                    Phone
                  </TableHead>
                  <TableHead className="py-3 px-4 border-b border-gray-200 text-center">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userList?.map((user) => (
                  <TableRow
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="py-3 px-4 whitespace-nowrap">
                      {user.id}
                    </TableCell>
                    <TableCell className="py-3 px-4 whitespace-nowrap">
                      {user.name}
                    </TableCell>
                    <TableCell className="py-3 px-4 whitespace-nowrap">
                      {user.email}
                    </TableCell>
                    <TableCell className="py-3 px-4 whitespace-nowrap">
                      {user.username}
                    </TableCell>
                    <TableCell className="py-3 px-4 whitespace-nowrap">
                      {user.phone}
                    </TableCell>
                    <TableCell className="py-3 px-4 whitespace-nowrap text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-600 hover:text-blue-500"
                        onClick={() =>
                          router.push(`/data-user/edit/${user.id}`)
                        }
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataUser;
