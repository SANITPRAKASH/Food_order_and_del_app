import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Function to place an order
const placeOrder = async (req, res) => {
  try {
    // Create a new order object
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      studentInfo: req.body.studentInfo, // Store the student's details with the order
    });

    // Save the order in the database
    await newOrder.save();

    // Clear the user's cart data after placing the order
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    // Prepare Razorpay line items from the order
    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "INR",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100 * 80, // Convert price to paisa and adjust as needed
      },
      quantity: item.quantity,
    }));

    // Add delivery charges as a line item
    line_items.push({
      price_data: {
        currency: "INR",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 2 * 100 * 80, // Delivery charges in paisa
      },
      quantity: 1,
    });

    // Razorpay order creation options
    const options = {
      amount: req.body.amount * 100, // Amount in paisa
      currency: "INR",
      receipt: `order_rcptid_${newOrder._id}`, // Unique receipt ID for this order
      payment_capture: 1, // Auto-capture payment
    };

    // Create order with Razorpay API
    const order = await razorpay.orders.create(options);

    // Return the success response with the order details
    res.json({ success: true, order_id: order.id, order });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error placing order" });
  }
};

// Razorpay payment verification function
const verifyOrder = async (req, res) => {
  const { orderId, payment_id, razorpay_signature } = req.body;

  try {
    // Verify the payment signature
    const body = orderId + "|" + payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    // Check if the signature matches
    if (expectedSignature === razorpay_signature) {
      // Update order status to 'payment successful'
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Payment Successful" });
    } else {
      res.json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error during payment verification" });
  }
};
const userOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({userId:req.body.userId});
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

// Listing orders for admin panel
const listOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({});
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

// api for updating order status
const updateStatus = async (req,res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
        res.json({success:true,message:"Status Updated"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

export {placeOrder,verifyOrder,userOrders,listOrders,updateStatus}