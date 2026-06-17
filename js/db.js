  /**
   * ============================================================
   *  db.js — Database Layer (LocalStorage)
   *  Semua operasi baca/tulis data ada di sini.
   *  File ini harus di-load PERTAMA sebelum JS lainnya.
   * ============================================================
   */

  'use strict';

  /* ============================================================
     KONSTANTA KEY LOCALSTORAGE
  ============================================================ */
  const DB_KEY_BAHAN = 'hpp_db_bahan';
  const DB_KEY_HPP   = 'hpp_db_hpp';

  /* ============================================================
     DATABASE OBJECT
  ============================================================ */
  const DB = {

    /* ----------------------------------------------------------
       BAHAN BAKU — CRUD
    ---------------------------------------------------------- */

    /**
     * Ambil semua data bahan baku
     * @returns {Array} array of bahan object
     */
    getBahan() {
      try {
        return JSON.parse(localStorage.getItem(DB_KEY_BAHAN) || '[]');
      } catch (e) {
        console.error('[DB] Gagal parse db_bahan:', e);
        return [];
      }
    },

    /**
     * Simpan seluruh array bahan baku (overwrite)
     * @param {Array} data
     */
    saveBahan(data) {
      try {
        localStorage.setItem(DB_KEY_BAHAN, JSON.stringify(data));
      } catch (e) {
        console.error('[DB] Gagal save db_bahan:', e);
        alert('Penyimpanan gagal. Storage mungkin penuh.');
      }
    },

    /**
     * Tambah satu bahan baku baru
     * @param {Object} item
     */
    addBahan(item) {
      const db = this.getBahan();
      db.push(item);
      this.saveBahan(db);
    },

    /**
     * Update satu bahan baku berdasarkan id
     * @param {string} id
     * @param {Object} updatedItem
     */
    updateBahan(id, updatedItem) {
      const db      = this.getBahan();
      const index   = db.findIndex(x => x.id === id);
      if (index !== -1) {
        db[index] = { ...db[index], ...updatedItem };
        this.saveBahan(db);
        return true;
      }
      return false;
    },

    /**
     * Hapus satu bahan baku berdasarkan id
     * @param {string} id
     */
    deleteBahan(id) {
      this.saveBahan(this.getBahan().filter(x => x.id !== id));
    },

    /**
     * Cari bahan baku berdasarkan id
     * @param {string} id
     * @returns {Object|undefined}
     */
    findBahan(id) {
      return this.getBahan().find(x => x.id === id);
    },

    /**
     * Cari bahan baku berdasarkan nama (case-insensitive)
     * @param {string} nama
     * @returns {Array}
     */
    searchBahan(nama) {
      const q = nama.toLowerCase();
      return this.getBahan().filter(x => x.nama.toLowerCase().includes(q));
    },

    /**
     * Hapus semua bahan baku (untuk mode Replace)
     */
    clearBahan() {
      this.saveBahan([]);
    },

    /**
     * Hitung total jumlah bahan baku
     * @returns {number}
     */
    countBahan() {
      return this.getBahan().length;
    },

    /* ----------------------------------------------------------
       HPP MENU — CRUD
    ---------------------------------------------------------- */

    /**
     * Ambil semua data HPP menu
     * @returns {Array} array of hpp object
     */
    getHPP() {
      try {
        return JSON.parse(localStorage.getItem(DB_KEY_HPP) || '[]');
      } catch (e) {
        console.error('[DB] Gagal parse db_hpp:', e);
        return [];
      }
    },

    /**
     * Simpan seluruh array HPP (overwrite)
     * @param {Array} data
     */
    saveHPP(data) {
      try {
        localStorage.setItem(DB_KEY_HPP, JSON.stringify(data));
      } catch (e) {
        console.error('[DB] Gagal save db_hpp:', e);
        alert('Penyimpanan gagal. Storage mungkin penuh.');
      }
    },

    /**
     * Tambah satu data HPP menu baru
     * @param {Object} item
     */
    addHPP(item) {
      const db = this.getHPP();
      db.push(item);
      this.saveHPP(db);
    },

    /**
     * Update satu data HPP berdasarkan id
     * @param {string} id
     * @param {Object} updatedItem
     */
    updateHPP(id, updatedItem) {
      const db    = this.getHPP();
      const index = db.findIndex(x => x.id === id);
      if (index !== -1) {
        db[index] = { ...db[index], ...updatedItem };
        this.saveHPP(db);
        return true;
      }
      return false;
    },

    /**
     * Hapus satu data HPP berdasarkan id
     * @param {string} id
     */
    deleteHPP(id) {
      this.saveHPP(this.getHPP().filter(x => x.id !== id));
    },

    /**
     * Cari HPP berdasarkan id
     * @param {string} id
     * @returns {Object|undefined}
     */
    findHPP(id) {
      return this.getHPP().find(x => x.id === id);
    },

    /**
     * Cari HPP berdasarkan nama menu (case-insensitive)
     * @param {string} nama
     * @returns {Array}
     */
    searchHPP(nama) {
      const q = nama.toLowerCase();
      return this.getHPP().filter(x => x.nama.toLowerCase().includes(q));
    },

    /**
     * Hapus semua data HPP
     */
    clearHPP() {
      this.saveHPP([]);
    },

    /**
     * Hitung total jumlah menu HPP
     * @returns {number}
     */
    countHPP() {
      return this.getHPP().length;
    },

    /* ----------------------------------------------------------
       STATISTIK
    ---------------------------------------------------------- */

    /**
     * Hitung statistik ringkasan HPP
     * @returns {Object} { totalMenu, avgMargin, avgHPP, avgHargaJual }
     */
    getStatsHPP() {
      const db = this.getHPP();
      if (db.length === 0) {
        return { totalMenu: 0, avgMargin: 0, avgHPP: 0, avgHargaJual: 0 };
      }
      const totalMenu    = db.length;
      const avgMargin    = db.reduce((s, x) => s + parseFloat(x.marginPct  || 0), 0) / totalMenu;
      const avgHPP       = db.reduce((s, x) => s + parseFloat(x.hppTotal   || 0), 0) / totalMenu;
      const avgHargaJual = db.reduce((s, x) => s + parseFloat(x.hargaJual  || 0), 0) / totalMenu;
      return { totalMenu, avgMargin, avgHPP, avgHargaJual };
    },

    /* ----------------------------------------------------------
       BACKUP & RESTORE
    ---------------------------------------------------------- */

    /**
     * Export semua data sebagai JSON string (untuk backup)
     * @returns {string} JSON string
     */
    exportAll() {
      return JSON.stringify({
        bahan : this.getBahan(),
        hpp   : this.getHPP(),
        exportedAt: new Date().toISOString(),
        version: '1.0'
      }, null, 2);
    },

    /**
     * Import data dari JSON string (restore backup)
     * @param {string} jsonString
     * @returns {boolean} sukses atau tidak
     */
    importAll(jsonString) {
      try {
        const parsed = JSON.parse(jsonString);
        if (parsed.bahan) this.saveBahan(parsed.bahan);
        if (parsed.hpp)   this.saveHPP(parsed.hpp);
        return true;
      } catch (e) {
        console.error('[DB] Gagal import data:', e);
        return false;
      }
    },

    /**
     * Hapus SEMUA data (reset total)
     */
    resetAll() {
      this.clearBahan();
      this.clearHPP();
    },

    /* ----------------------------------------------------------
       INFO STORAGE
    ---------------------------------------------------------- */

    /**
     * Cek estimasi ukuran data yang tersimpan
     * @returns {string} ukuran dalam KB
     */
    getStorageSize() {
      const bahanSize = (localStorage.getItem(DB_KEY_BAHAN) || '').length;
      const hppSize   = (localStorage.getItem(DB_KEY_HPP)   || '').length;
      const totalKB   = ((bahanSize + hppSize) / 1024).toFixed(2);
      return `${totalKB} KB`;
    },
  };

  /* ============================================================
     UTILITY FUNCTIONS
     (dipakai oleh semua file JS lainnya)
  ============================================================ */

  /**
   * Format angka ke format Rupiah
   * @param {number} n
   * @returns {string} "Rp 12.000"
   */
  function rupiah(n) {
    return 'Rp ' + Number(n || 0).toLocaleString('id-ID');
  }

  /**
   * Format angka ke Rupiah tanpa prefix "Rp "
   * @param {number} n
   * @returns {string} "12.000"
   */
  function rupiahNum(n) {
    return Number(n || 0).toLocaleString('id-ID');
  }

  /**
   * Ambil tanggal hari ini dalam format Indonesia
   * @returns {string} "17 Jun 2026"
   */
  function tglSekarang() {
    return new Date().toLocaleDateString('id-ID', {
      day  : '2-digit',
      month: 'short',
      year : 'numeric'
    });
  }

  /**
   * Generate unique ID
   * @returns {string}
   */
  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Tampilkan alert notifikasi di elemen tertentu
   * @param {string} elId   - id elemen alert
   * @param {string} msg    - pesan yang ditampilkan
   * @param {string} type   - 'success' | 'error' | 'info'
   * @param {number} duration - durasi tampil dalam ms (default 4000)
   */
  function showAlert(elId, msg, type = 'success', duration = 4000) {
    const el = document.getElementById(elId);
    if (!el) return;
    el.className      = `alert alert-${type}`;
    el.textContent    = msg;
    el.style.display  = 'block';
    // Batalkan timer sebelumnya jika ada
    if (el._alertTimer) clearTimeout(el._alertTimer);
    el._alertTimer = setTimeout(() => {
      el.style.display = 'none';
    }, duration);
  }

  /**
   * Bulatkan angka ke N desimal
   * @param {number} num
   * @param {number} decimal
   * @returns {number}
   */
  function roundTo(num, decimal = 2) {
    return Math.round(num * Math.pow(10, decimal)) / Math.pow(10, decimal);
  }

  /**
   * Validasi apakah string kosong atau hanya spasi
   * @param {string} str
   * @returns {boolean}
   */
  function isEmpty(str) {
    return !str || String(str).trim() === '';
  }

  /**
   * Hitung harga per satuan pakai dari data pembelian
   * @param {number} jumlahBeli  - jumlah yang dibeli
   * @param {number} hargaBeli   - total harga beli
   * @param {number} konversi    - 1 satuan beli = N satuan pakai
   * @returns {number} harga per satuan pakai
   */
  function kalkulasiHargaPerPakai(jumlahBeli, hargaBeli, konversi) {
    if (!jumlahBeli || !hargaBeli || !konversi) return 0;
    return (hargaBeli / jumlahBeli) / konversi;
  }

  /* ============================================================
     INIT — Cek & log status DB saat halaman pertama load
  ============================================================ */
  (function initDB() {
    const bCount = DB.countBahan();
    const hCount = DB.countHPP();
    const size   = DB.getStorageSize();
    console.log(
      `[DB] Initialized — Bahan: ${bCount} item | HPP: ${hCount} item | Storage: ${size}`
    );
  })();
