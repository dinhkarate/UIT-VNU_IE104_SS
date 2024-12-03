# UIT-VNU-IE104
## Giới Thiệu Tổng Quan
**UIT-VNU-IE104 là** là đồ án cuối kỳ môn IE104- Internet và công nghệ Web của nhóm sinh viên của trường Đại học Công nghệ Thông tin - ĐHQG. Đồ án này được thực hiện bởi nhóm 2, lớp IE.P11
## Thành Viên Nhóm
Các thành viên trong nhóm bao gồm:
| STT | Tên | MSSV | Vai trò |
|:--- |:---:|:----:|:-------:|
|1|Đặng Văn Quốc Bảo|22520099|Trưởng nhóm|
|2|Phạm Quang Dinh|22520252|Thành viên|
|3|Lê Đức Anh Duy|22520315|Thành viên|
|4|Phan Anh Kiệt|22520723|Thành viên|
|5|Lý Nguyễn Anh Duy|22520319|Thành viên|

<a href="[https://github.com/dinhkarate/web-dat-san/graphs/contributors]">
  <img src="https://contrib.rocks/image?repo=dinhkarate/web-dat-san" />
</a>

## Công nghệ sử dụng
**Nhóm sử dụng**: 
## Cài đặt
- Cài đặt [**NodeJS**](https://nodejs.org/en) phiên bản 20.18.0 trở lên.

- Cài đặt [**PostgreSQL**](https://www.postgresql.org) phiên bản 17.0 trở lên.

### Lưu ý khi cài đặt PostgreSQL
Đặt mật khẩu là 1 

![Picture1](https://github.com/user-attachments/assets/5af0b191-6bb8-40dc-9ab2-515a3dfd19bd)


### Hướng dẫn cài đặt
1. **Bước 1**: Clone repo về máy tính của bạn bằng cách sử dụng git command line hoặc download zip file.

        git clone https://github.com/dinhkarate/UIT-VNU_IE104_SS.git
2. **Bước 2**: Di chuyển vào thư mục dự án.

        cd UIT-VNU_IE104_SS

3. **Bước 3**: Cài đặt các dependencies.

    Di chuyển vào thư mục SS_BE, chạy lệnh:

        npm install
    

4. **Bước 4**: Import database *(Nếu đã thực hiện bước này rồi thì qua bước 5)*

- 	Chạy pgAdmin 4.

-	Nhấp chuột phải vào Databases trong cây thư mục bên trái, chọn 
    Create > Database và đặt tên là `SportSpot`.
   
     ![Picture2](https://github.com/user-attachments/assets/f751636f-d86a-4172-85f1-9dbd6b60f177)


-	Nhấp chuột phải vào SportSpot, chọn Query tool

    ![Picture3](https://github.com/user-attachments/assets/a545931c-8c3d-4178-81f8-ecf94a33a63f)

-   Mở file `database_ie104.sql` trong thư mục `SS_BE/config` vào `PostgreSQL`.

-   Nếu bạn có thay đổi tên database thành khác, thì phải sửa file `.env` tại thư mục gốc với các thông số:

        DB_USER=postgres
        DB_PASSWORD=1
        DB_HOST=localhost
        DB_PORT=5432
        DB_NAME=SportSpot

    

5. **Bước 5:**  Khởi chạy server.
- Chuyển sang thư mục SS_BE và chạy lệnh:

        node app.js

## Cấu trúc thư mục
```bash
├───SS_BE                             # Thư mục chứa source code backend
│   ├───config                           # Thư mục chứa các file cấu hình (dữ liệu mẫu, cấu hình database, ...)
│   ├───controllers                      # Thư mục chứa các file controller
│   ├───middlewares                      # Thư mục chứa các file middleware
│   ├───models                           # Thư mục chứa các file model
│   ├───routers                          # Thư mục chứa các file router
│   └───app.js                           # File chạy ứng dụng
└───SS_FE                             # Thư mục chứa source code frontend
    ├───public                           # Thư mục chứa các file tĩnh
    │   ├───images                       # Thư mục chứa các hình ảnh
    │   ├───scripts                      # Thư mục chứa các file js
    │   └───styles                       # Thư mục chứa các file css
    └───views                            # Thư mục chứa các file html
        ├───pages
        └───components
```

### HEADING 3
## FONT 

**đậm**

*nghiêng*
