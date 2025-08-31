import { NextFunction, Request, Response } from 'express'
import { MEDIA_MESSAGE } from '~/constants/messages'
import mediaService from '~/services/media.service'
import mysqlService from '~/services/mysql.service'

export class CompanyController {
  // Lấy thông tin công ty
  async getCompanyInfo(req: Request, res: Response) {
    try {
      const companyInfo = await mysqlService.query('SELECT * FROM company_info LIMIT 1')

      if (companyInfo.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy thông tin công ty'
        })
      }

      return res.status(200).json({
        success: true,
        message: 'Lấy thông tin công ty thành công',
        data: companyInfo[0]
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy thông tin công ty'
      })
    }
  }

  // Cập nhật thông tin công ty
  async updateCompanyInfo(req: Request, res: Response) {
    try {
      const { name, intro_text, address, tax_code, email, welcome_content } = req.body

      const updateQuery = `
        UPDATE company_info 
        SET name = ?, intro_text = ?, address = ?, 
            tax_code = ?, email = ?, welcome_content = ?, 
            updated_at = CURRENT_TIMESTAMP
        WHERE id = 1
      `

      await mysqlService.query(updateQuery, [name, intro_text, address, tax_code, email, welcome_content])

      return res.status(200).json({
        isSuccess: true,
        message: 'Cập nhật thông tin công ty thành công'
      })
    } catch (error) {
      return res.status(500).json({
        isSuccess: false,
        message: 'Lỗi server khi cập nhật thông tin công ty'
      })
    }
  }

  async updateCompanyLogo(req: Request, res: Response, next: NextFunction) {
    try {
      const url = await mediaService.handleUploadImage(req)

      const updateQuery = `
        UPDATE company_info 
        SET logo_url = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = 1
      `

      await mysqlService.query(updateQuery, [url?.[0]?.url])

      return res.json({
        isSuccess: true,
        message: 'Upload hình ảnh logo thành công'
      })
    } catch (error) {
      next(error)
    }
  }

  async updateCompanyImgIntro(req: Request, res: Response, next: NextFunction) {
    try {
      const url = await mediaService.handleUploadImage(req)

      const updateQuery = `
        UPDATE company_info 
        SET img_intro = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = 1
      `

      await mysqlService.query(updateQuery, [url?.[0]?.url])

      return res.json({
        isSuccess: true,
        message: 'Upload hình ảnh intro thành công'
      })
    } catch (error) {
      next(error)
    }
  }

  // Lấy thông tin liên hệ
  async getContactInfo(req: Request, res: Response) {
    try {
      const contactInfo = await mysqlService.query('SELECT * FROM contact_company LIMIT 1')

      return res.status(200).json({
        success: true,
        message: 'Lấy thông tin liên hệ thành công',
        data: contactInfo[0] || {}
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy thông tin liên hệ'
      })
    }
  }

  // Lấy danh sách dịch vụ
  async getServices(req: Request, res: Response) {
    try {
      const services = await mysqlService.query(
        'SELECT * FROM services WHERE is_delete = FALSE ORDER BY created_at DESC'
      )

      return res.status(200).json({
        success: true,
        message: 'Lấy danh sách dịch vụ thành công',
        data: services
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy danh sách dịch vụ'
      })
    }
  }

  // Thêm dịch vụ mới
  async createService(req: Request, res: Response) {
    try {
      const { title, description, image_url, company_id } = req.body

      const insertQuery = `
        INSERT INTO services (title, description, image_url, company_id) 
        VALUES (?, ?, ?, ?)
      `

      const result: any = await mysqlService.query(insertQuery, [title, description, image_url, company_id || 1])

      return res.status(201).json({
        success: true,
        message: 'Tạo dịch vụ mới thành công',
        data: { id: result.insertId }
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi server khi tạo dịch vụ mới'
      })
    }
  }

  // Lưu thông tin liên hệ từ khách hàng
  async saveCustomerContact(req: Request, res: Response) {
    try {
      const { full_name, phone_customer, message } = req.body

      const insertQuery = `
        INSERT INTO contact_customer (full_name, phone_customer, message) 
        VALUES (?, ?, ?)
      `

      await mysqlService.query(insertQuery, [full_name, phone_customer, message])

      return res.status(201).json({
        success: true,
        message: 'Lưu thông tin liên hệ thành công'
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi server khi lưu thông tin liên hệ'
      })
    }
  }

  // Lấy footer links
  async getFooterLinks(req: Request, res: Response) {
    try {
      const footerLinks = await mysqlService.query('SELECT * FROM footer_links ORDER BY column_position, id')

      return res.status(200).json({
        success: true,
        message: 'Lấy footer links thành công',
        data: footerLinks
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy footer links'
      })
    }
  }
}

export const companyController = new CompanyController()
