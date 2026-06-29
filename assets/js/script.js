let globalChart = null;

        function switchPage(element, pageId) {
            document.querySelectorAll('.page-section').forEach(p => p.classList.remove('active'));
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            
            document.getElementById(pageId).classList.add('active');
            element.classList.add('active');
        }

        // Fungsi evaluasi angka menggunakan Math.js yang sangat kokoh
        function evaluasiFungsi(strFungsi, xVal) {
            return math.evaluate(strFungsi, { x: xVal });
        }

        function prosesAnalitik() {
            let inputFungsi = document.getElementById('fungsi-analitik').value;
            let xTitik = parseFloat(document.getElementById('titik-x-analitik').value);
            let boxHasil = document.getElementById('box-hasil-analitik');

            if (!inputFungsi.trim() || isNaN(xTitik)) {
                alert('Tolong lengkapi input fungsi dan titik x!');
                return;
            }

            try {
                // Menghitung turunan murni simbolik menggunakan Math.js
                let turunanNode = math.derivative(inputFungsi, 'x');
                let txtTurunan = turunanNode.toString();
                
                // Evaluasi nilai numerik
                let gradienM = turunanNode.evaluate({ x: xTitik });
                let yTitik = math.evaluate(inputFungsi, { x: xTitik });

                document.getElementById('out-f-asal').innerText = inputFungsi;
                document.getElementById('out-f-turunan').innerText = txtTurunan;
                document.getElementById('out-f-gradien').innerText = gradienM;

                document.getElementById('teks-analitik').innerHTML = 
                    `Berdasarkan perhitungan analitik, diperoleh persamaan turunan <strong>f'(x) = ${txtTurunan}</strong>.<br><br>` +
                    `Saat dievaluasi di titik koordinat utama <strong>x = ${xTitik}</strong>, diperoleh nilai fungsi <strong>y = ${yTitik}</strong>. ` +
                    `Sehingga didapatkan nilai <strong>Gradien Kemiringan Garis Singgung (m) sebesar ${gradienM}</strong>.<br><br>` +
                    `Arah kemiringan garis ini digambarkan secara visual oleh <strong>Garis Merah Putus-Putus</strong> yang menempel tepat pada kurva f(x) berwarna biru.`;

                boxHasil.style.display = 'block';
                gambarGrafikGradien(inputFungsi, txtTurunan, xTitik, yTitik, gradienM);

            } catch (err) {
                alert('Terjadi kesalahan hitung: ' + err.message + '\n\nPastikan penulisan rumus benar menggunakan huruf kecil x.');
            }
        }

        function gambarGrafikGradien(inputFungsi, turunanFungsi, xTitik, yTitik, m) {
            let labelsX = [];
            let datasetKurva = [];
            let datasetGarisSinggung = [];

            for (let i = xTitik - 3; i <= xTitik + 3; i += 0.2) {
                labelsX.push(i.toFixed(1));
                datasetKurva.push(evaluasiFungsi(inputFungsi, i));
                let yGaris = m * (i - xTitik) + yTitik;
                datasetGarisSinggung.push(yGaris);
            }

            if (globalChart) { globalChart.destroy(); }

            let ctx = document.getElementById('canvasChart').getContext('2d');
            globalChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labelsX,
                    datasets: [
                        {
                            label: 'Kurva Fungsi f(x)',
                            data: datasetKurva,
                            borderColor: '#2563eb',
                            borderWidth: 2.5,
                            fill: false,
                            pointRadius: 0
                        },
                        {
                            label: `Garis Singgung (m = ${m})`,
                            data: datasetGarisSinggung,
                            borderColor: '#dc2626',
                            borderWidth: 2,
                            borderDash: [6, 6],
                            fill: false,
                            pointRadius: 0
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { title: { display: true, text: 'Sumbu X' } },
                        y: { title: { display: true, text: 'Sumbu Y' } }
                    }
                }
            });
        }

        function prosesNumerik() {
            let inputFungsi = document.getElementById('fungsi-numerik').value;
            let x = parseFloat(document.getElementById('titik-x-num').value);
            let h = parseFloat(document.getElementById('nilai-h').value);
            let boxHasil = document.getElementById('box-hasil-numerik');

            if (!inputFungsi.trim() || isNaN(x) || isNaN(h)) {
                alert('Tolong lengkapi seluruh data numerik!');
                return;
            }
            if (h <= 0) {
                alert('Nilai h harus lebih besar dari 0!');
                return;
            }

            try {
                let fx = evaluasiFungsi(inputFungsi, x);
                let fx_plus_h = evaluasiFungsi(inputFungsi, x + h);
                let fx_minus_h = evaluasiFungsi(inputFungsi, x - h);

                let bedaMaju = (fx_plus_h - fx) / h;
                let bedaMundur = (fx - fx_minus_h) / h;
                let bedaTengah = (fx_plus_h - fx_minus_h) / (2 * h);

                document.getElementById('out-num-maju').innerText = bedaMaju.toFixed(6);
                document.getElementById('out-num-mundur').innerText = bedaMundur.toFixed(6);
                document.getElementById('out-num-tengah').innerText = bedaTengah.toFixed(6);

                document.getElementById('teks-numerik').innerHTML = 
                    `Komputasi dijalankan pada titik pusat <strong>x = ${x}</strong> dengan rentang langkah <strong>h = ${h}</strong>:<br><br>` +
                    `• Hasil <strong>Beda Maju</strong> (titik depan): <strong>${bedaMaju.toFixed(5)}</strong>.<br>` +
                    `• Hasil <strong>Beda Mundur</strong> (titik belakang): <strong>${bedaMundur.toFixed(5)}</strong>.<br>` +
                    `• Hasil <strong>Beda Tengah</strong> (simetris dua sisi): <strong>${bedaTengah.toFixed(5)}</strong>.<br><br>` +
                    `Metode <strong>Beda Tengah</strong> menghasilkan tingkat pxresisi terbaik karena memiliki sisa kesalahan terkecil dibandingkan metode linier lainnya.`;

                boxHasil.style.display = 'block';

            } catch (err) {
                alert('Gagal melakukan komputasi numerik. Periksa kembali penulisan fungsi.');
            }
        }