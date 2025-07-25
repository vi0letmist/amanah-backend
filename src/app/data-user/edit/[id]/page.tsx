"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useUsersStore } from "@/store/users";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";

import ContractCard, { ContractCardRef } from "./Contract";

import { ChevronDown } from "lucide-react";

type UserFormValues = {
  name: string;
  email: string;
  username: string;
  phone: string;
  gender: string;
  tempat_lahir?: string;
  tanggal_lahir?: string;
  bank?: string;
  no_rekening?: string;
  status?: string;
  alamat?: string;
};

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  username: yup.string().required("Username is required"),
  phone: yup.string().required("Phone is required"),
  gender: yup.string().required("Gender is required"),
});

const DataUserCreate = () => {
  const params = useParams();
  const userId = params?.id as string;
  const contractCardRef = useRef<ContractCardRef>(null);
  const router = useRouter();
  const { getUserById, userData, loading, update } = useUsersStore();

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      phone: "",
      gender: "",
      tempat_lahir: "",
      tanggal_lahir: "",
      bank: "",
      no_rekening: "",
      status: "",
      alamat: "",
    },
  });

  const onSubmit = async (data: UserFormValues) => {
    if (!date) {
      setErrorMessage("Tanggal Lahir harus diisi");
      return;
    }

    const payload = {
      ...data,
      tanggal_lahir: date.toISOString().split("T")[0],
    };

    try {
      setErrorMessage(null);

      if (contractCardRef.current) {
        await contractCardRef.current.submitContracts();
      }

      await update(userId, payload);

      router.push("/data-user?success=update");
    } catch (e: any) {
      setErrorMessage(e.message || "Failed to submit user.");
    }
  };

  const goBack = () => {
    router.push(`/data-user`);
  };

  useEffect(() => {
    if (userId) {
      getUserById(userId);
    }
  }, [userId]);

  useEffect(() => {
    if (userData) {
      reset(userData);
      if (userData.tanggal_lahir) {
        setDate(new Date(userData.tanggal_lahir));
      }
    }
  }, [userData, reset]);
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">{`Data User ${userData?.name}`}</h3>
      </div>

      {errorMessage && (
        <div className="bg-red-100 text-red-700 border border-red-300 p-3 rounded my-4">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-4">
          <Card className="w-full mt-6 mb-2 flex-[7]">
            <CardHeader className="border-b">
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2 md:col-span-1">
                  <div className="py-1 flex flex-row gap-6">
                    <Label className="w-1/4" htmlFor="name">
                      Name <span className="text-red-500">*</span>
                    </Label>
                    <Input {...register("name")} placeholder="Name" />
                  </div>
                  <div className="py-1 flex flex-row gap-6">
                    <Label className="w-1/4" htmlFor="email">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="email"
                      {...register("email")}
                      placeholder="Email"
                    />
                  </div>
                  <div className="py-1 flex flex-row gap-6">
                    <Label className="w-1/4" htmlFor="username">
                      Username <span className="text-red-500">*</span>
                    </Label>
                    <Input {...register("username")} placeholder="Username" />
                  </div>
                  <div className="py-1 flex flex-row gap-6">
                    <Label className="w-1/4" htmlFor="phone">
                      Phone <span className="text-red-500">*</span>
                    </Label>
                    <Input {...register("phone")} placeholder="Phone" />
                  </div>
                  <div className="py-1 flex flex-row gap-6">
                    <Label className="w-1/4" htmlFor="gender">
                      Gender <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      control={control}
                      name="gender"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Gender</SelectLabel>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.gender && (
                      <p className="text-sm text-red-500">
                        {errors.gender.message}
                      </p>
                    )}
                  </div>
                  <div className="py-1 flex flex-row gap-6">
                    <Label className="w-1/4" htmlFor="tempat_lahir">
                      Tempat Lahir
                    </Label>
                    <Input
                      {...register("tempat_lahir")}
                      placeholder="Tempat Lahir"
                    />
                  </div>
                  <div className="py-1 flex flex-row">
                    <Label className="w-1/4" htmlFor="tanggal_lahir">
                      Tanggal Lahir
                    </Label>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outlineInput"
                          id="date"
                          className="w-full flex-1 justify-between"
                        >
                          {" "}
                          {date ? date.toLocaleDateString() : "Select date"}
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />{" "}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={date}
                          captionLayout="dropdown"
                          onSelect={(date) => {
                            setDate(date);
                            setOpen(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <div className="py-1 flex flex-row gap-6">
                    <Label className="w-1/4" htmlFor="bank">
                      Bank
                    </Label>
                    <Controller
                      control={control}
                      name="bank"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih Bank" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Bank</SelectLabel>
                              <SelectItem value="BRI">BRI</SelectItem>
                              <SelectItem value="BCA">BCA</SelectItem>
                              <SelectItem value="BNI">BNI</SelectItem>
                              <SelectItem value="Mandiri">Mandiri</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="py-1 flex flex-row gap-6">
                    <Label className="w-1/4" htmlFor="no_rekening">
                      No. Rekening
                    </Label>
                    <Input
                      {...register("no_rekening")}
                      placeholder="No. Rekening"
                    />
                  </div>
                  <div className="py-1 flex flex-row gap-6">
                    <Label className="w-1/4" htmlFor="status">
                      Status
                    </Label>
                    <Controller
                      control={control}
                      name="status"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Status</SelectLabel>
                              <SelectItem value="Married">Married</SelectItem>
                              <SelectItem value="Single">Single</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="py-1 flex flex-row gap-6">
                    <Label className="w-1/4" htmlFor="alamat">
                      Alamat
                    </Label>
                    <Textarea {...register("alamat")} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full mt-6 mb-2 flex-[1]">
            <CardHeader className="border-b">
              <CardTitle>Action</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col item-center justify-end gap-4">
                <Button type="submit">Save</Button>
                <Button type="button" variant={"secondary"} onClick={goBack}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <ContractCard id={userId} ref={contractCardRef} />
      </form>
    </div>
  );
};

export default DataUserCreate;
