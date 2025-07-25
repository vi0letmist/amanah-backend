import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useContractStore } from "@/store/contract";
import { format, parseISO, isValid, parse } from "date-fns";
import { formatRupiah } from "@/utils/formatCurrency";

import {
  Card,
  CardContent,
  CardHeader,
  CardAction,
  CardTitle,
} from "@/components/ui/card";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ChevronDown, Plus, Trash } from "lucide-react";

interface Pendapatan {
  nama_pendapatan: number;
  tipe_pendapatan: number;
  nominal: number;
}

interface Potongan {
  nama_potongan: number;
  tipe_potongan: number;
  nominal: number;
}

interface Kontrak {
  masa_berlaku_start: string;
  masa_berlaku_end: string;
  golongan_pajak: number;
  bpjs: number[];
  posisi: number;
  cuti_pertahun: number;
  jenis_kontrak: number;
  minim_jam: number;
  catatan: string;
  pendapatans: Pendapatan[];
  potongans: Potongan[];
}
export interface ContractCardRef {
  submitContracts: () => Promise<void>;
}

interface ContractProps {
  id: string;
  initialContractsData?: Kontrak[];
  onSave?: (contractsData: Kontrak[]) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

const emptyContract: Kontrak = {
  masa_berlaku_start: "",
  masa_berlaku_end: "",
  golongan_pajak: 0,
  bpjs: [],
  posisi: 0,
  cuti_pertahun: 0,
  jenis_kontrak: 0,
  minim_jam: 0,
  catatan: "",
  pendapatans: [],
  potongans: [],
};

const emptyPendapatan: Pendapatan = {
  nama_pendapatan: 0,
  tipe_pendapatan: 0,
  nominal: 0,
};

const emptyPotongan: Potongan = {
  nama_potongan: 0,
  tipe_potongan: 0,
  nominal: 0,
};

const Contract = forwardRef<ContractCardRef, ContractProps>(
  ({ id, onSave, onCancel, isLoading: externalLoading }, ref) => {
    const [kontraks, setKontraks] = useState<Kontrak[]>([]);
    const [openMasaBerlakuStart, setOpenMasaBerlakuStart] = useState<
      Record<number, boolean>
    >({});
    const [openMasaBerlakuEnd, setOpenMasaBerlakuEnd] = useState<
      Record<number, boolean>
    >({});
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
      selectedContract,
      getContractByUserId,
      createContract,
      updateContract,
      clearSelectedContract,
      loading: storeLoading,
      error: storeError,
    } = useContractStore();

    useEffect(() => {
      if (id) {
        getContractByUserId(Number(id));
      }

      return () => {
        clearSelectedContract();
        setKontraks([{ ...emptyContract }]);
      };
    }, [id, getContractByUserId]);

    useEffect(() => {
      if (selectedContract && selectedContract.kontraks) {
        const contractsWithGuaranteedTypes = selectedContract.kontraks.map(
          (k) => {
            const parsedStart = k.masa_berlaku_start
              ? parse(k.masa_berlaku_start, "dd/MM/yyyy", new Date())
              : null;
            const safeMasaBerlakuStart =
              parsedStart && isValid(parsedStart)
                ? format(parsedStart, "yyyy-MM-dd")
                : "";

            const parsedEnd = k.masa_berlaku_end
              ? parse(k.masa_berlaku_end, "dd/MM/yyyy", new Date())
              : null;
            const safeMasaBerlakuEnd =
              parsedEnd && isValid(parsedEnd)
                ? format(parsedEnd, "yyyy-MM-dd")
                : "";

            return {
              masa_berlaku_start: safeMasaBerlakuStart,
              masa_berlaku_end: safeMasaBerlakuEnd,
              golongan_pajak: k.golongan_pajak || 0,
              bpjs: k.bpjs || [],
              posisi: k.posisi || 0,
              cuti_pertahun: k.cuti_pertahun || 0,
              jenis_kontrak: k.jenis_kontrak || 0,
              minim_jam: k.minim_jam || 0,
              catatan: k.catatan || "",
              pendapatans: k.pendapatans || [],
              potongans: k.potongans || [],
            };
          }
        );
        setKontraks(contractsWithGuaranteedTypes);
      } else {
        setKontraks([]);
      }
    }, [selectedContract]);

    const handleContractChange = (
      index: number,
      field: keyof Kontrak,
      value: any
    ) => {
      setKontraks((prevKontraks) =>
        prevKontraks.map((kontrak, i) =>
          i === index ? { ...kontrak, [field]: value } : kontrak
        )
      );
    };

    const handlePendapatanChange = (
      kontrakIndex: number,
      pendapatanIndex: number,
      field: keyof Pendapatan,
      value: any
    ) => {
      setKontraks((prevKontraks) =>
        prevKontraks.map((kontrak, kIdx) =>
          kIdx === kontrakIndex
            ? {
                ...kontrak,
                pendapatans: (kontrak.pendapatans || []).map(
                  (pendapatan, pIdx) =>
                    pIdx === pendapatanIndex
                      ? { ...pendapatan, [field]: value }
                      : pendapatan
                ),
              }
            : kontrak
        )
      );
    };

    const handlePotonganChange = (
      kontrakIndex: number,
      potonganIndex: number,
      field: keyof Potongan,
      value: any
    ) => {
      setKontraks((prevKontraks) =>
        prevKontraks.map((kontrak, kIdx) =>
          kIdx === kontrakIndex
            ? {
                ...kontrak,
                potongans: (kontrak.potongans || []).map((potongan, pIdx) =>
                  pIdx === potonganIndex
                    ? { ...potongan, [field]: value }
                    : potongan
                ),
              }
            : kontrak
        )
      );
    };

    const addContract = () => {
      setKontraks((prevKontraks) => [...prevKontraks, { ...emptyContract }]);
    };

    const removeContract = (index: number) => {
      setKontraks((prevKontraks) => prevKontraks.filter((_, i) => i !== index));
    };

    const addPendapatan = (kontrakIndex: number) => {
      setKontraks((prevKontraks) =>
        prevKontraks.map((kontrak, i) =>
          i === kontrakIndex
            ? {
                ...kontrak,
                pendapatans: [
                  ...(kontrak.pendapatans || []),
                  { ...emptyPendapatan },
                ],
              }
            : kontrak
        )
      );
    };

    const removePendapatan = (
      kontrakIndex: number,
      pendapatanIndex: number
    ) => {
      setKontraks((prevKontraks) =>
        prevKontraks.map((kontrak, i) =>
          i === kontrakIndex
            ? {
                ...kontrak,
                pendapatans: (kontrak.pendapatans || []).filter(
                  (_, pIdx) => pIdx !== pendapatanIndex
                ),
              }
            : kontrak
        )
      );
    };

    const addPotongan = (kontrakIndex: number) => {
      setKontraks((prevKontraks) =>
        prevKontraks.map((kontrak, i) =>
          i === kontrakIndex
            ? {
                ...kontrak,
                potongans: [...(kontrak.potongans || []), { ...emptyPotongan }],
              }
            : kontrak
        )
      );
    };

    const removePotongan = (kontrakIndex: number, potonganIndex: number) => {
      setKontraks((prevKontraks) =>
        prevKontraks.map((kontrak, i) =>
          i === kontrakIndex
            ? {
                ...kontrak,
                potongans: (kontrak.potongans || []).filter(
                  (_, pIdx) => pIdx !== potonganIndex
                ),
              }
            : kontrak
        )
      );
    };

    const submitContracts = async () => {
      setErrorMessage(null);
      setIsSubmitting(true);

      if (kontraks.length === 0) {
        setErrorMessage("At least one contract is required.");
        setIsSubmitting(false);
        throw new Error("At least one contract is required.");
      }

      const isValidForm = kontraks.every((kontrak, index) => {
        if (
          !kontrak.masa_berlaku_start ||
          !kontrak.masa_berlaku_end ||
          kontrak.golongan_pajak === undefined
        ) {
          setErrorMessage(
            `Please fill in all required fields for Contract #${index + 1}.`
          );
          return false;
        }
        return true;
      });

      if (!isValidForm) {
        setIsSubmitting(false);
        throw new Error("Contract form validation failed.");
      }

      try {
        const userIdNum = Number(id);
        const originalKontraks = selectedContract?.kontraks || [];
        const promises: Promise<void>[] = [];

        const payloadForSave: ContractResponse = {
          user_id: userIdNum,
          kontraks: kontraks.map((k) => ({
            ...k,
            masa_berlaku_start: k.masa_berlaku_start
              ? format(parseISO(k.masa_berlaku_start), "dd/MM/yyyy")
              : "",
            masa_berlaku_end: k.masa_berlaku_end
              ? format(parseISO(k.masa_berlaku_end), "dd/MM/yyyy")
              : "",
          })),
        };

        if (selectedContract && selectedContract.kontraks.length > 0) {
          await updateContract(userIdNum, payloadForSave);
        } else {
          await createContract(payloadForSave);
        }

        await getContractByUserId(userIdNum);

        if (onSave) {
          onSave(kontraks);
        }
        setIsSubmitting(false);
      } catch (e: any) {
        setErrorMessage(e.message || "Failed to save contracts.");
        setIsSubmitting(false);
        throw e;
      }
    };

    useImperativeHandle(ref, () => ({
      submitContracts,
    }));

    const handleFormSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      try {
        await submitContracts();
      } catch (error) {}
    };

    return (
      <div>
        {/* Card Contract */}
        <Card className="w-full my-2 flex-[1]">
          <CardHeader>
            <CardTitle>Kontrak</CardTitle>
            <CardAction>
              <Button type="button" variant="secondary" onClick={addContract}>
                <Plus />
                Tambah
              </Button>
            </CardAction>
          </CardHeader>
          {kontraks.length > 0 && (
            <CardContent className="border-t p-4">
              {kontraks?.map((kontrak, index) => (
                <div className="border-t p-4" key={index}>
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                    <div className="col-span-2 md:col-span-1">
                      <div className="py-2 flex flex-row gap-6">
                        <Label
                          className="w-1/4"
                          htmlFor={`kontraks.${index}.masa_berlaku_start`}
                        >
                          Masa Berlaku <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex flex-row flex-wrap gap-1 w-full overflow-hidden">
                          <div className="flex-1 min-w-0">
                            <Popover
                              open={openMasaBerlakuStart[index]}
                              onOpenChange={(isOpen) =>
                                setOpenMasaBerlakuStart((prev) => ({
                                  ...prev,
                                  [index]: isOpen,
                                }))
                              }
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-between truncate"
                                >
                                  {kontrak.masa_berlaku_start
                                    ? format(
                                        parseISO(kontrak.masa_berlaku_start),
                                        "PPP"
                                      )
                                    : "Select date"}
                                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto overflow-hidden p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={
                                    kontrak.masa_berlaku_start
                                      ? parseISO(kontrak.masa_berlaku_start)
                                      : undefined
                                  }
                                  captionLayout="dropdown"
                                  onSelect={(date) => {
                                    handleContractChange(
                                      index,
                                      "masa_berlaku_start",
                                      date ? format(date, "yyyy-MM-dd") : ""
                                    );
                                    setOpenMasaBerlakuStart((prev) => ({
                                      ...prev,
                                      [index]: false,
                                    }));
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>

                          <Label
                            className="w-fit px-1 flex items-center whitespace-nowrap"
                            htmlFor={`kontraks.${index}.masa_berlaku_end`}
                          >
                            s.d.
                          </Label>

                          <div className="flex-1 min-w-0">
                            <Popover
                              open={openMasaBerlakuEnd[index]}
                              onOpenChange={(isOpen) =>
                                setOpenMasaBerlakuEnd((prev) => ({
                                  ...prev,
                                  [index]: isOpen,
                                }))
                              }
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-between truncate"
                                >
                                  {kontrak.masa_berlaku_end
                                    ? format(
                                        parseISO(kontrak.masa_berlaku_end),
                                        "PPP"
                                      )
                                    : "Select date"}
                                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto overflow-hidden p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={
                                    kontrak.masa_berlaku_end
                                      ? parseISO(kontrak.masa_berlaku_end)
                                      : undefined
                                  }
                                  captionLayout="dropdown"
                                  onSelect={(date) => {
                                    handleContractChange(
                                      index,
                                      "masa_berlaku_end",
                                      date ? format(date, "yyyy-MM-dd") : ""
                                    );
                                    setOpenMasaBerlakuEnd((prev) => ({
                                      ...prev,
                                      [index]: false,
                                    }));
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </div>
                      <div className="py-1 flex flex-row gap-6">
                        <Label
                          className="w-24 break-words"
                          htmlFor="golongan_pajak"
                        >
                          Golongan Pajak <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={String(kontrak.golongan_pajak)}
                          onValueChange={(val) =>
                            handleContractChange(
                              index,
                              "golongan_pajak",
                              Number(val)
                            )
                          }
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Pilih Golongan" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Golongan Pajak</SelectLabel>
                              <SelectItem value="0">Kawin/0</SelectItem>
                              <SelectItem value="1">Tidak Kawin/1</SelectItem>
                              <SelectItem value="2">Tokoh/2</SelectItem>
                              <SelectItem value="3">Golongan 3</SelectItem>
                              <SelectItem value="5">Golongan 5</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="py-2 flex flex-row gap-6">
                        <Label className="w-24" htmlFor="golongan_bpjs">
                          Golongan BPJS
                        </Label>
                        <div className="flex flex-row flex-1 space-x-2 items-center">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={`bpjs-ketenagakerjaan-${index}`}
                              checked={kontrak.bpjs?.includes(1)}
                              onCheckedChange={(checked) => {
                                const currentValues = kontrak.bpjs || [];
                                const newValue = checked
                                  ? [...currentValues, 1]
                                  : currentValues.filter((val) => val !== 1);
                                handleContractChange(index, "bpjs", newValue);
                              }}
                            />
                            <Label
                              htmlFor={`bpjs-ketenagakerjaan-${index}`}
                              className="text-sm font-normal"
                            >
                              Ketenagakerjaan
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={`bpjs-kesehatan-${index}`}
                              checked={kontrak.bpjs?.includes(2)}
                              onCheckedChange={(checked) => {
                                const currentValues = kontrak.bpjs || [];
                                const newValue = checked
                                  ? [...currentValues, 2]
                                  : currentValues.filter((val) => val !== 2);
                                handleContractChange(index, "bpjs", newValue);
                              }}
                            />
                            <Label
                              htmlFor={`bpjs-kesehatan-${index}`}
                              className="text-sm font-normal"
                            >
                              Kesehatan
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={`bpjs-askes-${index}`}
                              checked={kontrak.bpjs?.includes(3)}
                              onCheckedChange={(checked) => {
                                const currentValues = kontrak.bpjs || [];
                                const newValue = checked
                                  ? [...currentValues, 3]
                                  : currentValues.filter((val) => val !== 3);
                                handleContractChange(index, "bpjs", newValue);
                              }}
                            />
                            <Label
                              htmlFor={`bpjs-askes-${index}`}
                              className="text-sm font-normal"
                            >
                              Askes
                            </Label>
                          </div>
                        </div>
                      </div>
                      <div className="py-2 flex flex-row gap-6">
                        <Label className="w-24" htmlFor="posisi">
                          Posisi
                        </Label>
                        <Select
                          value={String(kontrak.posisi)}
                          onValueChange={(val) =>
                            handleContractChange(index, "posisi", Number(val))
                          }
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Pilih Posisi" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Posisi</SelectLabel>
                              <SelectItem value="1">
                                Fullstack Developer
                              </SelectItem>
                              <SelectItem value="2">
                                Frontend Developer
                              </SelectItem>
                              <SelectItem value="3">
                                Backend Developer
                              </SelectItem>
                              <SelectItem value="4">
                                Wordpress Developer
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <div className="py-2 flex flex-row gap-6">
                        <Label className="w-24" htmlFor="cuti_pertahun">
                          Cuti Pertahun
                        </Label>
                        <Select
                          value={String(kontrak.cuti_pertahun)}
                          onValueChange={(val) =>
                            handleContractChange(
                              index,
                              "cuti_pertahun",
                              Number(val)
                            )
                          }
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Pilih Cuti" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Cuti Pertahun</SelectLabel>
                              {[...Array(15)].map((_, i) => (
                                <SelectItem key={i} value={String(i)}>
                                  {i}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="py-2 flex flex-row gap-6">
                        <Label className="w-24" htmlFor="jenis_kontrak">
                          Jenis Kontrak
                        </Label>
                        <Select
                          value={String(kontrak.jenis_kontrak)}
                          onValueChange={(val) =>
                            handleContractChange(
                              index,
                              "jenis_kontrak",
                              Number(val)
                            )
                          }
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Pilih Jenis Kontrak" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Jenis Kontrak</SelectLabel>
                              <SelectItem value="1">Karyawan Tetap</SelectItem>
                              <SelectItem value="2">Probation</SelectItem>
                              <SelectItem value="3">Kontrak</SelectItem>
                              <SelectItem value="4">Magang</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="py-2 flex flex-row gap-6">
                        <Label
                          className="w-24"
                          htmlFor={`kontraks.${index}.minim_jam`}
                        >
                          Minim Jam Perbulan
                        </Label>
                        <Input
                          type="number"
                          id={`kontraks.${index}.minim_jam`}
                          placeholder="Minim Jam Perbulan"
                          className="flex-1"
                          value={kontrak.minim_jam}
                          onChange={(e) =>
                            handleContractChange(
                              index,
                              "minim_jam",
                              Number(e.target.value)
                            )
                          }
                        />
                      </div>
                      <div className="py-2 flex flex-row gap-6">
                        <Label
                          className="w-24"
                          htmlFor={`kontraks.${index}.catatan`}
                        >
                          Catatan
                        </Label>
                        <Textarea
                          id={`kontraks.${index}.catatan`}
                          className="flex-1"
                          value={kontrak.catatan}
                          onChange={(e) =>
                            handleContractChange(
                              index,
                              "catatan",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Card className="w-full my-6">
                    <CardHeader className="border-b">
                      <CardTitle>Pendapatan</CardTitle>
                      <CardAction>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => addPendapatan(index)}
                        >
                          <Plus />
                          Tambah
                        </Button>
                      </CardAction>
                    </CardHeader>
                    <CardContent>
                      <Table className="min-w-full border border-gray-200 rounded-lg">
                        <TableHeader>
                          <TableRow className="bg-gray-50 text-left text-sm font-medium text-gray-600 tracking-wider">
                            <TableHead className="py-3 px-4 border-b border-gray-200">
                              Nama
                            </TableHead>
                            <TableHead className="py-3 px-4 border-b border-gray-200">
                              Tipe
                            </TableHead>
                            <TableHead className="py-3 px-4 border-b border-gray-200">
                              Nominal
                            </TableHead>
                            <TableHead className="py-3 px-4 border-b border-gray-200" />
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {kontrak.pendapatans?.map((item, pendapatanIndex) => (
                            <TableRow
                              key={pendapatanIndex}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <TableCell className="py-3 px-4 whitespace-nowrap">
                                <Select
                                  value={String(item.nama_pendapatan)}
                                  onValueChange={(val) =>
                                    handlePendapatanChange(
                                      index,
                                      pendapatanIndex,
                                      "nama_pendapatan",
                                      Number(val)
                                    )
                                  }
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Nama Pendapatan" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      <SelectLabel>Nama Pendapatan</SelectLabel>
                                      <SelectItem value="1">
                                        Gaji Pokok
                                      </SelectItem>
                                      <SelectItem value="2">
                                        Investasi
                                      </SelectItem>
                                      <SelectItem value="3">Warisan</SelectItem>
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </TableCell>

                              <TableCell className="py-3 px-4 whitespace-nowrap">
                                <Select
                                  value={String(item.tipe_pendapatan)}
                                  onValueChange={(val) =>
                                    handlePendapatanChange(
                                      index,
                                      pendapatanIndex,
                                      "tipe_pendapatan",
                                      Number(val)
                                    )
                                  }
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Tipe Pendapatan" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      <SelectLabel>Tipe Pendapatan</SelectLabel>
                                      <SelectItem value="1">Tipe A</SelectItem>
                                      <SelectItem value="2">Tipe B</SelectItem>
                                      <SelectItem value="3">Tipe C</SelectItem>
                                      <SelectItem value="4">Tipe D</SelectItem>
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </TableCell>

                              <TableCell className="py-3 px-4 whitespace-nowrap">
                                <Input
                                  type="number"
                                  placeholder="Nominal"
                                  value={item.nominal}
                                  onChange={(e) =>
                                    handlePendapatanChange(
                                      index,
                                      pendapatanIndex,
                                      "nominal",
                                      Number(e.target.value)
                                    )
                                  }
                                />
                              </TableCell>

                              <TableCell className="py-3 px-4 whitespace-nowrap text-center">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="border border-red-600"
                                  onClick={() =>
                                    removePendapatan(index, pendapatanIndex)
                                  }
                                >
                                  <Trash className="w-4 h-4 text-red-600" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                        <TableFooter>
                          <TableRow className="bg-gray-50 text-left text-sm font-medium text-gray-600 tracking-wider">
                            <TableHead
                              colSpan={2}
                              className="py-3 px-4 border-b border-gray-200"
                            >
                              Total Pendapatan Kotor
                            </TableHead>
                            <TableHead className="py-3 px-4 border-b border-gray-200">
                              {formatRupiah(
                                (kontrak?.pendapatans || []).reduce(
                                  (sum, item) => sum + (item.nominal || 0),
                                  0
                                )
                              )}
                            </TableHead>
                            <TableHead className="py-3 px-4 border-b border-gray-200" />
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </CardContent>
                  </Card>

                  <Card className="w-full my-6">
                    <CardHeader className="border-b">
                      <CardTitle>Potongan</CardTitle>
                      <CardAction>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => addPotongan(index)}
                        >
                          <Plus />
                          Tambah
                        </Button>
                      </CardAction>
                    </CardHeader>
                    <CardContent>
                      <Table className="min-w-full border border-gray-200 rounded-lg">
                        <TableHeader>
                          <TableRow className="bg-gray-50 text-left text-sm font-medium text-gray-600 tracking-wider">
                            <TableHead className="py-3 px-4 border-b border-gray-200">
                              Nama
                            </TableHead>
                            <TableHead className="py-3 px-4 border-b border-gray-200">
                              Tipe
                            </TableHead>
                            <TableHead className="py-3 px-4 border-b border-gray-200">
                              Nominal
                            </TableHead>
                            <TableHead className="py-3 px-4 border-b border-gray-200" />
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {kontrak.potongans?.map((item, potonganIndex) => (
                            <TableRow
                              key={potonganIndex}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <TableCell className="py-3 px-4 whitespace-nowrap">
                                <Select
                                  value={String(item.nama_potongan)}
                                  onValueChange={(val) =>
                                    handlePotonganChange(
                                      index,
                                      potonganIndex,
                                      "nama_potongan",
                                      Number(val)
                                    )
                                  }
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Nama Potongan" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      <SelectLabel>Nama Potongan</SelectLabel>
                                      <SelectItem value="1">BPJS TK</SelectItem>
                                      <SelectItem value="2">
                                        BPJS Kesehatan
                                      </SelectItem>
                                      <SelectItem value="3">Meal</SelectItem>
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </TableCell>

                              <TableCell className="py-3 px-4 whitespace-nowrap">
                                <Select
                                  value={String(item.tipe_potongan)}
                                  onValueChange={(val) =>
                                    handlePotonganChange(
                                      index,
                                      potonganIndex,
                                      "tipe_potongan",
                                      Number(val)
                                    )
                                  }
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Tipe Potongan" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      <SelectLabel>Tipe Potongan</SelectLabel>
                                      <SelectItem value="1">Tipe A</SelectItem>
                                      <SelectItem value="2">Tipe B</SelectItem>
                                      <SelectItem value="3">Tipe C</SelectItem>
                                      <SelectItem value="4">Tipe D</SelectItem>
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </TableCell>

                              <TableCell className="py-3 px-4 whitespace-nowrap">
                                <Input
                                  type="number"
                                  placeholder="Nominal"
                                  value={item.nominal}
                                  onChange={(e) =>
                                    handlePotonganChange(
                                      index,
                                      potonganIndex,
                                      "nominal",
                                      Number(e.target.value)
                                    )
                                  }
                                />
                              </TableCell>

                              <TableCell className="py-3 px-4 whitespace-nowrap text-center">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="border border-red-600"
                                  onClick={() =>
                                    removePotongan(index, potonganIndex)
                                  }
                                >
                                  <Trash className="w-4 h-4 text-red-600" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                        <TableFooter>
                          <TableRow className="bg-gray-50 text-left text-sm font-medium text-gray-600 tracking-wider">
                            <TableHead
                              colSpan={2}
                              className="py-3 px-4 border-b border-gray-200"
                            >
                              Total Pengurangan
                            </TableHead>
                            <TableHead className="py-3 px-4 border-b border-gray-200">
                              {formatRupiah(
                                (kontrak?.potongans || []).reduce(
                                  (sum, item) => sum + (item.nominal || 0),
                                  0
                                )
                              )}
                            </TableHead>
                            <TableHead className="py-3 px-4 border-b border-gray-200" />
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </CardContent>
                  </Card>

                  <div className="flex items-center justify-end">
                    <Button
                      variant="ghost"
                      className="border border-red-600 text-red-600 hover:text-red-600"
                      onClick={() => removeContract(index)}
                    >
                      <Trash className="w-4 h-4 text-red-600" /> Hapus Kontrak
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          )}
        </Card>
      </div>
    );
  }
);

export default Contract;
