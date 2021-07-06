// websites routes
var homeController = require('../app/http/controllers/homeController');
var authController = require('../app/http/controllers/authController');
var cartController = require('../app/http/controllers/customers/cartController');
const orderController = require('../app/http/controllers/customers/orderController');
const adminOrderController = require('../app/http/controllers/admin/orderController');
const statusController = require('../app/http/controllers/admin/statusController');
const menuController = require('../app/http/controllers/admin/menuController')

//middlewares
const guest = require('../app/http/middlewares/guest');
const auth = require('../app/http/middlewares/auth');
const admin = require('../app/http/middlewares/admin');



function initRoutes(app){

    app.get('/', homeController().index);
    app.get('/login',guest,authController().login);
    app.post('/login',authController().postLogin);
    

    app.get('/register',guest,authController().register);
    app.post('/register',authController().postRegister);
    app.post('/logout',authController().logout);

    

// Customer routes
    app.post('/orders',auth, orderController().store)
    app.get('/customer/orders',auth, orderController().index)
    app.get('/customer/orders/:id',auth, orderController().show)

    // Admin routes
    app.get('/admin/orders',admin, adminOrderController().index)
    app.post('/admin/order/status',admin, statusController().update)
    //admin menu
    app.get('/admin/add-item', menuController().addItem)
    // app.post('/admin/add-item', menuController().postAddItem)
    ///admin/order/status

    //API For add item
    app.get('/api/menu', menuController().find)
    app.post('/api/menu',menuController().createItem)
    app.delete('/api/menu/:id',menuController().deleteItem)
    
      
    // (req,res) => {
    //     res.render("home");
    //   }
   

    app.get('/cart',cartController().index);
    app.post('/update-cart', cartController().update);      
}
module.exports = initRoutes;