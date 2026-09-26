// console.clear()

// let id = location.search.split('?')[1]
// console.log(id)

// if(document.cookie.indexOf(',counter=')>=0)
// {
//     let counter = document.cookie.split(',')[1].split('=')[1]
//     document.getElementById("badge").innerHTML = counter
// }

// function dynamicContentDetails(ob)
// {
//     let mainContainer = document.createElement('div')
//     mainContainer.id = 'containerD'
//     document.getElementById('containerProduct').appendChild(mainContainer);

//     let imageSectionDiv = document.createElement('div')
//     imageSectionDiv.id = 'imageSection'

//     let imgTag = document.createElement('img')
//      imgTag.id = 'imgDetails'
//      //imgTag.id = ob.photos
//      imgTag.src = ob.preview

//     imageSectionDiv.appendChild(imgTag)

//     let productDetailsDiv = document.createElement('div')
//     productDetailsDiv.id = 'productDetails'

//     // console.log(productDetailsDiv);

//     let h1 = document.createElement('h1')
//     let h1Text = document.createTextNode(ob.name)
//     h1.appendChild(h1Text)

//     let h4 = document.createElement('h4')
//     let h4Text = document.createTextNode(ob.brand)
//     h4.appendChild(h4Text)
//     console.log(h4);

//     let detailsDiv = document.createElement('div')
//     detailsDiv.id = 'details'

//     let h3DetailsDiv = document.createElement('h3')
//     let h3DetailsText = document.createTextNode('Rs ' + ob.price)
//     h3DetailsDiv.appendChild(h3DetailsText)

//     let h3 = document.createElement('h3')
//     let h3Text = document.createTextNode('Description')
//     h3.appendChild(h3Text)

//     let para = document.createElement('p')
//     let paraText = document.createTextNode(ob.description)
//     para.appendChild(paraText)

//     let productPreviewDiv = document.createElement('div')
//     productPreviewDiv.id = 'productPreview'

//     let h3ProductPreviewDiv = document.createElement('h3')
//     let h3ProductPreviewText = document.createTextNode('Product Preview')
//     h3ProductPreviewDiv.appendChild(h3ProductPreviewText)
//     productPreviewDiv.appendChild(h3ProductPreviewDiv)

//     let i;
//     for(i=0; i<ob.photos.length; i++)
//     {
//         let imgTagProductPreviewDiv = document.createElement('img')
//         imgTagProductPreviewDiv.id = 'previewImg'
//         imgTagProductPreviewDiv.src = ob.photos[i]
//         imgTagProductPreviewDiv.onclick = function(event)
//         {
//             console.log("clicked" + this.src)
//             imgTag.src = ob.photos[i]
//             document.getElementById("imgDetails").src = this.src 

//         }
//         productPreviewDiv.appendChild(imgTagProductPreviewDiv)
//     }

//     let buttonDiv = document.createElement('div')
//     buttonDiv.id = 'button'

//     function addProductToCart() {
//         let cart = JSON.parse(localStorage.getItem("cart")) || [];

//         let existingProduct = cart.find(item => item.id == ob.id);

//         if (existingProduct) {
//             existingProduct.qty += 1;
//         } else {
//             cart.push({
//                 id: ob.id,
//                 name: ob.name,
//                 brand: ob.brand,
//                 price: ob.price,
//                 image: ob.preview,
//                 qty: 1
//             });
//         }

//         localStorage.setItem("cart", JSON.stringify(cart));

//         let totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

//         if (document.getElementById("badge")) {
//             document.getElementById("badge").innerHTML = totalItems;
//         }
//     }

//     let addToCartButton = document.createElement('button')
//     addToCartButton.textContent = 'Add to Cart'
//     addToCartButton.onclick = function () {
//         addProductToCart();
//         alert('Added to Cart!');
//     }
//     buttonDiv.appendChild(addToCartButton)

//     let buyNowButton = document.createElement('button')
//     buyNowButton.textContent = 'Buy Now'
//     buyNowButton.onclick = function () {
//         addProductToCart();
//         window.location.href = 'cart.html';
//     }
//     buttonDiv.appendChild(buyNowButton)


//     console.log(mainContainer.appendChild(imageSectionDiv));
//     mainContainer.appendChild(imageSectionDiv)
//     mainContainer.appendChild(productDetailsDiv)
//     productDetailsDiv.appendChild(h1)
//     productDetailsDiv.appendChild(h4)
//     productDetailsDiv.appendChild(detailsDiv)
//     detailsDiv.appendChild(h3DetailsDiv)
//     detailsDiv.appendChild(h3)
//     detailsDiv.appendChild(para)
//     productDetailsDiv.appendChild(productPreviewDiv)


//     productDetailsDiv.appendChild(buttonDiv)


//     return mainContainer
// }



// // BACKEND CALLING

// let httpRequest = new XMLHttpRequest()
// {
//     httpRequest.onreadystatechange = function()
//     {
//         if(this.readyState === 4 && this.status == 200)
//         {
//             console.log('connected!!');
//             let contentDetails = JSON.parse(this.responseText)
//             {
//                 console.log(contentDetails);
//                 dynamicContentDetails(contentDetails)
//             }
//         }
//         else
//         {
//             console.log('not connected!');
//         }
//     }
// }

// httpRequest.open('GET', 'https://5d76bf96515d1a0014085cf9.mockapi.io/product/'+id, true)
// httpRequest.send()  

const API_BASE_URL = "https://e-commerce-shopping-website-swamini.onrender.com";

const urlParams = new URLSearchParams(location.search);
const productId = urlParams.get('id');

function formatPrice(price) {
    if (!price) return "₹0";
    return "₹" + Number(price).toLocaleString('en-IN');
}

async function updateCartBadge() {
    const badge = document.getElementById("badge");
    if (!badge) return;

    const token = localStorage.getItem('token');
    if (!token) {
        badge.innerHTML = "0";
        return;
    }

    try {
        const res = await fetch(`${API_BASE_URL}/api/cart`, {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const data = await res.json();
        if (res.ok && data.success && data.cart) {
            const totalItems = data.cart.items.reduce((sum, item) => sum + item.quantity, 0);
            badge.innerHTML = totalItems;
        }
    } catch (err) {
        console.error('Failed to fetch cart count:', err);
    }
}

async function addProductToCart(product) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in to add items to your cart.');
        window.location.href = 'login.html';
        return false;
    }

    try {
        const res = await fetch(`${API_BASE_URL}/api/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ productId: product._id, quantity: 1 })
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
            alert(data.message || 'Failed to add item to cart.');
            return false;
        }

        updateCartBadge();
        return true;
    } catch (err) {
        console.error('Add to cart failed:', err);
        alert('Something went wrong while adding to cart.');
        return false;
    }
}

function dynamicContentDetails(product) {
    const mainContainer = document.createElement('div');
    mainContainer.id = 'containerD';
    document.getElementById('containerProduct').appendChild(mainContainer);

    const imageSectionDiv = document.createElement('div');
    imageSectionDiv.id = 'imageSection';

    const imgTag = document.createElement('img');
    imgTag.id = 'imgDetails';
    imgTag.src = product.image;

    imageSectionDiv.appendChild(imgTag);

    const productDetailsDiv = document.createElement('div');
    productDetailsDiv.id = 'productDetails';

    const h1 = document.createElement('h1');
    h1.appendChild(document.createTextNode(product.name));

    const h4 = document.createElement('h4');
    h4.appendChild(document.createTextNode(product.brand || ""));

    const detailsDiv = document.createElement('div');
    detailsDiv.id = 'details';

    const h3Price = document.createElement('h3');
    h3Price.appendChild(document.createTextNode(formatPrice(product.price)));

    const h3Desc = document.createElement('h3');
    h3Desc.appendChild(document.createTextNode('Description'));

    const para = document.createElement('p');
    para.appendChild(document.createTextNode(product.description || ""));

    const buttonDiv = document.createElement('div');
    buttonDiv.id = 'button';

    const addToCartButton = document.createElement('button');
    addToCartButton.textContent = 'Add to Cart';
    addToCartButton.onclick = async function () {
        const success = await addProductToCart(product);
        if (success) alert('Added to Cart!');
    };
    buttonDiv.appendChild(addToCartButton);

    const buyNowButton = document.createElement('button');
    buyNowButton.textContent = 'Buy Now';
    buyNowButton.onclick = async function () {
        const success = await addProductToCart(product);
        if (success) window.location.href = 'checkout.html';
    };
    buttonDiv.appendChild(buyNowButton);

    mainContainer.appendChild(imageSectionDiv);
    mainContainer.appendChild(productDetailsDiv);
    productDetailsDiv.appendChild(h1);
    productDetailsDiv.appendChild(h4);
    productDetailsDiv.appendChild(detailsDiv);
    detailsDiv.appendChild(h3Price);
    detailsDiv.appendChild(h3Desc);
    detailsDiv.appendChild(para);
    productDetailsDiv.appendChild(buttonDiv);

    return mainContainer;
}

async function loadProductDetails() {
    if (!productId) {
        console.error('No product id in URL');
        return;
    }

    try {
        const res = await fetch(`${API_BASE_URL}/api/products/${productId}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
            console.error('Product not found');
            return;
        }

        dynamicContentDetails(data.product);
    } catch (err) {
        console.error('Failed to fetch product details:', err);
    }
}

loadProductDetails();
updateCartBadge();