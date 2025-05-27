       // Sample training data with all 31 districts
        const trainingData = [{
            id: 1,
            title: "Pelatihan Kewirausahaan",
            location: "Genteng",
            organization: "UMKM Genteng",
            type: "kewirausahaan",
            icon: "fas fa-chart-line",
            description: "Program pelatihan kewirausahaan untuk mengembangkan usaha mikro dan kecil di wilayah Genteng. Peserta akan belajar tentang manajemen bisnis, pemasaran digital, dan pengelolaan keuangan.",
            schedule: "Setiap Sabtu, 09:00-12:00",
            capacity: 25,
            instructor: "Budi Santoso, S.E.",
            duration: "8 minggu"
        }, {
            id: 2,
            title: "Pelatihan Keahlian Digital",
            location: "Tambaksari",
            organization: "Disnaker Tambaksari",
            type: "keahlian-digital",
            icon: "fas fa-laptop",
            description: "Pelatihan komputer dasar dan digital marketing untuk meningkatkan kemampuan teknologi masyarakat Tambaksari.",
            schedule: "Senin-Rabu, 14:00-16:00",
            capacity: 20,
            instructor: "Sari Dewi, S.Kom.",
            duration: "6 minggu"
        }, {
            id: 3,
            title: "Keterampilan Teknis Otomotif",
            location: "Gubeng",
            organization: "Karang Taruna Gubeng",
            type: "keterampilan-teknis",
            icon: "fas fa-wrench",
            description: "Pelatihan service motor dan mobil untuk pemuda di wilayah Gubeng.",
            schedule: "Kamis-Jumat, 08:00-11:00",
            capacity: 15,
            instructor: "Ahmad Fauzi",
            duration: "10 minggu"
        }, {
            id: 4,
            title: "Pertanian Urban",
            location: "Sukolilo",
            organization: "Komunitas Hijau Sukolilo",
            type: "pertanian-urban",
            icon: "fas fa-seedling",
            description: "Belajar bercocok tanam di lahan terbatas dengan teknik hidroponik dan vertikultur.",
            schedule: "Minggu, 07:00-10:00",
            capacity: 30,
            instructor: "Dr. Rina Sari",
            duration: "4 minggu"
        }, {
            id: 5,
            title: "Kerajinan Tangan",
            location: "Rungkut",
            organization: "UMKM Kreatif Rungkut",
            type: "kerajinan-tangan",
            icon: "fas fa-paint-brush",
            description: "Membuat kerajinan dari bahan daur ulang untuk meningkatkan pendapatan keluarga.",
            schedule: "Selasa-Kamis, 13:00-15:00",
            capacity: 20,
            instructor: "Ibu Siti Aminah",
            duration: "6 minggu"
        }, {
            id: 6,
            title: "Kuliner Tradisional",
            location: "Sawahan",
            organization: "Paguyuban Kuliner Sawahan",
            type: "kuliner",
            icon: "fas fa-utensils",
            description: "Pelatihan memasak makanan tradisional Surabaya untuk usaha kuliner rumahan.",
            schedule: "Sabtu, 15:00-18:00",
            capacity: 18,
            instructor: "Chef Bambang",
            duration: "5 minggu"
        }];

        // Sample mitra data
        const mitraData = [{
            id: 1,
            name: "UMKM Genteng",
            location: "Genteng",
            type: "umkm",
            status: "Aktif",
            icon: "fas fa-store"
        }, {
            id: 2,
            name: "Karang Taruna Tambaksari",
            location: "Tambaksari",
            type: "karang-taruna",
            status: "Aktif",
            icon: "fas fa-users"
        }, {
            id: 3,
            name: "Komunitas Hijau Sukolilo",
            location: "Sukolilo",
            type: "organisasi-sosial",
            status: "Aktif",
            icon: "fas fa-leaf"
        }, {
            id: 4,
            name: "UMKM Kreatif Rungkut",
            location: "Rungkut",
            type: "umkm",
            status: "Aktif",
            icon: "fas fa-palette"
        }];

        let currentPage = 1;
        const itemsPerPage = 4;
        let currentTab = 'pelatihan';
        let filteredData = trainingData;

        // Load partnerships from localStorage
        function loadPartnerships() {
            const partnerships = JSON.parse(localStorage.getItem('partnerships') || '[]');
            return partnerships.filter(p => p.status === 'approved').map(p => ({
                id: p.id,
                name: p.orgName,
                location: p.kecamatan,
                type: p.orgType,
                status: 'Aktif',
                icon: 'fas fa-handshake',
                trainingType: p.trainingType,
                description: p.description,
                schedule: p.schedule,
                capacity: p.capacity,
                instructor: p.contactPerson
            }));
        }

        // Combine static and dynamic data
        function getAllMitra() {
            const staticMitra = mitraData;
            const dynamicMitra = loadPartnerships();
            return [...staticMitra, ...dynamicMitra];
        }

        function renderCards(data, page = 1) {
            const container = currentTab === 'pelatihan' ?
                document.getElementById('trainingCardsContainer') :
                document.getElementById('mitraCardsContainer');

            container.innerHTML = '';

            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const pageData = data.slice(startIndex, endIndex);

            pageData.forEach((item, index) => {
                const card = document.createElement('div');
                card.className = 'col-md-6 mb-3';
                card.style.animationDelay = `${index * 0.1}s`;

                if (currentTab === 'pelatihan') {
                    card.innerHTML = `
                        <div class="training-card" onclick="showTrainingDetail(${item.id})" style="animation: fadeInUp 0.6s ease forwards; opacity: 0;">
                            <div class="card-header">
                                <div>
                                    <div class="card-title">Pelatihan</div>
                                    <div class="card-subtitle">${item.title}</div>
                                    <div class="card-location">
                                        <i class="fas fa-map-marker-alt"></i>
                                        ${item.location}
                                    </div>
                                    <div class="card-organization">
                                        <i class="fas fa-building"></i>
                                        ${item.organization}
                                    </div>
                                </div>
                                <div class="card-icon">
                                    <i class="${item.icon}"></i>
                                </div>
                            </div>
                        </div>
                    `;
                } else {
                    card.innerHTML = `
                        <div class="training-card" style="animation: fadeInUp 0.6s ease forwards; opacity: 0;">
                            <div class="card-header">
                                <div>
                                    <div class="card-title">Mitra</div>
                                    <div class="card-subtitle">${item.name}</div>
                                    <div class="card-location">
                                        <i class="fas fa-map-marker-alt"></i>
                                        ${item.location}
                                    </div>
                                    <div class="card-organization">
                                        <i class="fas fa-handshake"></i>
                                        ${item.status}
                                    </div>
                                </div>
                                <div class="card-icon">
                                    <i class="${item.icon}"></i>
                                </div>
                            </div>
                        </div>
                    `;
                }

                container.appendChild(card);
            });
        }

        function renderPagination(totalItems) {
            const totalPages = Math.ceil(totalItems / itemsPerPage);
            const container = document.getElementById('paginationContainer');
            container.innerHTML = '';

            for (let i = 1; i <= totalPages; i++) {
                const li = document.createElement('li');
                li.className = `page-item ${i === currentPage ? 'active' : ''}`;
                li.innerHTML = `<a class="page-link" href="#" onclick="changePage(${i})">${i}</a>`;
                container.appendChild(li);
            }
        }

        function changePage(page) {
            currentPage = page;
            const data = currentTab === 'pelatihan' ? filteredData : getAllMitra();
            renderCards(data, page);
            renderPagination(data.length);
        }

        function switchTab(tabName) {
            currentTab = tabName;
            currentPage = 1;

            // Update tab buttons
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');

            // Show/hide content
            if (tabName === 'pelatihan') {
                document.getElementById('pelatihan-content').style.display = 'block';
                document.getElementById('mitra-content').style.display = 'none';
                renderCards(filteredData, 1);
                renderPagination(filteredData.length);
            } else {
                document.getElementById('pelatihan-content').style.display = 'none';
                document.getElementById('mitra-content').style.display = 'block';
                const allMitra = getAllMitra();
                renderCards(allMitra, 1);
                renderPagination(allMitra.length);
            }
        }

        function showTrainingDetail(trainingId) {
            const training = trainingData.find(t => t.id === trainingId);
            if (training) {
                document.getElementById('trainingDetailContent').innerHTML = `
                    <div class="row">
                        <div class="col-md-8">
                            <h4>${training.title}</h4>
                            <p class="text-muted mb-3">
                                <i class="fas fa-map-marker-alt me-2"></i>${training.location} | 
                                <i class="fas fa-building ms-2 me-2"></i>${training.organization}
                            </p>
                            <p>${training.description}</p>
                            
                            <h6 class="mt-4">Detail Pelatihan:</h6>
                            <ul class="list-unstyled">
                                <li><strong>Jadwal:</strong> ${training.schedule}</li>
                                <li><strong>Durasi:</strong> ${training.duration}</li>
                                <li><strong>Kapasitas:</strong> ${training.capacity} peserta</li>
                                <li><strong>Instruktur:</strong> ${training.instructor}</li>
                            </ul>
                        </div>
                        <div class="col-md-4">
                            <div class="text-center p-3 bg-light rounded">
                                <i class="${training.icon}" style="font-size: 3rem; color: #e74c3c;"></i>
                                <h6 class="mt-2">${training.type.replace('-', ' ').toUpperCase()}</h6>
                            </div>
                        </div>
                    </div>
                `;

                const modal = new bootstrap.Modal(document.getElementById('trainingDetailModal'));
                modal.show();
            }
        }

        function applyFilters() {
            const kecamatan = document.getElementById('kecamatan').value;
            const jenisPelatihan = document.getElementById('jenisPelatihan').value;
            const jenisMitra = document.getElementById('jenisMitra').value;

            filteredData = trainingData.filter(item => {
                return (!kecamatan || item.location.toLowerCase().includes(kecamatan.toLowerCase())) &&
                    (!jenisPelatihan || item.type === jenisPelatihan) &&
                    (!jenisMitra || item.organization.toLowerCase().includes(jenisMitra.toLowerCase()));
            });

            currentPage = 1;
            renderCards(filteredData, 1);
            renderPagination(filteredData.length);

            // Show success message
            showToast('Filter berhasil diterapkan!');
        }

        function showToast(message) {
            const toast = document.createElement('div');
            toast.className = 'toast-notification';
            toast.textContent = message;
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background-color: #27ae60;
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                z-index: 1000;
                animation: slideIn 0.3s ease;
            `;

            document.body.appendChild(toast);

            setTimeout(() => {
                toast.remove();
            }, 3000);
        }

        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .training-card {
                transition: all 0.3s ease;
                cursor: pointer;
            }
            
            .training-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            }
        `;
        document.head.appendChild(style);

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            renderCards(trainingData, 1);
            renderPagination(trainingData.length);
        });