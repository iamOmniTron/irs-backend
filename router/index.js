const express = require("express");
const { loginUser, loginAdmin, resetPassword, adminResetPassword, confirmUserLogin, confirmAdminLogin, loginLGAAdmin, confirmLGAAdminLogin } = require("../controllers/auth");
const { createTax, updateTax, getTaxes, deleteTax } = require("../controllers/tax");
const { auth } = require("../middlewares");
const { updateGTO, createGTO, getGTOs, deleteGTO } = require("../controllers/turnover");
const { register, profile, getUsers, uploadImage, approveUser, getLoginSessions, getLgaUser } = require("../controllers/user");
const {createSize,updateSize,getSizes,deleteSize} = require("../controllers/size")
const {createType,updateType,getTypes,deleteType} = require("../controllers/type");
const { createDistrict, updateDistrict, getDistricts, deleteDistrict } = require("../controllers/district");
const { createLocalGovernmentArea, updateLocalGovernmentArea, getLocalGovernmentAreas, deleteLocalGovernmentArea, getLGACount } = require("../controllers/lga");
const { createCategory, updateCategory, getCategories, deleteCategory } = require("../controllers/category");
const { createBillingDuration, updateBillingDuration, getBillingDurations, deleteBillingDuration } = require("../controllers/billing");
const { getBusinesses, getLgaBusiness } = require("../controllers/business");
const { getAllInvoices, getMyInvoices, generatenInvoice, getLgaInvoices } = require("../controllers/invoice");
const { createReciept, getAllPayments, getMyPayments, getLGAPayments, getDistrictPayments } = require("../controllers/payment");
const { upload } = require("../utilities/helpers");
const { createAdmin, updateAdmin, getAllAdmins, deleteAdmin, adminProfile } = require("../controllers/lgaAdmin");

const router = express.Router();



// AUTHENTICATION
router.post("/login",loginUser);
router.post("/login/otp/:userId",confirmUserLogin);
router.post("/admin/login",loginAdmin);
router.post("/admin/otp/:userId",confirmAdminLogin)
router.post("/lga/admin/login",loginLGAAdmin);
router.post("/lga/admin/otp/:userId",confirmLGAAdminLogin )
router.post("/signup",register);
router.post("/password-reset",auth,resetPassword);
router.post("/admin/password-reset/user/:userId",auth,adminResetPassword);

// USERS
router.get("/get-current-user",auth,profile);
router.get("/user/get-all",auth,getUsers);
router.put("/user/update-image",auth,upload.single("image"),uploadImage);
router.put("/user/approve/:userId",auth,approveUser);
router.get("/user/lga",auth,getLgaUser);


// LOGIN SESSIONS
router.get("/activity/login/get-all",auth,getLoginSessions);


// TAX
router.post("/tax/create",auth,createTax);
router.put("/tax/update/:taxId",auth,updateTax);
router.get("/taxes/get-all",getTaxes);
router.delete("/taxes/delete/:taxId",auth,deleteTax);


//GROSS TURNOVERS
router.post("/gto/create",auth,createGTO);
router.put("/gto/update/:turnoverId",auth,updateGTO);
router.get("/gto/get-all",getGTOs);
router.delete("/gto/delete/:turnoverId",auth,deleteGTO)


// SIZES
router.post("/size/create",auth,createSize);
router.put("/size/update/:sizeId",auth,updateSize);
router.get("/size/get-all",getSizes);
router.delete("/size/delete/:sizeId",auth,deleteSize);


// TYPES
router.post("/type/create",auth,createType);
router.put("/type/update/:typeId",auth,updateType);
router.get("/type/get-all",getTypes);
router.delete("/type/delete/:typeId",auth,deleteType);

// DISTRICT
router.post("/district/create",auth,createDistrict);
router.put("/district/update/:districtId",auth,updateDistrict);
router.get("/district/get-all",getDistricts);
router.delete("/district/delete/:districtId",auth,deleteDistrict);

// LOCAL GOVERNMENT AREA
router.post("/lga/create",auth,createLocalGovernmentArea);
router.put("/lga/update/:localGovernmentAreaId",auth,updateLocalGovernmentArea);
router.get("/lgas/count-all",getLGACount);
router.get("/lga/get-all",getLocalGovernmentAreas);
router.delete("/lga/delete/:localGovernmentAreaId",auth,deleteLocalGovernmentArea);

// CATEGORY
router.post("/category/create",auth,createCategory);
router.put("/category/update/:categoryId",auth,updateCategory);
router.get("/category/get-all",getCategories);
router.delete("/category/delete/:categoryId",auth,deleteCategory);

// BILLING DURATION
router.post("/billing/create",auth,createBillingDuration);
router.put("/billing/update/:billingDurationId",auth,updateBillingDuration);
router.get("/billing/get-all",getBillingDurations);
router.delete("/billing/delete/:billingId",auth,deleteBillingDuration);

// BUSINESS
router.get("/business/get-all",auth,getBusinesses);
router.get("/business/get-local",auth,getLgaBusiness);

// INVOICES
router.get("/invoice/get-all",auth,getAllInvoices);
router.get("/invoice/my-invoices",auth,getMyInvoices);
router.post("/invoice/create",auth,generatenInvoice);
router.get("/invoice/lga",auth,getLgaInvoices)


// PAYMENTS
router.post("/payment/new",auth,createReciept);
router.get("/payment/get-all",auth,getAllPayments);
router.get("/payment/my-payments",auth,getMyPayments);
router.get("/payments/lga/:lgaId",auth,getLGAPayments);
router.get("/payments/district/:districtId",auth,getDistrictPayments);


// LGA ADMINS
router.post("/admin/lga/create",auth,createAdmin);
router.put("/admin/lga/:adminId",auth,updateAdmin);
router.get("/admin/lga/get-all",auth,getAllAdmins);
router.delete("/admin/lga/delete/:adminId",auth,deleteAdmin);
router.get("/admin/profile",auth,adminProfile);

module.exports = router;