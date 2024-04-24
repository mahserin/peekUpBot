
const userModel = require('./../model/user');
const payModel = require('./../model/payment');
const puppeteer = require('puppeteer');

exports.newPay = async (req , res ) => {
    const  user = await userModel.findById(req.params.id)


    
    await payModel.create({user : user._id ,traceCode : req.body.traceId , price : req.body.price , status : 'waiting' })
    res.status(200).json({message : 'new pay'})
    
    const browser = await puppeteer.launch({headless : 'shell'});
    const page = await browser.newPage();
  
    await page.goto('https://next.zarinpal.com/panel/zarinp.al%2Fpeekup/session/?filter=ACTIVE');
  
    await page.setViewport({width: 1080, height: 1024});
  
}