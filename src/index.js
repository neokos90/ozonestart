'use strict';
//чекбокс

function toggleCheckbox() {
    const checkbox = document.querySelectorAll('.filter-check_checkbox');

    checkbox.forEach((elem) => {
        elem.addEventListener('change', function () {
            if (this.checked) {
                this.nextElementSibling.classList.add("checked");
            } else {
                this.nextElementSibling.classList.remove("checked");
            }
        });
    });
}



//end чекбокс

//корзина
function toggleCart() {
    const btnCart = document.getElementById('cart');
    const modalCart = document.querySelector('.cart');
    const closeBtn = document.querySelector('.cart-close');

    btnCart.addEventListener('click', () => {
        modalCart.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });

    closeBtn.addEventListener('click', () => {
        modalCart.style.display = 'none';
        document.body.style.overflow = '';
    });
}



//end корзина

// добавление/удаление товара
function addCart() {
    const cards = document.querySelectorAll('.goods .card'),
        cartWrapper = document.querySelector('.cart-wrapper'),
        cartEmpty = document.getElementById('cart-empty'),
        countGoods = document.querySelector('.counter');

    cards.forEach((card) => {
        const btn = card.querySelector('button');
        btn.addEventListener('click', () => {
            const cardClone = card.cloneNode(true);
            cartWrapper.appendChild(cardClone);
            showData();

            const removeBtn = cardClone.querySelector('.btn');
            removeBtn.textContent = 'Удалить из корзины';
            removeBtn.addEventListener('click', () => {
                cardClone.remove();
                showData();
            });


        });
    });

    function showData() {
        const cardsCart = cartWrapper.querySelectorAll('.card'),
            cardsPrice = cartWrapper.querySelectorAll('.card-price'),
            cardTotal = document.querySelector('.cart-total span');

        countGoods.textContent = cardsCart.length;

        let sum = 0;
        cardsPrice.forEach((cardPrice) => {
            let price = parseFloat(cardPrice.textContent);
            sum += price;
        });

        cardTotal.textContent = sum;

        if (cardsCart.length !== 0) {
            cartEmpty.remove();
        } else {
            cartWrapper.appendChild(cartEmpty);
        }
    }
}

//end добавление/удаление


function actionPage() {

    const cards = document.querySelectorAll('.goods .card'),
        discountCheckbox = document.getElementById('discount-checkbox'),
        min = document.getElementById('min'),
        max = document.getElementById('max'),
        search = document.querySelector('.search-wrapper_input'),
        searchBtn = document.querySelector('.search-btn');


    //фильтр по акции
    discountCheckbox.addEventListener('click', filter);



    //фильтр по цене
    min.addEventListener('change', filter);
    max.addEventListener('change', filter);


    // Функция, объединяющая фильтр по цене и по акции
    function filter(){
        cards.forEach((card) => {
            const cardPrice = card.querySelector('.card-price'),
            price = parseFloat(cardPrice.textContent),
            discount = card.querySelector('.card-sale');

            if ((min.value && price < min.value) || (max.value && price > max.value)){
                card.parentNode.style.display = 'none';                
            } else if(discountCheckbox.checked && !discount){
                card.parentNode.style.display = 'none';
            } else {
                card.parentNode.style.display = '';
            }
        });
    }

    //поиск
    searchBtn.addEventListener('click', () => {
        const searchText = new RegExp(search.value.trim(), 'i');
        cards.forEach((card) => {
            const title = card.querySelector('.card-title');
            if (!searchText.test(title.textContent)) {
            
                card.parentNode.style.display = 'none';
            } else {
                card.parentNode.style.display = '';
            }
        });
        search.value = '';

    });
}

// Получение данных с сервера

function getData(){
    const goodsWrapper = document.querySelector('.goods');
    fetch('../db/db.json')
        .then((response) => {
            if(response.ok){
                return response.json();
            } else {
                throw new Error('Данные не были получены, ошибка: ' + response.status);
            }           

        })
        .then(data => renderCards(data))
        .catch((err) => {
            console.warn(err);
            goodsWrapper.innerHTML = '<div style="color:red; font-size: 30px">Упс, что-то пошло не так!</div>';
        });    
}
// Вывод карточет товара
function renderCards(data){
    const goodsWrapper = document.querySelector('.goods');
    data.goods.forEach(() => {
        const card = document.createElement('div');
        card.className = 'col-12 col-md-6 col-lg-4 col-xl-3';
        card.innerHTML = `
                <div class="card">
                    <div class="card-sale">🔥Hot Sale🔥</div>
                    <div class="card-img-wrapper">
                        <span class="card-img-top"
                            style="background-image: url('https://cdn1.ozone.ru/multimedia/c400/1027495663.jpg')"></span>
                    </div>
                    <div class="card-body justify-content-between">
                        <div class="card-price">16499 ₽</div>
                        <h5 class="card-title">Игровая приставка Sony PlayStation 3 Super Slim</h5>
                        <button class="btn btn-primary">В корзину</button>
                    </div>
                </div>
    `;
     goodsWrapper.appendChild(card);   

    });

}
// end получение данных с сервера


getData();
toggleCheckbox();
toggleCart();
addCart();
actionPage();
