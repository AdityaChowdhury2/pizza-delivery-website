
import axios from 'axios';
import moment from 'moment';
import notie from 'notie';
import { initAdmin } from './admin';

let addToCart = document.querySelectorAll('.add-to-cart');

let onDelete = document.querySelectorAll('.delete')

let cartCounter = document.querySelector('#cartCounter');

$("#add_item").submit(function(event){
    alert("Data inserted Successfully!")
})


function updateCart(pizza){
    axios.post('/update-cart',pizza).then(res =>{
        console.log(res);
        cartCounter.innerText = res.data.totalQty;
        notie.alert({
            type: 'success',
            text: 'Item added to cart',
            time: 1,
            position: 'top'
        })
    }).catch(err => {
        notie.alert({
            type: 'error',
            text: 'Something went Wrong',
            time: 1,
            position: 'top'
        });

    });
}

onDelete.forEach((btn)=>{
        btn.addEventListener('click',(e)=>{
        let pizzaId = (btn.dataset.pizza)
        // console.log(pizzaId);
        axios.delete('/api/menu/' + pizzaId ).then(res =>{
            console.log(res);
            location.reload();
            notie.alert({
                type: 'success',
                text: 'Item Deleted',
                time: 1,
                position: 'top'
            })
        }).catch(err => {
            notie.alert({
                type: 'error',
                text: 'Something went Wrong',
                time: 1,
                position: 'top'
        });

    });
    })
    
})


addToCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let pizza = JSON.parse(btn.dataset.pizza)
        updateCart(pizza)
    })
})

// Remove alert message after X seconds
const alertMsg = document.querySelector('#success-alert')
if(alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    }, 2000)
}



// Change order status
let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let time = document.createElement('small')


function updateStatus(order) {
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted = true;
    statuses.forEach((status) => {
        let dataProp = status.dataset.status
        if(stepCompleted) {
            status.classList.add('step-completed')
       }       
       if(dataProp === order.status) {
            stepCompleted = false
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
           if(status.nextElementSibling) {
            status.nextElementSibling.classList.add('current')
           }
       }
    })

}

updateStatus(order);

//Socket
let socket = io()

//join
if(order){
    socket.emit('join',`order_${order._id}`)   
}
let adminAreaPath = window.location.pathname //for reciving the path name
// console.log(adminAreaPath)
if(adminAreaPath.includes('admin')){
    initAdmin(socket);
    socket.emit('join','adminRoom')
}
socket.on('orderUpdated',(data) =>{
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    notie.alert({
        type: 'success',
        text: 'Order Updated',
        time: 1,
        position: 'top'
    })
})
