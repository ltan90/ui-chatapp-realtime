//Discount Offer
if(document.querySelector('.offer-js')) document.querySelector('.offer-js').addEventListener('click', function(){    
    let coupon = document.querySelector('.offer-group-js'); 
    if(coupon.checked){
        discountOffer(coupon.value);
        displayCartOrder();
    }else{
        document.querySelector('.alert--error').style.display = 'block';
    }
});
document.querySelector('.discount-js').addEventListener('click', function(){   
    let coupon = document.querySelector('.discount-group-js'); 
    if(coupon.value != ""){        
        this.previousElementSibling.lastElementChild.classList.remove('frm__error--block');
        discountOffer(coupon.value);
        displayCartOrder();
    }else{
        this.previousElementSibling.lastElementChild.classList.add('frm__error--block');
    }
});
/*View products*/
function viewSubProduct(){
    let viewProductDescription = document.querySelectorAll('.view-js');
    for(let i = 0; i < viewProductDescription.length; i++){
        viewProductDescription[i].addEventListener('click', function(e){
            e.preventDefault();
            this.classList.toggle('products__view--active');
            this.nextElementSibling.classList.toggle('active');
        });
    }
}
function displayCartOrder() {
    let cartArray = shoppingCart.listCart();    
    let output = "";
    let coupon = '';
    for(let i in cartArray) {
        let sub = "";
        let listOption = '';
        let listSubProduct = '';  
        coupon = cartArray[i].discount == 0 ? '' : cartArray[i].discount.coupon;
        if (cartArray[i].product.subscription !== ''){
            sub = "<span class='products__view fs-14 view-js'>View detail</span>"
                +"<div class='products__summary item__checkout'>"
                    +"<dl class='item__dl'>"
                        + "<dt class='item__dt'>Subscription:</dt>"
                        + "<dd>"+ cartArray[i].product.subscription +"</dd>"
                    + "</dl>"
                + "</div>";
        }
        if (cartArray[i].product.product_sub.length > 0){
            let subProduct = cartArray[i].product.product_sub;
            for(let j = 0; j < subProduct.length; j++){
                listSubProduct += '<p class="mb-0">'
                                + subProduct[j].qty + 'x '
                                + subProduct[j].name
                                + '<span class="quantity"> $'+subProduct[j].price + '</span>'
                                +'</p>';
            }
            sub = "<span class='products__view fs-14 view-js'>View detail</span>"
                +"<div class='products__summary item__checkout'>"
                    + "<dl class='item__dl'>"
                        + "<dt class='item__label'>Products:</dt>"
                        + "<dd class='item__dd'>"
                            + listSubProduct
                        +"</dd>"
                    + "</dl>"
                + "</div>";   
        }
        output += "<div class='row'>"
                    + "<div class='products__col col__4 col__sm__3 text-center pr-0'>"
                        + "<img src='"+cartArray[i].product.image+"' alt='"+ cartArray[i].product.name +"' width='75px'>"
                    + "</div>"
                    + "<div class='col__8 col__sm__9'>"                        
                        + "<a href='#' class='products__text products__title'>"+ cartArray[i].product.name +"</a>"
                        + "<p class='products__text'>Qty: "+cartArray[i].count+"</p>"
                        + "<p class='products__text products__price'>$"+Number(cartArray[i].product.price*cartArray[i].count).toFixed(2)+"</p>"
                        + sub
                    + "</div>"
                +  "</div><hr class='hr'/>";
    }
    let shippingMethod = localStorage.getItem('shipping-method');        
    shippingMethod = shippingMethod == null || shippingMethod == '' ? 0 : parseFloat(shippingMethod.split(",")[2]);
    document.querySelector('.show-cart-js').innerHTML = output;
    document.getElementById('product-cost-js').innerText = shoppingCart.totalCart();
    document.getElementById('subtotal-cart-js').innerText = Number(shoppingCart.subTotalCart() + shippingMethod).toFixed(2);
    document.getElementById('total-place-js').innerText = Number(shoppingCart.subTotalCart() + shippingMethod).toFixed(2);
    document.getElementById('hidden-subtotal').value = shoppingCart.subTotalCart();
    if(shoppingCart.totalDiscount() === 0){
        document.getElementById('total-discount-js').innerText = 0;
        document.querySelector('.total-discount-js').classList.remove('discount--active');
    }else{
        document.querySelector('.text-coupon-js').innerText = coupon;
        document.querySelector('.total-discount-js').classList.add('discount--active');
        document.getElementById('total-discount-js').innerText = shoppingCart.totalDiscount();
    }
    viewSubProduct();
}
displayCartOrder(); 