const Menu = require('../../../models/menu');
function menuController() {
    return {
        //retrive all the item
        find(req, res){
            Menu.find().then(function(pizzas){
                // console.log(pizzas)
                return res.render("admin/menuList", {pizzas : pizzas});
            })
        },
        addItem(req,res){
            return res.render("admin/addItem")
        },
        createItem(req, res) {
            if(!req.body){
                res.status(400).send({ message: "Content can not be empty!"});
                return;
            }
            // console.log(req.body)
            //new item
            const item = new Menu({
                name: req.body.name,
                image: req.body.image,
                price: req.body.price,
                size: req.body.size,
            })
            //save item in database
            item.save(item).then( data => {
                res.redirect('/api/menu');
                // res.send(data)
                
            })
            .catch(err =>{
                res.status(500).send({
                    message : err.message || "Some error occurred while creating a create operation"
                });
            });
            

        //    return res.render("admin/addItem")
        },
        deleteItem(req,res){
            const id = req.params.id;

            Menu.findByIdAndDelete(id).then(data => {
                if(!data){
                    res.status(404).send({message: `cannot delete with id ${id}.maybe id is wrong`})
                }else{
                    res.send({message:"Item deleted successfully!"})
                }
            }).catch(err => {
                res.status(500).send({
                    message: "could not delete user with id ="+ id
                });
            });
        }

    }
}

module.exports = menuController