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
  bpjs?: number[];
  posisi?: number;
  cuti_pertahun?: number;
  jenis_kontrak?: number;
  minim_jam?: number;
  catatan?: string;
  pendapatans?: Pendapatan[];
  potongans?: Potongan[];
}

interface ContractResponse {
  user_id: number;
  kontraks: Kontrak[];
}
