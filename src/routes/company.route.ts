import { Router } from 'express'
import { companyController } from '~/controllers/company.controller'

const companyRouter = Router()

// Lấy thông tin công ty
companyRouter.get('/info', companyController.getCompanyInfo)

// Cập nhật thông tin công ty
companyRouter.put('/info', companyController.updateCompanyInfo)
// Cập nhật ảnh logo công ty
companyRouter.put('/info/logo', companyController.updateCompanyLogo)
// Cập nhật ảnh giới thiệu
companyRouter.put('/info/img-intro', companyController.updateCompanyImgIntro)
// Lấy thông tin liên hệ
companyRouter.get('/contact', companyController.getContactInfo)

// Lấy danh sách dịch vụ
companyRouter.get('/services', companyController.getServices)

// Thêm dịch vụ mới
companyRouter.post('/services', companyController.createService)

// Lưu thông tin liên hệ từ khách hàng
companyRouter.post('/contact/customer', companyController.saveCustomerContact)

// Lấy footer links
companyRouter.get('/footer-links', companyController.getFooterLinks)

export default companyRouter
