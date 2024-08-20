const cartModel = require('../models/cartModel');
const medicineModel = require('../models/medicineModel');
const validation = require('../validator/validation');

// Add TO Cart:
const addMedicineTocart = async function (req, res) {
    try {
        const buyerId = req.params.buyerId;
        if (!validation.checkObjectId(buyerId)) {
            return res.status(400).send({ status: false, message: "Invalid buyerId"});
        }
        if (buyerId !== req.decodedToken.userId) {
            return res.status(403).send({ status: false, message: "Not authorized to add medicine in cart"})
        }

        const data = req.body;
        const { medicineId,quantity} = data;
        if(!validation.checkData(medicineId)){
            return res.status(400).send({status:false,message: "Provide medicineId"})
        }
        if (!validation.checkObjectId(medicineId)) {
            return res.status(400).send({ status: false, message: "Invalid medicineId" })
        }
        // Check if the medicine exists and is not deleted
        const isexistMedicine = await medicineModel.findById({ _id: medicineId });
        if (!isexistMedicine) {
            return res.status(404).send({ status: false, message: "Medicine not found" })
        }
        if (isexistMedicine.isDeleted === true) {
            return res.status(404).send({ status: false, message: "Medicine is deleted" });
        }
        if (isexistMedicine.stockQuantity === 0) {
            return res.status(400).send({ status: false, message: "Medicine is out of stock" });
        }

        // If buyer's cart doesn't exist then create new cart and add medicine to that cart
        const userCart = await cartModel.findOne({ buyerId: buyerId });

        if (!userCart) {
            let newCart = {
                buyerId: buyerId,
                items: [{ medicineId: medicineId, quantity: 1}],
                totalPrice: isexistMedicine.price 
            };

            const createCart = await cartModel.create(newCart);
            return res.status(201).send({ status: true, message: "Cart is created and medicine added to cart", data: createCart });
        }

        // If medicine does not exist in the cart
        const medicineExistinCart = userCart.items.findIndex(items => items.medicineId.toString() === medicineId)
        if (medicineExistinCart === -1) {
            const addMedicineinCart = await cartModel.findOneAndUpdate({ buyerId: buyerId },
                {
                    $push: { items: { medicineId: medicineId, quantity: 1}}, 
                    $inc: { totalPrice: isexistMedicine.price}
                }, { new: true })

            return res.status(200).send({ status: true, message: "New medicine added to cart", data: addMedicineinCart });
        }  // If medicine exist in cart
        else{
            const incrementMedicineQuantity = await cartModel.findOneAndUpdate({ buyerId: buyerId, "items.medicineId": medicineId },
                { $inc: { "items.$.quantity": quantity, totalPrice:  isexistMedicine.price * quantity}}, 
                 { new: true }
            )

            return res.status(200).send({ status: true, message: "Medicine's quantity and price updated in the cart", data: incrementMedicineQuantity })
        }

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

// View Cart:
const viewCart = async function (req, res) {
    try {
        const buyerId = req.params.buyerId;
        if (!validation.checkObjectId(buyerId)) {
            return res.status(400).send({ status: false, message: "Invalid buyerId" });
        }
        const isexistCart = await cartModel.findOne({ buyerId: buyerId }).populate('items.medicineId');
        if (!isexistCart) {
            return res.status(404).send({ status: false, message: "Cart not found" })
        }
        if (isexistCart.buyerId != req.decodedToken.userId) {
            return res.status(403).send({ status: false, message: "Not authorized to view the cart" });
        }

        return res.status(200).send({ status: true, message: "Successfully fetched cart data", data: isexistCart });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

// Update Cart Quantity:
const updateCartQuantity = async function(req,res){
   try{
    const buyerId = req.params.buyerId;
    if (!validation.checkObjectId(buyerId)) {
        return res.status(400).send({ status: false, message: "Invalid buyerId" });
    }
    if (buyerId !== req.decodedToken.userId) {
        return res.status(403).send({ status: false, message: "Not authorized to add medicine in cart" })
    }
    
    const isexistCart = await cartModel.findOne({ buyerId: buyerId }).populate('items.medicineId');

    const medicineId = req.body.medicineId;
    if(!validation.checkData(medicineId) || !validation.checkObjectId(medicineId)){
        return res.status(400).send({status:false,message: "Invalid medicineId"})
    }

     const isexistMedicine = isexistCart.items.findIndex(item => item.medicineId._id.toString() === medicineId);
     if (isexistMedicine === -1) {
            return res.status(404).send({ status: false, message: "Medicine not found in the cart" });
     }

    const quantity = isexistCart.items[isexistMedicine].quantity;
    const price = isexistCart.items[isexistMedicine].medicineId.price;

    if(quantity === 1){
          await cartModel.findOneAndUpdate({buyerId:buyerId},
            {$pull:{items: {medicineId:medicineId}}, $inc:{totalPrice: -price}}
        )

        return res.status(200).send({ status: true, message: "Medicine removed from cart" });
    }else{
         // Decrease the quantity by 1
        const removequantityBYone = await cartModel.findOneAndUpdate({buyerId:buyerId, "items.medicineId": medicineId},
            {$inc:{"items.$.quantity": -1, totalPrice: -price}},
            {new:true}
    
           )
           return res.status(200).send({ status: true, message: "Medicine quantity decreased by 1", data: removequantityBYone});
    }
   }catch(error){
    return res.status(500).send({status:false,message:error.message});
   }
}

// Delete Medicine From Cart:
const deleteMedicinefromCart = async function (req, res) {
    try {
        const buyerId = req.params.buyerId;
        if (!validation.checkObjectId(buyerId)) {
            return res.status(400).send({ status: false, message: "Invalid buyerId" });
        }

        const isexistCart = await cartModel.findOne({ buyerId: buyerId }).populate('items.medicineId')
        if (!isexistCart) {
            return res.status(404).send({ status: false, message: "Cart not found" })
        }
        if (isexistCart.buyerId.toString() !== req.decodedToken.userId) {
            return res.status(403).send({ status: false, message: "Not authorized to delete medicine from cart" });
        }

        const medicineId = req.body.medicineId;
        if (!validation.checkObjectId(medicineId)) {
            return res.status(400).send({ status: false, message: "Invalid MedicineId" });
        }

        const isexistMedicine = isexistCart.items.findIndex(item => item.medicineId._id.toString() === medicineId);
        if (isexistMedicine === -1) {
            return res.status(404).send({ status: false, message: "Medicine not found in the cart" });
        }

        // Calculate the price of the removed medicine 
        const removedMedicine = isexistCart.items[isexistMedicine];
        const removedPrice = removedMedicine.medicineId.price * removedMedicine.quantity;

        // Delete single medicine from the cart
        await cartModel.findOneAndUpdate({ buyerId: buyerId },
            { $pull: { items: { medicineId: medicineId } }, $inc: { totalPrice: -removedPrice } });

        return res.status(200).send({ status: true, message: "Single medicine removed from cart" })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

module.exports = { addMedicineTocart, viewCart, updateCartQuantity, deleteMedicinefromCart };