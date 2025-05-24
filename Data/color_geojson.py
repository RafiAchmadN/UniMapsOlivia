import json

def get_color(jumlah_miskin):
    """Menentukan kode warna berdasarkan jumlah penduduk miskin."""
    if jumlah_miskin is None:
        return '#808080'  # Abu-abu untuk data tidak tersedia

    min_val = 100
    max_val = 1500

    if jumlah_miskin <= min_val:
        return '#00FF00'  # Hijau
    if jumlah_miskin > max_val: # Aturan: warna merah jika lebih dari 1500
        return '#FF0000'  # Merah

    mid_point_for_yellow = (min_val + max_val) / 2 # 800

    r, g, b = 0, 0, 0
    if jumlah_miskin <= mid_point_for_yellow: # Dari Hijau ke Kuning
        ratio = (jumlah_miskin - min_val) / (mid_point_for_yellow - min_val)
        r = int(255 * ratio)
        g = 255
        b = 0
    else: # Dari Kuning ke Merah
        ratio = (jumlah_miskin - mid_point_for_yellow) / (max_val - mid_point_for_yellow)
        r = 255
        g = int(255 * (1 - ratio))
        b = 0
        
    return f'rgb({r},{g},{b})'


def proses_geojson(file_kemiskinan_path, file_geojson_input_path, file_geojson_output_path):
    """
    Menggabungkan data kemiskinan ke dalam file GeoJSON dan menambahkan properti 'fill' untuk warna.
    """
    try:
        with open(file_kemiskinan_path, 'r', encoding='utf-8') as f:
            data_kemiskinan_list = json.load(f)
    except FileNotFoundError:
        print(f"Error: File data kemiskinan tidak ditemukan di {file_kemiskinan_path}")
        return
    except json.JSONDecodeError:
        print(f"Error: Format JSON tidak valid pada file {file_kemiskinan_path}")
        return

    poverty_map = {item['kecamatan'].upper(): item['jumlah_miskin'] for item in data_kemiskinan_list}
    print(f"Data kemiskinan berhasil dimuat. Jumlah entri: {len(poverty_map)}")

    try:
        with open(file_geojson_input_path, 'r', encoding='utf-8') as f:
            geojson_data = json.load(f)
    except FileNotFoundError:
        print(f"Error: File GeoJSON input tidak ditemukan di {file_geojson_input_path}")
        return
    except json.JSONDecodeError:
        print(f"Error: Format JSON tidak valid pada file {file_geojson_input_path}")
        return

    print(f"File GeoJSON '{file_geojson_input_path}' berhasil dimuat.")
    
    features_updated_count = 0
    features_not_found_in_poverty_data = []

    if 'features' in geojson_data and isinstance(geojson_data['features'], list):
        for feature in geojson_data['features']:
            if 'properties' in feature: # Cek apakah 'properties' ada
                nama_kecamatan_geojson = feature['properties'].get('NAMOBJ') # Gunakan .get() untuk keamanan
                if nama_kecamatan_geojson:
                    nama_kecamatan_lookup = nama_kecamatan_geojson.upper()
                    jumlah_miskin = poverty_map.get(nama_kecamatan_lookup)
                    
                    feature['properties']['jumlah_miskin'] = jumlah_miskin if jumlah_miskin is not None else "Data tidak tersedia"
                    # --- PERUBAHAN DI SINI ---
                    feature['properties']['fill'] = get_color(jumlah_miskin) # Menggunakan key "fill"
                    # -------------------------

                    if jumlah_miskin is not None:
                        features_updated_count +=1
                    else:
                        features_not_found_in_poverty_data.append(nama_kecamatan_geojson)
                else:
                    # Jika NAMOBJ tidak ada atau kosong di dalam properties
                    print(f"Peringatan: Fitur memiliki 'properties' tetapi tidak ada 'NAMOBJ' atau NAMOBJ kosong: {feature['properties']}")
                    # Anda bisa memutuskan untuk memberi warna default pada kasus ini juga
                    feature['properties']['fill'] = '#808080' # Warna default abu-abu
                    feature['properties']['jumlah_miskin'] = "Nama Kecamatan Tidak Ada"

            else: # Jika 'properties' tidak ada sama sekali pada fitur
                print(f"Peringatan: Fitur tidak memiliki 'properties'. Membuat 'properties' baru.")
                feature['properties'] = {
                    'NAMOBJ': 'Nama Tidak Diketahui',
                    'jumlah_miskin': 'Data tidak tersedia',
                    'fill': '#C0C0C0' # Warna abu-abu berbeda untuk kasus ini
                }
    else:
        print("Error: Struktur GeoJSON tidak valid (tidak ada 'features' list).")
        return

    print(f"Jumlah fitur yang berhasil diperbarui dengan data kemiskinan dan warna: {features_updated_count}")
    if features_not_found_in_poverty_data:
        print(f"Peringatan: Data kemiskinan tidak ditemukan untuk kecamatan berikut di GeoJSON (akan diwarnai abu-abu): {', '.join(sorted(list(set(features_not_found_in_poverty_data))[:5]))} ...dan lainnya jika ada.")

    try:
        with open(file_geojson_output_path, 'w', encoding='utf-8') as f:
            json.dump(geojson_data, f, ensure_ascii=False, indent=2)
        print(f"File GeoJSON baru berhasil disimpan di: {file_geojson_output_path}")
    except IOError:
        print(f"Error: Gagal menyimpan file output GeoJSON di {file_geojson_output_path}")

if __name__ == '__main__':
    path_data_kemiskinan = 'Data\data_kemiskinan.json' # Path ke file data_kemiskinan.json Anda
    path_geojson_input = 'Data\Segmentasi Kecamatan.geojson'
    path_geojson_output = 'Data\Segmentasi_Kecamatan_Fill_Property.geojson' # Nama file output baru

    proses_geojson(path_data_kemiskinan, path_geojson_input, path_geojson_output)