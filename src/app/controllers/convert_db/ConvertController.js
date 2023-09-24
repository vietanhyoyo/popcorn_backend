const Type = require('../../models/Type')
const { pool } = require('../../../config/db/mysql')

class ConvertController {
  convertType(req, res) {
    pool.query('select * from type', async (err, result, fields) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      try {

        const insertPromises = result.map(async (item) => {
          const newItem = { name: item.name };
          // Sử dụng async/await để chờ việc lưu vào MongoDB hoàn thành
          return Type.create(newItem);
        });

        // Sử dụng Promise.all để chờ tất cả các lời hứa lưu vào MongoDB hoàn thành
        await Promise.all(insertPromises);

        // Trả về thông tin Type đã được lưu
        res.status(201).json({ message: 'success' });
      } catch (error) {
        // Xử lý lỗi nếu có
        console.log(error);
        res.status(500).json({ error, message: 'create error' });
      }
    });
  }
}

module.exports = new ConvertController();
