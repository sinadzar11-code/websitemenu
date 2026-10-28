/**
 * DAPUR RASA NUSANTARA - JAVASCRIPT LOGIC
 * Interaktivitas Navigasi, Filter Menu, Modal Pesanan, & Formulir Reservasi
 */

// State Variabel Modal Pesanan
let currentProduct = {
  name: '',
  price: 0,
  qty: 1,
  img: ''
};

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMenuFilter();
  initReservationForm();
  initScrollSpy();
});

/* ==========================================================================
   1. NAVBAR & MOBILE DRAWER LOGIC
   ========================================================================== */
function initNavbar() {
  const header = document.getElementById('site-header');
  const toggleBtn = document.getElementById('mobile-toggle-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky Header Effect saat di-scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Toggle Menu Mobile
  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.toggle('open');
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        if (isOpen) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-xmark');
        } else {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });

    // Menutup menu saat klik sembarang di luar menu
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        const icon = toggleBtn.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });

    // Menutup menu saat salah satu link navigasi ditekan
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          const icon = toggleBtn.querySelector('i');
          if (icon) {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
          }
        }
      });
    });
  }
}

/* ==========================================================================
   2. SCROLLSPY (INDIKATOR LINK AKTIF SAAT SCROLL)
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* ==========================================================================
   3. FILTER MENU KATEGORI (SEMUA / MAKANAN / MINUMAN)
   ========================================================================== */
function initMenuFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuCards = document.querySelectorAll('.menu-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Ubah button aktif
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      menuCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   4. MODAL PESAN MENU INTERAKTIF
   ========================================================================== */
function openOrderModal(name, price, img) {
  currentProduct = {
    name: name,
    price: price,
    qty: 1,
    img: img
  };

  const modal = document.getElementById('orderModal');
  const modalName = document.getElementById('modalProductName');
  const modalPrice = document.getElementById('modalProductPrice');
  const modalImg = document.getElementById('modalProductImg');
  const qtyInput = document.getElementById('modalQtyInput');
  const totalPrice = document.getElementById('modalTotalPrice');

  if (modalName) modalName.textContent = name;
  if (modalPrice) modalPrice.textContent = formatRupiah(price);
  if (modalImg) modalImg.src = img;
  if (qtyInput) qtyInput.value = 1;
  if (totalPrice) totalPrice.textContent = formatRupiah(price);

  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Kunci scroll halaman
  }
}

function closeOrderModal() {
  const modal = document.getElementById('orderModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Kembalikan scroll
  }
}

// Tutup modal jika user klik di luar kotak modal
window.addEventListener('click', (e) => {
  const modal = document.getElementById('orderModal');
  if (e.target === modal) {
    closeOrderModal();
  }
});

function changeModalQty(change) {
  const qtyInput = document.getElementById('modalQtyInput');
  const totalPrice = document.getElementById('modalTotalPrice');

  let newQty = currentProduct.qty + change;
  if (newQty < 1) newQty = 1;
  if (newQty > 50) newQty = 50;

  currentProduct.qty = newQty;
  if (qtyInput) qtyInput.value = newQty;

  const total = currentProduct.price * newQty;
  if (totalPrice) totalPrice.textContent = formatRupiah(total);
}

function sendOrderViaWhatsApp() {
  const total = currentProduct.price * currentProduct.qty;
  const message = `Halo Dapur Rasa Nusantara, saya ingin memesan:\n` +
                  `- Menu: *${currentProduct.name}*\n` +
                  `- Jumlah: *${currentProduct.qty} porsi*\n` +
                  `- Total: *${formatRupiah(total)}*\n\n` +
                  `Mohon informasikan proses pemesanan & pembayarannya. Terima kasih!`;

  const waUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;
  
  closeOrderModal();
  showToast(`Pesanan ${currentProduct.name} sedang dialihkan ke WhatsApp...`);

  // Buka WhatsApp di tab baru
  setTimeout(() => {
    window.open(waUrl, '_blank');
  }, 600);
}

/* ==========================================================================
   5. FORMULIR RESERVASI MEJA
   ========================================================================== */
function initReservationForm() {
  const form = document.getElementById('reservation-form');

  if (form) {
    // Set minimal tanggal kunjungan hari ini
    const dateInput = document.getElementById('res-date');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
      dateInput.value = today;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('res-name').value.trim();
      const phone = document.getElementById('res-phone').value.trim();
      const date = document.getElementById('res-date').value;
      const time = document.getElementById('res-time').value;
      const guests = document.getElementById('res-guests').value;
      const menuPick = document.getElementById('res-menu-pick').value;

      if (!name || !phone || !date || !time || !guests) {
        showToast('Mohon lengkapi seluruh kolom yang wajib diisi (*)!');
        return;
      }

      // Simulasi pengiriman reservasi berhasil
      showToast(`Terima kasih Bapak/Ibu ${name}! Reservasi untuk ${guests} pada ${date} pukul ${time} WIB berhasil dikirim. Tim kami akan menghubungi via WhatsApp.`);
      
      form.reset();
      if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
      }
    });
  }
}

/* ==========================================================================
   6. HELPER FUNCTIONS
   ========================================================================== */
function formatRupiah(number) {
  return 'Rp ' + Number(number).toLocaleString('id-ID');
}

function showToast(message) {
  const toast = document.getElementById('toastMsg');
  const toastText = document.getElementById('toastText');

  if (toast && toastText) {
    toastText.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }
}
